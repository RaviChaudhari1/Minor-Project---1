import { BookOpen, Users, Calendar, FileText, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ expanded }) {
  return (
    <aside
      className={`fixed top-14 left-0 h-[calc(100%-3.5rem)] bg-[#ca3500] text-white shadow-md transition-all duration-300 ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      <nav className="flex flex-col gap-4 p-4">
        <Link to="/" className="flex items-center gap-3">
          <BookOpen size={20} />
          {expanded && <span>Classes</span>}
        </Link>
        <Link to="/students" className="flex items-center gap-3">
          <Users size={20} />
          {expanded && <span>Students</span>}
        </Link>
        <Link to="/schedule" className="flex items-center gap-3">
          <Calendar size={20} />
          {expanded && <span>Schedule</span>}
        </Link>
        <Link to="/lectures/today" className="flex items-center gap-3">
          <FileText size={20} />
          {expanded && <span>Today's Lectures</span>}
        </Link>
        <Link to="/settings" className="flex items-center gap-3">
          <Settings size={20} />
          {expanded && <span>Settings</span>}
        </Link>
      </nav>
    </aside>
  );
}
