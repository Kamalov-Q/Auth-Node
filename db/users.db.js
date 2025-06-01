const DataStore = require("nedb-promises");

const users = DataStore.create({
  filename: "./data/users.db",
  autoload: true,
});

module.exports = users;