import express from "express";
import { 
  register, 
  login, 
  getMe, 
  logout,
  forgotPassword, 
  resetPasswordController 
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);


router.post("/login", login);

router.get("/me", authenticate, getMe);

router.post("/logout", authenticate, logout);

router.post("/forgot-password", forgotPassword);


router.post("/reset-password", resetPasswordController);

export default router;
