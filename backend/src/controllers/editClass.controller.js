import { Classroom } from "../models/classroom.model.js";

export const editClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name, subject, description } = req.body;
    const userId = req.user._id;

    // Find the class
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if user is the teacher who created the class
    if (String(classroom.teacher) !== String(userId)) {
      return res.status(403).json({ error: "Only the teacher who created this class can edit it" });
    }

    // Update the class
    const updatedClass = await Classroom.findByIdAndUpdate(
      classId,
      {
        name: name || classroom.name,
        subject: subject || classroom.subject,
        description: description !== undefined ? description : classroom.description,
      },
      { new: true }
    ).populate("teacher", "name email");

    res.status(200).json({ 
      message: "Class updated successfully", 
      class: updatedClass 
    });
  } catch (err) {
    console.error("Edit class error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
