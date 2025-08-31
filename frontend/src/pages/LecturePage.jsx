import { useParams, Link } from "react-router-dom";

export default function LecturePage() {
  const { classId } = useParams();

  // Dummy lecture data (replace with API later)
  const lecturesData = {
    "mathematics-101": [
      { id: 1, title: "Introduction to Limits", date: "2025-08-01" },
      { id: 2, title: "Differentiation Basics", date: "2025-08-05" },
    ],
    "physics-201": [
      { id: 1, title: "Wave-Particle Duality", date: "2025-08-02" },
      { id: 2, title: "Schrödinger Equation", date: "2025-08-06" },
    ],
    "chemistry-101": [
      { id: 1, title: "Introduction to Organic Chemistry", date: "2025-08-03" },
      { id: 2, title: "Hydrocarbons", date: "2025-08-07" },
    ],
  };

  const lectures = lecturesData[classId] || [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with create lecture button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            📖 Lectures for {classId.replace("-", " ")}
          </h2>
          <Link
            to={`/lectures/${classId}/create`}
            className="px-4 py-2 bg-[#ca3500] text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            <i className="fa-solid fa-plus"></i> Create Lecture
          </Link>
        </div>

        {/* Lectures List */}
        {lectures.length > 0 ? (
          <ul className="space-y-3">
            {lectures.map((lecture) => (
              <li key={lecture.id}>
                <Link
                  to={`/lectures/${classId}/${lecture.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold">{lecture.title}</h3>
                  <p className="text-sm text-gray-500">📅 {lecture.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No lectures available yet.</p>
        )}
      </div>
    </div>
  );
}
