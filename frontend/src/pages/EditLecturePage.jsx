import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditLecturePage() {
  const { className, lectureId } = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}/lectures/${className}/${lectureId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const lecture = response.data.lecture;
        setTitle(lecture.title);
        setDate(lecture.date.split('T')[0]); // Format date for input
        setDescription(lecture.description || "");
      } catch (error) {
        console.error("Error fetching lecture:", error);
        alert("Failed to load lecture");
        navigate(`/lectures/${className}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [className, lectureId, API, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    if (audio) formData.append("audio", audio);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/lectures/${className}/${lectureId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Lecture updated:", res.data);
      navigate(`/lectures/${className}`);
    } catch (err) {
      console.error(
        "Update lecture error:",
        err.response?.data || err.message
      );
      alert("Failed to update lecture");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ✏️ Edit Lecture for {className.replace("-", " ")}
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
            Upload New Audio (Optional)
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#ca3500] focus:outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to keep existing audio
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#ca3500] text-white py-2 rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Lecture"}
        </button>
      </form>
    </div>
  );
}
