const DataStore = require("nedb-promises");

const users = DataStore.create({
  filename: "./data/users.db",
  autoload: true,
});

const userRefreshToken = DataStore.create({
  filename: "./data/userRefreshToken.db",
  autoload: true,
});

const userInvalidToken = DataStore.create({
  filename: "./data/userInvalidToken.db",
  autoload: true,
});

module.exports = { users, userRefreshToken, userInvalidToken };
