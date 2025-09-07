import fs from "fs/promises";
import path from "path";
import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const editLecture = async (req, res) => {
  try {
    const { className, lectureId } = req.params;
    const { title, description, date } = req.body;
    const userId = req.user._id;

    // Check class exists by name
    const classroom = await Classroom.findOne({ name: className });
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if user is the teacher of the class
    if (String(classroom.teacher) !== String(userId)) {
      return res.status(403).json({ error: "Only class teacher can edit lectures" });
    }

    // Find the lecture
    const lecture = await Lecture.findOne({ 
      _id: lectureId, 
      classroom: classroom._id 
    });

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Check if the lecture was created by the current user
    if (String(lecture.createdBy) !== String(userId)) {
      return res.status(403).json({ error: "Only the teacher who created this lecture can edit it" });
    }

    // Handle audio file upload if provided
    let audioUrl = lecture.audioUrl; // Keep existing audio if no new file uploaded

    if (req.file) {
      // Upload new audio file
      const uploadRes = await uploadOnCloudinary(req.file.path);
      audioUrl = uploadRes?.secure_url;
      
      // Delete temp file
      const filePath = path.resolve(req.file.path);
      fs.unlink(filePath).catch((err) => {
        if (err.code !== "ENOENT") {
          console.warn("Temp file deletion failed:", err.message);
        }
      });
    }

    // Update lecture
    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        title: title || lecture.title,
        description: description !== undefined ? description : lecture.description,
        date: date || lecture.date,
        audioUrl: audioUrl,
      },
      { new: true }
    ).populate("createdBy", "name email");

    res.status(200).json({ 
      message: "Lecture updated successfully", 
      lecture: updatedLecture 
    });
  } catch (err) {
    console.error("Edit lecture error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default editLecture;
