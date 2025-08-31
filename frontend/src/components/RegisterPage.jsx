import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage({ setIsAuthenticated, setCurrentUser }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ error state
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/users/register`, {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      }, { withCredentials: true });

      const user = res.data.data;
      setCurrentUser(user);
      setIsAuthenticated(true);
      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);

      // ✅ Set error message based on response
      if (err.response?.data?.message?.includes("User already exists")) {
        setError(
          <>
            User already exists.{" "}
            <Link to="/login" className="text-[#ca3500] font-semibold underline">
              Go to Login
            </Link>
          </>
        );
      } else {
        setError(err.response?.data?.message || "Registration failed. User already exists.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca3500]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca3500]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca3500]"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca3500]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ca3500] text-white py-3 rounded-lg font-semibold hover:bg-[#a12a00] transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* ✅ Error message display */}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ca3500] font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
