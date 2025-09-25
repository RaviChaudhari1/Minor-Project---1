import { Router } from "express";
import createLecture from "../controllers/createLecture.controller.js";
import editLecture from "../controllers/editLecture.controller.js";
import deleteLecture from "../controllers/deleteLecture.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // ✅ use this
import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";

const router = Router();

// GET today's lectures (no params needed)
router.get("/today", verifyJWT, async (req, res) => {
  console.log("helloo");
  
  try {
    // Get today's start and end time
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    

    // Find lectures created today
    const lectures = await Lecture.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate("classroom", "name") // show class name
      .populate("createdBy", "name email"); // show teacher info

      console.log("lecture data", lectures);
      
    if (!lectures || lectures.length === 0) {
      return res.status(404).json({ message: "No lectures found for today" });
    }

    res.status(200).json({ lectures });
  } catch (error) {
    console.error("Error fetching today’s lectures:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Get lectures for a specific class
router.get("/:className", verifyJWT, async (req, res) => {
  try {
    const { className } = req.params;
    
    // Find classroom by name and populate teacher
    const classroom = await Classroom.findOne({ name: className }).populate("teacher", "name email _id");
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Get lectures for this classroom
    const lectures = await Lecture.find({ classroom: classroom._id })
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({ lectures, classroom });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific lecture by ID
router.get("/:className/:lectureId", verifyJWT, async (req, res) => {
  try {
    const { className, lectureId } = req.params;
    
    // Find classroom by name and populate teacher
    const classroom = await Classroom.findOne({ name: className }).populate("teacher", "name email _id");
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

    res.status(200).json({ lecture, classroom });
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
