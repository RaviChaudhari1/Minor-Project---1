import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";

export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user._id;

    // Find the class
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if user is the teacher who created the class
    if (String(classroom.teacher) !== String(userId)) {
      return res.status(403).json({ error: "Only the teacher who created this class can delete it" });
    }

    // Delete all lectures associated with this class
    await Lecture.deleteMany({ classroom: classId });

    // Delete the class
    await Classroom.findByIdAndDelete(classId);

    res.status(200).json({ 
      message: "Class and all associated lectures deleted successfully" 
    });
  } catch (err) {
    console.error("Delete class error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
