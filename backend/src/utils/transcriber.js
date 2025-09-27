// utils/transcriber.js
import { exec } from "child_process";
import path from "path";

const DEFAULT_MAX_BUFFER = 20 * 1024 * 1024; // 20MB stdout buffer

export default function transcribeAudio(url) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error("Audio URL required"));

    // Adjust scriptPath to where your transcribe.py actually is.
    // If you run node from the backend folder and transcribe.py is in the same folder, this is fine:
    const scriptPath = path.resolve(process.cwd(), "transcribe.py");

    // Escape any double quotes in the URL
    const safeUrl = url.replace(/"/g, '\\"');

    const cmd = `python "${scriptPath}" "${safeUrl}"`;

    exec(cmd, { maxBuffer: DEFAULT_MAX_BUFFER }, (err, stdout, stderr) => {
      if (err) {
        console.error("Transcription process error:", stderr || err);
        return reject(err);
      }

      // stdout should be JSON printed by the Python script
      try {
        const parsed = JSON.parse(stdout);
        return resolve(parsed);
      } catch (parseErr) {
        console.error("Failed to parse transcription JSON:", parseErr, "stdout:", stdout);
        return reject(new Error("Failed to parse transcription result"));
      }
    });
  });
}















// import { exec } from "child_process";

// const transcribeAudio = async (url) => {
//     if (!url) return res.status(400).json({ error: "Audio URL required" });

//     // Call Python script with URL
//     exec(`python transcribe.py "${url}"`, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Transcription error:", stderr || err);
//         return res.status(500).json({ error: "Transcription failed" });
//       }
  
//       try {
//         const result = JSON.parse(stdout); // parse the JSON printed by Python
//         return result;
//       } catch (parseError) {
//         console.error("JSON parse error:", parseError, stdout);
//         res.status(500).json({ error: "Failed to parse transcription result" });
//       }
//     });
// }

// export default transcribeAudio;