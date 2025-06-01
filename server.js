const express = require("express");
const router = require("./routes/auth.route");
const { config } = require("dotenv");
const cors = require("cors");
const bodyChecker = require("./middlewares/bodyChecker");
const ensureAuthentification = require("./middlewares/authentification");
const ensureAuthorizeUser = require("./middlewares/authorizeUser");
const authController = require("./controllers/auth.controller");

config();

//Initialize express
const app = express();

//Configure body parser
app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(bodyChecker);

const PORT = process.env.PORT || 3000;

app.use("/api/auth", router);

// console.log(typeof ensureAuthentification); // should be 'function'
// console.log(typeof ensureAuthorizeUser(["admin"])); // should be 'function'
// console.log(typeof authController.getAdminUsers); // should be 'function'

app.get("/", async (_, res) => {
  res.send("Working fine!");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
