import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { 
  ClassesPage, LecturePage, StudentsPage, CreateClassPage,
  TodayLecturesPage, CreateLecturePage, LectureDetailPage 
} from "./pages";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api"; // adjust if backend URL changes

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API}/users/current-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
        setUser(res.data.user); // store user info from backend
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err.message);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // Prevent flicker

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser}/>} />
            <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          // Protected Routes
          <Route element={<Layout user={user} />}>
            <Route path="/" element={<ClassesPage user={user} />} />
            <Route path="/lectures/:classId" element={<LecturePage user={user} />} />
            <Route path="/lectures/:classId/:lectureId" element={<LectureDetailPage user={user} />} />
            <Route path="/lectures/:classId/create" element={<CreateLecturePage user={user} />} />
            <Route path="/students" element={<StudentsPage user={user} />} />
            <Route path="/today-lectures" element={<TodayLecturesPage user={user} />} />
            <Route path="/create-class" element={<CreateClassPage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
