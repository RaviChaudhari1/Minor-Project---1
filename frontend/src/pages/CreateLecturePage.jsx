import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function CreateLecturePage() {
  const { classId } = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [audio, setAudio] = useState(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    if (audio) formData.append("audio", audio);

    try {
      const token = localStorage.getItem("token"); // 🔑 Get token from localStorage

      const res = await axios.post(
        `${API}/lectures/${classId}/create`,
        formData,
        {
          withCredentials: true, // still send cookies if needed
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ Attach token
          },
        }
      );

      console.log("Lecture created:", res.data);
      navigate(`/lectures/${classId}`);
    } catch (err) {
      console.error(
        "Create lecture error:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ➕ Create Lecture for {classId.replace("-", " ")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-1">Lecture Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lecture title"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#ca3500] focus:outline-none"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#ca3500] focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter lecture description"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#ca3500] focus:outline-none resize-none"
            rows={3}
          />
        </div>

        {/* Upload File */}
        <div>
          <label className="block text-gray-700 mb-1">
            Upload Audio (Optional)
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#ca3500] focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#ca3500] text-white py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Create Lecture
        </button>
      </form>
    </div>
  );
}


// TODO - start by creaating create class feature then populate the class on classroom app then crete lecture and pass mongodb class id as slug on create lecture url