const validateRegisterBody = (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(422)
        .json({ message: "Please provide name, email, and password" });
    }
    next();
  } catch (error) {
    console.error("Error validating register body", error);
    return res
      .status(500)
      .json({ message: "Internal server error during validation" });
  }
};

module.exports = validateRegisterBody;
