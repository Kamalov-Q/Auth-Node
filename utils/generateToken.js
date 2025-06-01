const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    console.error("Error generating token for user", error);
  }
};
