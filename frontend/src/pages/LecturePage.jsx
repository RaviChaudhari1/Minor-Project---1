
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LecturePage({ user }) {
  const { className } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch lectures
        const lecturesResponse = await axios.get(`${API}/lectures/${className}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLectures(lecturesResponse.data);

        // Fetch classroom info to check if user is teacher
        const classesResponse = await axios.get(`${API}/classes/get-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundClass = classesResponse.data.find(cls => cls.name === className);
        setClassroom(foundClass);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLectures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [className, API]);

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/lectures/${className}/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh lectures list
      const response = await axios.get(`${API}/lectures/${className}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLectures(response.data);
    } catch (error) {
      console.error("Error deleting lecture:", error);
      alert("Failed to delete lecture");
    }
  };

  const isTeacher = classroom && user && String(classroom.teacher) === String(user._id);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with create lecture button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            📖 Lectures for {className.replace("-", " ")}
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
                    <p className="text-sm text-gray-500">📅 {new Date(lecture.date).toLocaleDateString()}</p>
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
                        onClick={() => handleDeleteLecture(lecture._id)}
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
    </div>
  );
}
