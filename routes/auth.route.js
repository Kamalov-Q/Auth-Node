const express = require("express");
const router = express.Router();

const validateLoginBody = require("../middlewares/validateLoginBody");
const validateRegisterBody = require("../middlewares/validateRegisterBody");

const authController = require("../controllers/auth.controller");
const ensureAuthentification = require("../middlewares/authentification");
const ensureAuthorizeUser = require("../middlewares/authorizeUser");

router.post("/register", validateRegisterBody, authController.register);
router.post("/login", validateLoginBody, authController.login);

router.get("/users/current", ensureAuthentification, authController.getCurrentUser);

router.get(
  "/admin/getUsers",
  ensureAuthentification,
  ensureAuthorizeUser(["admin"]),
  authController.getAdminUsers
);

router.get(
  "/moderator/getUsers",
  ensureAuthentification,
  ensureAuthorizeUser(["moderator", "admin"]),
  authController.getModeratorUsers
);


module.exports = router;
