import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";

const deleteLecture = async (req, res) => {
  try {
    const { className, lectureId } = req.params;
    const userId = req.user._id;

    // Check class exists by name
    const classroom = await Classroom.findOne({ name: className });
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if user is the teacher of the class
    if (String(classroom.teacher) !== String(userId)) {
      return res.status(403).json({ error: "Only class teacher can delete lectures" });
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
      return res.status(403).json({ error: "Only the teacher who created this lecture can delete it" });
    }

    // Delete the lecture
    await Lecture.findByIdAndDelete(lectureId);

    // Remove lecture reference from classroom
    await Classroom.findByIdAndUpdate(classroom._id, {
      $pull: { lectures: lectureId }
    });

    res.status(200).json({ 
      message: "Lecture deleted successfully" 
    });
  } catch (err) {
    console.error("Delete lecture error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default deleteLecture;
