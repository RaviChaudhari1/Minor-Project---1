import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LectureDetailPage({ user }) {
  const { className, lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch lecture
        const lectureResponse = await axios.get(`${API}/lectures/${className}/${lectureId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLecture(lectureResponse.data);

        // Fetch classroom info to check if user is teacher
        const classesResponse = await axios.get(`${API}/classes/get-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundClass = classesResponse.data.find(cls => cls.name === className);
        setClassroom(foundClass);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLecture(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [className, lectureId, API]);

  const handleDeleteLecture = async () => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/lectures/${className}/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      navigate(`/lectures/${className}`);
    } catch (error) {
      console.error("Error deleting lecture:", error);
      alert("Failed to delete lecture");
    }
  };

  const isTeacher = classroom && user && String(classroom.teacher) === String(user._id);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700">Loading lecture...</h2>
      </div>
    );
  }

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
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{lecture.title}</h2>
          <p className="text-gray-600 italic">📅 {new Date(lecture.date).toLocaleDateString()}</p>
        </div>
        
        {isTeacher && (
          <div className="flex gap-2">
            <Link
              to={`/lectures/${className}/${lectureId}/edit`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
              title="Edit lecture"
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </Link>
            <button
              onClick={handleDeleteLecture}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
              title="Delete lecture"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-700">
        <span className="font-semibold">Description: </span>
        {lecture.description}
      </p>

      {lecture.transcription && (
        <div>
          <h3 className="font-semibold text-lg mb-2">📝 Transcription</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {lecture.transcription}
          </p>
        </div>
      )}

      {lecture.audioUrl && (
        <div>
          <h3 className="font-semibold text-lg mb-2">🎧 Audio Lecture</h3>
          <audio controls className="w-full">
            <source src={lecture.audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
