import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateLecturePage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    audio: "",
    classId: ""
  });
  const { classId } = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [audio, setAudio] = useState(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you’d send lecture data to your backend or global state
    console.log("New Lecture:", { title, date, description, audio, classId });
    // setForm({ ...form, [e.target.name]: e.target.value });
    // setError(""); 
    const lectureData = {
      title,
      description,
      date,
      audio,
    };

    try {
      const res = await axios.post(`${API}/lectures/${classId}/create`, lectureData, { withCredentials: true });
      console.log("Lecture created:", res.data);
      navigate(`/lectures/${classId}`);
    }catch(err){
      console.error("Create lecture error:", err.response?.data || err.message);
      
    }
    // Redirect back to lecture list
    navigate(`/lectures/${classId}`);
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
          <label className="block text-gray-700 mb-1">Upload Audio (Optional)</label>
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
