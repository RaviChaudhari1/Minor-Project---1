import { Router } from "express";
import createLecture from "../controllers/createLecture.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // ✅ use this

const router = Router();

// Upload single file under field name "audio"
router.post("/:classId/create", verifyJWT, upload.single("audio"), createLecture);

export default router;
