import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { 
  ClassesPage, LecturePage, StudentsPage, CreateClassPage, EditClassPage,
  TodayLecturesPage, CreateLecturePage, LectureDetailPage, EditLecturePage, SettingPage
} from "./pages";
import { useState, useEffect } from "react";
import axios from "axios";
import { ThemeProvider } from "./contexts/themeContext";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [themeMode, setThemeMode] = useState("light")

  const lightMode = () => {
    setThemeMode("light")
  }

  const darkMode = () => {
    setThemeMode("dark")
  }

  useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])

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
        // console.log("App User:", res);
        setIsAuthenticated(true);
        setUser(res.data.data); // store user info from backend
        
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
    <ThemeProvider value={{themeMode, lightMode, darkMode}}>
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
            <Route path="/settings" element={<SettingPage user={user} />}/>
            <Route path="/lectures/:className" element={<LecturePage user={user} />} />
            <Route path="/lectures/:className/:lectureId" element={<LectureDetailPage user={user} />} />
            <Route path="/lectures/:className/:lectureId/edit" element={<EditLecturePage user={user} />} />
            <Route path="/lectures/:className/create" element={<CreateLecturePage user={user} />} />
            <Route path="/classes/:classId/edit" element={<EditClassPage user={user} />} />
            <Route path="/students" element={<StudentsPage user={user} />} />
            <Route path="/lectures/today" element={<TodayLecturesPage user={user} />} />
            <Route path="/lectures/today/:lectureId/edit" element={<TodayLecturesPage user={user} />} />
            <Route path="/create-class" element={<CreateClassPage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
    </ThemeProvider>
  );
}
