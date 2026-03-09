import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createFolderSchema, updateFolderSchema, reorderFoldersSchema } from "../validators/folder.validator.js";
import { createFolder, getFolders, getFolderById, updateFolder, deleteFolder, reorderFolders } from "../controllers/folder.controller.js";

const router = Router();

router.use(authenticate);

router.patch("/reorder", validate(reorderFoldersSchema), reorderFolders); // before /:id
router.post("/", validate(createFolderSchema), createFolder);
router.get("/", getFolders);
router.get("/:id", getFolderById);
router.patch("/:id", validate(updateFolderSchema), updateFolder);
router.delete("/:id", deleteFolder);

export default router;