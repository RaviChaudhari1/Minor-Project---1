import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TodayLecturesPage({ user }) {
  const { className } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/lectures/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allLectures = res.data.lectures || [];

        // Filter only today's lectures based on 'date'
        const today = new Date().toISOString().split("T")[0];
        const todaysLectures = allLectures.filter(
          (lec) => {
            const created = new Date(lec.createdAt).toISOString().split("T")[0];
            return created === today;
          }
        );

        setLectures(todaysLectures);
      } catch (err) {
        console.error("Error fetching lectures:", err);
        setLectures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [API]);

  // Delete lecture
  const handleDeleteLecture = async () => {
    if (!selectedLecture) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API}/lectures/${selectedLecture.classroom?.name}/${selectedLecture._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLectures((prev) =>
        prev.filter((lec) => lec._id !== selectedLecture._id)
      );

      setShowModal(false);
      setSelectedLecture(null);
    } catch (err) {
      console.error("Error deleting lecture:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            📅 Today&apos;s Lectures
          </h2>
        </div>

        {/* Lectures List */}
        {loading ? (
          <p className="text-gray-600">Loading lectures...</p>
        ) : lectures.length > 0 ? (
          <ul className="space-y-3">
            {lectures.map((lecture) => {
              const isTeacher =
                user &&
                lecture.createdBy?._id &&
                String(user._id) === String(lecture.createdBy._id);

              return (
                <li key={lecture._id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                    <Link
                      to={`/lectures/${lecture.classroom?.name}/${lecture._id}`}
                      className="flex-1"
                    >
                      {/* Class + Lecture Title Horizontal Center */}
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-bold text-2xl text-[#ca3500]">
                          {lecture.classroom?.name} -
                        </span>
                        <span className="font-semibold text-xl text-gray-800">
                          {lecture.title}
                        </span>
                      </div>

                      {/* Description */}
                      {lecture.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {lecture.description}
                        </p>
                      )}
                    </Link>

                    {/* Edit/Delete Buttons for Teacher */}
                    {isTeacher && (
                      <div className="flex gap-2 ml-4">
                        <Link
                          to={`/lectures/${lecture.classroom?.name}/${lecture._id}/edit`}
                          state={{ fromToday: true }}
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
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600">No lectures for today.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && selectedLecture && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 w-96 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete lecture{" "}
              <span className="font-bold">{selectedLecture.title}</span> from{" "}
              <span className="font-bold">{selectedLecture.classroom?.name}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLecture}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow"
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
