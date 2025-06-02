const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  try {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        subject: "accessApi",
        expiresIn: String(process.env.ACCESS_TOKEN_EXPIRATION),
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating token for user", error);
  }
};

exports.generateRefreshToken = (user) => {
  try {
    const refreshToken = jwt.sign(
      { userId: user?._id, email: user?.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        subject: "refreshToken",
        expiresIn: String(process.env.REFRESH_TOKEN_EXPIRATION),
      }
    );

    return refreshToken;
  } catch (error) {
    console.error("Error generating token for user", error);
  }
};
