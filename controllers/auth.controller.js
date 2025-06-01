const users = require("../db/users.db");
const { generateToken } = require("../utils/generateToken");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

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

    return res.status(200).json({
      message: "Login successful",
      user: {
        email,
        name: user.name,
        id: user._id,
        role: user.role,
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

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });

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
    const allUsers = await users.find({});

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
