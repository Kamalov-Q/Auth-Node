const jwt = require("jsonwebtoken");
const { userInvalidToken } = require("../db/users.db");
const ensureAuthentification = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !String(authHeader).startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized : Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (await userInvalidToken.findOne({ accessToken: token })) {
    return res.status(401).json({ message: "Unauthorized: Token is invalid" });
  }

  try {
    const decoded = jwt.verify(String(token), String(process.env.JWT_SECRET));
    req.accessToken = { value: token, exp: decoded.exp };
    req.user = decoded;
    next();  
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Unauthorized: Token expired",
        code: "AccessTokenExpired",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
        code: "AccessTokenInvalid",
      });
    } else {
      console.error("Error verifying token", error);
      res
        .status(401)
        .json({ message: `Error verifying token :  ${error.message}` });
    }

    console.error("Token error : ", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = ensureAuthentification;
