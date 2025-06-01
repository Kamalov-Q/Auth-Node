const validateLoginBody = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "Please provide both email and password" });
  }
  next();
};

module.exports = validateLoginBody;