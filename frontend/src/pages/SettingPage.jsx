import { useState } from "react";
import useTheme from "../contexts/themeContext";

export default function SettingsPage({ user }) { 
  console.log(user);
  
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [disabled, setDisabled] = useState(true);
  const { themeMode, lightMode, darkMode } = useTheme();

  const toggleTheme = (e) => {
    const darkModeStatus = e.currentTarget.checked;
    if (darkModeStatus) {
      darkMode();
    } else {
      lightMode();
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] p-6 ">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#ca3500]">Settings</h1>

        {/* Profile Settings */}
        <div className="rounded-2xl shadow-md border border-gray-200 bg-white">
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#ca3500]">Profile</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                disabled={disabled}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ca3500] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled={disabled}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ca3500] outline-none"
              />
            </div>

            <button className="bg-[#ca3500] text-white px-4 py-2 rounded-lg hover:bg-[#a32a00] transition">
              Save Profile
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl shadow-md border border-gray-200 bg-white">
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#ca3500]">
              Preferences
            </h2>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Dark Mode</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  onChange={toggleTheme}
                  checked={themeMode === "dark"}
                />
                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#ca3500] transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Enable Notifications</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  notifications ? "bg-[#ca3500]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    notifications ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl shadow-md border border-gray-200 bg-white">
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#ca3500]">Security</h2>


            <button className="bg-[#ca3500] text-white px-4 py-2 rounded-lg hover:bg-[#a32a00] transition">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
