import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  // Color palettes for variety
  const colors = [
    { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-800", subtitle: "text-blue-600" },
    { bg: "bg-green-50", border: "border-green-200", title: "text-green-800", subtitle: "text-green-600" },
    { bg: "bg-purple-50", border: "border-purple-200", title: "text-purple-800", subtitle: "text-purple-600" },
    { bg: "bg-pink-50", border: "border-pink-200", title: "text-pink-800", subtitle: "text-pink-600" },
    { bg: "bg-yellow-50", border: "border-yellow-200", title: "text-yellow-800", subtitle: "text-yellow-600" },
  ];

  useEffect(() => {
    axios
      .get(`${API}/classes/get-classes`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Error fetching classes:", err));
  }, [API]);

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
            const color = colors[index % colors.length]; // cycle through colors
            return (
              <Link key={cls._id} to={`/lectures/${cls.name}`}>
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
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

