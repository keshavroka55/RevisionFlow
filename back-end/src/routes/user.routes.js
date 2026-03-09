import express from "express";
import * as UserController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/me", authenticate, UserController.getMyProfile);
router.put("/me", authenticate, UserController.updateMyProfile);

router.get("/:id", UserController.getUserById);

router.get("/admin/all", authenticate, UserController.getAllUsers);

router.delete("/:id", authenticate, UserController.deleteUser);

export default router;