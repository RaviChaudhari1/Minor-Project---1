import { Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#ca3500] text-white flex items-center px-4 shadow-md z-50">
      {/* Hamburger */}
      <button onClick={toggleSidebar} className="mr-4">
        <Menu size={24} />
      </button>
      <h1 className="font-bold text-lg">Classroom App</h1>
    </header>
  );
}
