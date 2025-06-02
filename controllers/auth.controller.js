const jwt = require("jsonwebtoken");
const {
  generateToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { users, userRefreshToken, userInvalidToken } = require("../db/users.db");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ message: "Please provide all the required fields" });
    }

    const hashedPassword = await hashPassword(password);

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await users.insert({
      name,
      email,
      password: hashedPassword,
      role: role ?? "user",
    });

    const accessToken = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        name,
        email,
        id: newUser._id,
        password: hashedPassword,
        role: role ?? "user",
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ message: "Please provide all the required fields" });
    }

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await userRefreshToken.insert({
      userId: user._id,
      refreshToken,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        email,
        name: user.name,
        id: user._id,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(422).json({ message: "Please provide refresh token" });
    }

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await users.findOne({ _id: decodedRefreshToken.userId });

    console.log(decodedRefreshToken, "decodedRefreshToken");

    const userRefToken = await userRefreshToken.findOne({
      refreshToken,
      userId: decodedRefreshToken.userId,
    });

    if (!userRefToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    await userRefreshToken.remove({ _id: userRefToken._id });
    await userRefreshToken.compactDatafile();

    const accessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await userRefreshToken.insert({
      refreshToken: newRefreshToken,
      userId: decodedRefreshToken.userId,
    });

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res
        .status(401)
        .json({ message: "Refresh token invalid or expired" });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.logout = async (req, res) => {
  try {
    await userRefreshToken.removeMany({ userId: req.user.id });
    await userRefreshToken.compactDatafile();

    await userInvalidToken.insert({
      accessToken: req.accessToken.value,
      userId: req.user.id,
      expirationTime: req.accessToken.exp,
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });

    console.log(user, "User from current user");

    return res.status(200).json({
      name: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find();

    return res.status(200).json({
      message: "All users Everyone can access except the user",
      allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

//Create a moderator role
exports.createModerator = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || String(email).trim() == "") {
      return res
        .status(422)
        .json({ message: "Please provide a valid email address" });
    }

    if (!name || String(name).trim() == "") {
      return res.status(422).json({ message: "Please provide a valid name" });
    }

    if (!password || String(password).trim() == "") {
      return res
        .status(422)
        .json({ message: "Please provide a valid password" });
    }

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await users.insert({
      email,
      name,
      password: hashedPassword,
      role: "moderator",
    });

    const accessToken = generateToken(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        id: newUser._id,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

//Update a moderator role
exports.updateModerator = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { email, name } = req.body;
    if (!email || !name) {
      return res
        .status(422)
        .json({ message: "Please provide all the required fields" });
    }

    const existingUser = await users.findOne({ _id });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await users.update({ _id }, { $set: { name, email } }, { upsert: true });

    const user = await users.findOne({ _id });

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

//Update a moderator by higher roles
exports.updateModeratorByRoles = async (req, res) => {
  try {
    const { modId: _id } = req.params;
    const { name, email, password } = req.body;

    // if (!name || !email || !password) {
    //   return res
    //     .status(422)
    //     .json({ message: "Please provide all the required fields" });
    // }

    const existingUser = await users.findOne({ _id });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await hashPassword(password);

    await users.update(
      { _id },
      { $set: { name, email, password: hashedPassword } },
      { upsert: true }
    );

    const user = await users.findOne({ _id });

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.deleteModerator = async (req, res) => {
  try {
    const { modId: _id } = req.params;

    if (!_id) {
      return res
        .status(422)
        .json({ message: "Please provide all the required fields" });
    }

    const existingUser = await users.findOne({ _id });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await users.remove({ _id });

    const deletedModerator = await users.findOne({ _id });

    return res.status(200).json({
      message: "User deleted successfully",
      deletedModerator,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.getModeratorUsers = async (req, res) => {
  try {
    return res.status(200).json({
      message:
        "Only Moderators, admins, directors and superadmins can access this route And you are one of them. Welcome Back sir",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });

    return res.status(200).json({
      message: `Only Admins, directors and superadmins can access this route And you are admin!!! Your role is ${user.role}. Welcome Back sir`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.getDirectorUsers = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });

    return res.status(200).json({
      message: `Only Directors and superadmins can access this route Your role is ${user.role}. Welcome Back sir`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

exports.getSuperAdminUsers = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });
    return res.status(200).json({
      message: `Only SuperAdmins can access this route Your role is ${user.role}. Welcome Back sir`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};

// user, moderator, admin, director, superadmin
