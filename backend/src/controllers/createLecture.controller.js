import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";

const createLecture = async (req, res) => {
  console.log("Create Lecture res:", res);
  const { classId } = req.params;
  const { title, description } = req.body;
  const userId = req.user._id; // from auth middleware
  

  const classroom = await Classroom.findById(classId);

  if (!classroom) return res.status(404).json({ error: "Class not found" });

  // Check if the logged-in user is the teacher
  if (String(classroom.teacher) !== String(userId)) {
    return res.status(403).json({ error: "Only class teacher can create lectures" });
  }

  const lecture = new Lecture({
    title,
    description,
    createdBy: userId,
    classroom: classId
  });

  await lecture.save();
  res.status(201).json(lecture);
};

export default createLecture