import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage({ setIsAuthenticated, setCurrentUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/users/login`, form, { withCredentials: true });

      const { user, accessToken } = res.data.data;
      localStorage.setItem("token", accessToken);
      setCurrentUser(user);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca3500]" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca3500]" />

          <button type="submit" disabled={loading} className="w-full bg-[#ca3500] text-white py-3 rounded-lg font-semibold hover:bg-[#a12a00] transition disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-[#ca3500] font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
