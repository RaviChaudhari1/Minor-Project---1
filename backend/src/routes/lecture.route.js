import { Router } from "express";
import createLecture from "../controllers/createLecture.controller.js";
import editLecture from "../controllers/editLecture.controller.js";
import deleteLecture from "../controllers/deleteLecture.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // ✅ use this
import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";

const router = Router();

// Get lectures for a specific class
router.get("/:className", verifyJWT, async (req, res) => {
  try {
    const { className } = req.params;
    
    // Find classroom by name
    const classroom = await Classroom.findOne({ name: className });
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Get lectures for this classroom
    const lectures = await Lecture.find({ classroom: classroom._id })
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.status(200).json(lectures);
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific lecture by ID
router.get("/:className/:lectureId", verifyJWT, async (req, res) => {
  try {
    const { className, lectureId } = req.params;
    
    // Find classroom by name
    const classroom = await Classroom.findOne({ name: className });
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Get specific lecture
    const lecture = await Lecture.findOne({ 
      _id: lectureId, 
      classroom: classroom._id 
    }).populate("createdBy", "name email");

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    res.status(200).json(lecture);
  } catch (error) {
    console.error("Error fetching lecture:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload single file under field name "audio"
router.post("/:className/create", verifyJWT, upload.single("audio"), createLecture);

// Edit lecture
router.put("/:className/:lectureId", verifyJWT, upload.single("audio"), editLecture);

// Delete lecture
router.delete("/:className/:lectureId", verifyJWT, deleteLecture);

export default router;
