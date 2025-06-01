const express = require("express");
const router = express.Router();

const validateLoginBody = require("../middlewares/validateLoginBody");
const validateRegisterBody = require("../middlewares/validateRegisterBody");

const authController = require("../controllers/auth.controller");
const ensureAuthentification = require("../middlewares/authentification");
const ensureAuthorizeUser = require("../middlewares/authorizeUser");

router.post("/register", validateRegisterBody, authController.register);
router.post("/login", validateLoginBody, authController.login);

router.get(
  "/users/current",
  ensureAuthentification,
  authController.getCurrentUser
);
router.get(
  "/users/all",
  ensureAuthentification,
  ensureAuthorizeUser(["admin", "moderator", "director", "superadmin"]),
  authController.getAllUsers
);

router.get(
  "/moderator/users",
  ensureAuthentification,
  ensureAuthorizeUser(["moderator", "admin", "director", "superadmin"]),
  authController.getModeratorUsers
);

router.get(
  "/admin/users",
  ensureAuthentification,
  ensureAuthorizeUser(["admin", "director", "superadmin"]),
  authController.getAdminUsers
);

router.get(
  "/director/users",
  ensureAuthentification,
  ensureAuthorizeUser(["director", "superadmin"]),
  authController.getDirectorUsers
);

router.get(
  "/superadmin/users",
  ensureAuthentification,
  ensureAuthorizeUser(["superadmin"]),
  authController.getSuperAdminUsers
);

module.exports = router;
