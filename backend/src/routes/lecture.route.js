import { Router } from "express";
import createLecture from "../controllers/createLecture.controller.js";

const router = Router()

import multer from "multer";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const upload = multer({ dest: "uploads/" });

// Upload single file under field name "audio"
router.post(
    "/:classId/create",
    verifyJWT,
    upload.single("audio"),
    createLecture
  );

export default router;
