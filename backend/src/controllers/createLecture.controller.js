// controllers/createLecture.controller.js
import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createLecture = async (req, res) => {
  try {
    console.log(req.body);
    
    const { classId } = req.params;
    const { title, description, date } = req.body;
    const userId = req.user._id; // from verifyJWT middleware

    // Check class exists
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check teacher
    if (String(classroom.teacher) !== String(userId)) {
      return res
        .status(403)
        .json({ error: "Only class teacher can create lectures" });
    }

    // Handle file if uploaded
    let audioUrl = null;
    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      audioUrl = uploadRes?.secure_url;
    }

    // Create lecture
    const lecture = new Lecture({
      title,
      description,
      date,
      audio: audioUrl,
      createdBy: userId,
      classroom: classId,
    });

    await lecture.save();
    res.status(201).json({
      message: "Lecture created successfully",
      lecture,
    });
  } catch (err) {
    console.error("Create lecture error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default createLecture;
