import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ClassesPage({ user }) {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  const colors = [
    { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-800", subtitle: "text-blue-600" },
    { bg: "bg-green-50", border: "border-green-200", title: "text-green-800", subtitle: "text-green-600" },
    { bg: "bg-purple-50", border: "border-purple-200", title: "text-purple-800", subtitle: "text-purple-600" },
    { bg: "bg-pink-50", border: "border-pink-200", title: "text-pink-800", subtitle: "text-pink-600" },
    { bg: "bg-yellow-50", border: "border-yellow-200", title: "text-yellow-800", subtitle: "text-yellow-600" },
  ];

  useEffect(() => {
    fetchClasses();
  }, [API]);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/classes/get-classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/classes/${selectedClass._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses((prev) => prev.filter((cls) => cls._id !== selectedClass._id));
      setShowModal(false);
      setSelectedClass(null);
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Failed to delete class");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">📚 My Classes</h2>
          <Link
            to="/create-class"
            className="px-4 py-2 bg-[#ca3500] text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            <i className="fa-solid fa-plus"></i> Create Class
          </Link>
        </div>
        <p className="text-gray-600 mb-4">
          Manage your classroom and course materials here.
        </p>

        {/* Render classes dynamically */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, index) => {
            const color = colors[index % colors.length];
            const isCreator = user && cls.teacher && String(cls.teacher._id) === String(user._id);

            return (
              <div key={cls._id} className="relative">
                <Link to={`/lectures/${cls.name}`}>
                  <div
                    className={`${color.bg} ${color.border} border rounded-lg p-4 hover:shadow-md cursor-pointer`}
                  >
                    <h3 className={`font-semibold ${color.title}`}>{cls.name}</h3>
                    <p className={`text-sm ${color.subtitle}`}>
                      {cls.subject || "No subject"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {cls.students?.length || 0} students enrolled
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Teacher: {cls.teacher.name}
                    </p>
                  </div>
                </Link>

                {isCreator && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Link
                      to={`/classes/${cls._id}/edit`}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                      title="Edit class"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-solid fa-pen-to-square text-sm"></i>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(cls);
                        setShowModal(true);
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                      title="Delete class"
                    >
                      <i className="fa-solid fa-trash text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showModal && selectedClass && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 w-96 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete class{" "}
              <span className="font-bold">{selectedClass.name}</span>? <br />
              This will also delete all associated lectures.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200/80 hover:bg-gray-300/80 backdrop-blur-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClass}
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
