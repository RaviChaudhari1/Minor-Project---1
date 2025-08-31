import { useParams } from "react-router-dom";

export default function LectureDetailPage() {
  const { classId, lectureId } = useParams();

  // Dummy data (replace later with API fetch)
  const lecturesData = {
    "mathematics-101": [
      {
        id: 1,
        title: "Introduction to Limits",
        description: "Basics of limits and continuity.",
        transcription: "In this lecture, we explore the concept of limits...",
        audioUrl: "/audios/limits.mp3",
        date: "2025-08-01",
      },
      {
        id: 2,
        title: "Differentiation Basics",
        description: "Understanding the fundamentals of derivatives.",
        transcription: "Differentiation allows us to calculate rates of change...",
        audioUrl: "/audios/differentiation.mp3",
        date: "2025-08-05",
      },
    ],
  };

  const lecture =
    lecturesData[classId]?.find(
      (lec) => lec.id.toString() === lectureId
    ) || null;

  if (!lecture) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700">
          Lecture not found.
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{lecture.title}</h2>
      <p className="text-gray-600 italic">📅 {lecture.date}</p>

      <p className="text-gray-700">
        <span className="font-semibold">Description: </span>
        {lecture.description}
      </p>

      <div>
        <h3 className="font-semibold text-lg mb-2">📝 Transcription</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {lecture.transcription}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">🎧 Audio Lecture</h3>
        <audio controls className="w-full">
          <source src={lecture.audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
