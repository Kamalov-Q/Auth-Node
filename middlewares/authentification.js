const jwt = require("jsonwebtoken");
const ensureAuthentification = (req, res, next) => {
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

  try {
    const decoded = jwt.verify(String(token), String(process.env.JWT_SECRET));
    req.user = decoded;
    console.log(decoded, "decoded");

    next();
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = ensureAuthentification;
