import React, { useState } from "react";
import { Header, Sidebar } from "./";
import { Outlet } from "react-router-dom";

function Layout() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      {/* Header & Sidebar only for Main Layout */}
      <Header toggleSidebar={() => setExpanded(!expanded)} />
      <Sidebar expanded={expanded} />

      <main
        className={`flex-1 p-4 transition-all duration-300 mt-14 ${
          expanded ? "ml-56" : "ml-16"
        }`}
      >
        <Outlet />
      </main>

      <footer className="bg-[#ca3500] text-white text-center p-3 shadow-md">
        Classroom App © 2025
      </footer>
    </div>
  );
}

export default Layout;
