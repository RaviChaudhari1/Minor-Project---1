import { Classroom } from "../models/classroom.model.js";

export const createClass = async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ message: "Name and subject are required" });
    }

    const newClass = new Classroom({
      name,
      subject,
      description,
      teacher: req.user._id   // ✅ whoever created becomes teacher
    });

    await newClass.save();

    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Server error" });
  }
};
