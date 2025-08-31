import { Router } from "express";
import createLecture from "../controllers/createLecture.controller.js";

const router = Router()

router.route("/:classId/create").post( createLecture )

export default router;
