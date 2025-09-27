// your controller file (e.g. controllers/lecture.controller.js)
import fs from "fs/promises";
import path from "path";
import { Classroom } from "../models/classroom.model.js";
import { Lecture } from "../models/lecture.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import transcribeAudio from "../utils/transcriber.js";

const createLecture = async (req, res) => {
  try {
    const { className } = req.params;
    const { title, description, date } = req.body;
    const userId = req.user._id;

    // Check class exists by name
    const classroom = await Classroom.findOne({ name: className });
    if (!classroom) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check teacher
    if (String(classroom.teacher) !== String(userId)) {
      return res.status(403).json({ error: "Only class teacher can create lectures" });
    }

    let audioUrl = null;
    let transcription = null; // <<< declare it!

    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      audioUrl = uploadRes?.secure_url;

      // Resolve the full absolute path and delete temp file safely
      const filePath = path.resolve(req.file.path);
      fs.unlink(filePath).catch((err) => {
        if (err.code !== "ENOENT") {
          console.warn("Temp file deletion failed:", err.message);
        }
      });
    }

    // If we have an audio URL, transcribe it (await the Promise)
    if (audioUrl) {
      try {
        const result = await transcribeAudio(audioUrl);
        // result can be { text, language, duration } or { error: "..." }
        if (result && result.text) {
          transcription = result.text;
        } else {
          // keep full result for debugging or set null
          console.warn("Transcription returned non-text result:", result);
          transcription = result.text ?? null;
        }
      } catch (err) {
        console.warn("Transcription failed:", err.message || err);
        // decide: continue without transcription or return error
        // We'll continue without transcription
        transcription = null;
      }
    }

    const lecture = new Lecture({
      title,
      description,
      date,
      audioUrl,
      createdBy: userId,
      classroom: classroom._id,
      transcription,
    });

    await lecture.save();
    res.status(201).json({ message: "Lecture created successfully", lecture });
  } catch (err) {
    console.error("Create lecture error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default createLecture;












// import fs from "fs/promises"; // use promise-based fs
// import path from "path";
// import { Classroom } from "../models/classroom.model.js";
// import { Lecture } from "../models/lecture.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import transcribeAudio from "../utils/transcriber.js";

// const createLecture = async (req, res) => {
//   try {
//     const { className } = req.params;
//     const { title, description, date } = req.body;
//     const userId = req.user._id;

//     // Check class exists by name
//     const classroom = await Classroom.findOne({ name: className });
//     if (!classroom) {
//       return res.status(404).json({ error: "Class not found" });
//     }

//     // Check teacher
//     if (String(classroom.teacher) !== String(userId)) {
//       return res.status(403).json({ error: "Only class teacher can create lectures" });
//     }

//     let audioUrl = null;

//     if (req.file) {
//       const uploadRes = await uploadOnCloudinary(req.file.path);
//       audioUrl = uploadRes?.secure_url;
//       // console.log(req.file);
    
//       // Resolve the full absolute path
//       const filePath = path.resolve(req.file.path);
    
//       // Delete temp file safely
//       fs.unlink(filePath).catch((err) => {
//         if (err.code !== "ENOENT") {
//           console.warn("Temp file deletion failed:", err.message);
//         }
//       });
//     }

//     transcription = transcribeAudio(audioUrl)

//     if (transcription) {
//       console.log(transcription);
//     }
    

//     const lecture = new Lecture({
//       title,
//       description,
//       date,
//       audioUrl,
//       createdBy: userId,
//       classroom: classroom._id,
//       transcription
//     });


//     await lecture.save();
//     res.status(201).json({ message: "Lecture created successfully", lecture });
//   } catch (err) {
//     console.error("Create lecture error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export default createLecture;
