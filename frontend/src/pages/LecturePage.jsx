import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LecturePage({ user }) {
  const { className } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`${API}/lectures/${className}`);
        
        const token = localStorage.getItem("token");
        const lecturesResponse = await axios.get(`${API}/lectures/${className}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLectures(lecturesResponse.data.lectures);
        setClassroom(lecturesResponse.data.classroom);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLectures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [className, API]);

  const handleDeleteLecture = async () => {
    if (!selectedLecture) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/lectures/${className}/${selectedLecture._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update state locally
      setLectures((prevLectures) =>
        prevLectures.filter((lecture) => lecture._id !== selectedLecture._id)
      );

      setShowModal(false);
      setSelectedLecture(null);
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  const teacherId = classroom?.teacher?._id || classroom?.teacher;
  const isTeacher = classroom && user && String(teacherId) === String(user._id);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with create lecture button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            📖 Lectures for {classroom?.name || className.replace("-", " ")}
          </h2>
          {isTeacher && (
            <Link
              to={`/lectures/${className}/create`}
              className="px-4 py-2 bg-[#ca3500] text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              <i className="fa-solid fa-plus"></i> Create Lecture
            </Link>
          )}
        </div>

        {/* Lectures List */}
        {loading ? (
          <p className="text-gray-600">Loading lectures...</p>
        ) : lectures.length > 0 ? (
          <ul className="space-y-3">
            {lectures.map((lecture) => (
              <li key={lecture._id}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <Link
                    to={`/lectures/${className}/${lecture._id}`}
                    className="flex-1"
                  >
                    <h3 className="font-semibold">{lecture.title}</h3>
                    <p className="text-sm text-gray-500">
                      📅 {new Date(lecture.date).toLocaleDateString()}
                    </p>
                    {lecture.description && (
                      <p className="text-sm text-gray-600 mt-1">{lecture.description}</p>
                    )}
                  </Link>

                  {isTeacher && (
                    <div className="flex gap-2 ml-4">
                      <Link
                        to={`/lectures/${className}/${lecture._id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit lecture"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedLecture(lecture);
                          setShowModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete lecture"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No lectures available yet.</p>
        )}
      </div>

{/* ✅ Custom Delete Modal */}
{showModal && selectedLecture && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 w-96 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Confirm Delete
      </h3>
      <p className="text-gray-700 mb-6">
        Are you sure you want to delete lecture{" "}
        <span className="font-bold">{selectedLecture.title}</span> from{" "}
        <span className="font-bold">{classroom?.name || className}</span>?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-200/80 hover:bg-gray-300/80 backdrop-blur-sm transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteLecture}
          className="px-4 py-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition shadow"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
