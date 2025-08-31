import { Link } from "react-router-dom";

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">📚 My Classes</h2>
          <Link
            to="/create-class"
            className="px-4 py-2 bg-[#ca3500] text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            <i className="fa-solid fa-plus"></i> Create Class
          </Link>
        </div>
        <p className="text-gray-600 mb-4">
          Manage your classroom and course materials here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/lectures/mathematics-101">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-blue-800">Mathematics 101</h3>
              <p className="text-sm text-blue-600">Advanced Calculus</p>
              <p className="text-xs text-gray-500 mt-2">25 students enrolled</p>
            </div>
          </Link>

          <Link to="/lectures/physics-201">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-green-800">Physics 201</h3>
              <p className="text-sm text-green-600">Quantum Mechanics</p>
              <p className="text-xs text-gray-500 mt-2">18 students enrolled</p>
            </div>
          </Link>

          <Link to="/lectures/chemistry-101">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-purple-800">Chemistry 101</h3>
              <p className="text-sm text-purple-600">Organic Chemistry</p>
              <p className="text-xs text-gray-500 mt-2">22 students enrolled</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
