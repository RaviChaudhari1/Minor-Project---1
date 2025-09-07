import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditClassPage() {
  const { classId } = useParams();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}/classes/get-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const foundClass = response.data.find(cls => cls._id === classId);
        if (foundClass) {
          setName(foundClass.name);
          setSubject(foundClass.subject);
          setDescription(foundClass.description || "");
        } else {
          alert("Class not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching class:", error);
        alert("Failed to load class");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [classId, API, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/classes/${classId}`,
        {
          name,
          subject,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Class updated:", res.data);
      navigate("/");
    } catch (err) {
      console.error(
        "Update class error:",
        err.response?.data || err.message
      );
      alert("Failed to update class");
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
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">✏️ Edit Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Class Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Class"}
        </button>
      </form>
    </div>
  );
}
