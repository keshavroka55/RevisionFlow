import express from "express";
import { 
  register, 
  login, 
  getMe, 
  logout,
  forgotPassword, 
  resetPasswordController,
  registerAdmin,
  googleCallback,
} from "../controllers/authController.js";
import { allowRoles } from "../middleware/role.middleware.js";

import { authenticate } from "../middleware/authMiddleware.js";
import passport from "passport";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

router.post("/register-admin", authenticate, allowRoles("ADMIN"), registerAdmin);

// Google OAuth routes
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", {failureRedirect: "/login",session: false}),googleCallback);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);

export default router;
