const bodyChecker = (req, _, next) => {
  console.log(`Incoming ${req.method} to ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
};

module.exports = bodyChecker;
