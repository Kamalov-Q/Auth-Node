const express = require("express");
const router = express.Router();

const validateLoginBody = require("../middlewares/validateLoginBody");
const validateRegisterBody = require("../middlewares/validateRegisterBody");

const authController = require("../controllers/auth.controller");
const ensureAuthentification = require("../middlewares/authentification");
const ensureAuthorizeUser = require("../middlewares/authorizeUser");

router.post("/register", validateRegisterBody, authController.register);
router.post("/login", validateLoginBody, authController.login);
router.post("/refresh-token", authController.refreshToken);

router.get("/logout", ensureAuthentification, authController.logout);

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

router.post(
  "/moderator/create",
  ensureAuthentification,
  ensureAuthorizeUser(["admin", "director", "superadmin"]),
  authController.createModerator
);

router.get(
  "/moderator/users",
  ensureAuthentification,
  ensureAuthorizeUser(["moderator", "admin", "director", "superadmin"]),
  authController.getModeratorUsers
);

router.put(
  "/moderator/update-profile/:id",
  ensureAuthentification,
  ensureAuthorizeUser(["moderator", "admin", "director", "superadmin"]),
  authController.updateModerator
);

router.patch(
  "/moderator/update/:modId",
  ensureAuthentification,
  ensureAuthorizeUser(["admin", "director", "superadmin"]),
  authController.updateModeratorByRoles
);

router.delete(
  "/moderator/delete/:modId",
  ensureAuthentification,
  ensureAuthorizeUser(["admin", "director", "superadmin"]),
  authController.deleteModerator
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
