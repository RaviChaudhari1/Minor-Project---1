export default function TodayLecturesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎤 Uploaded Lectures</h2>
        <p className="text-gray-600 mb-4">Manage and organize your lecture materials and recordings.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Introduction to Calculus</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Video</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Mathematics 101 - Week 1</p>
            <p className="text-xs text-gray-500">Duration: 45:30 • Views: 125</p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Play</button>
              <button className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Edit</button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Quantum Mechanics Basics</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">PDF</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Physics 201 - Week 2</p>
            <p className="text-xs text-gray-500">Pages: 15 • Downloads: 89</p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Download</button>
              <button className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Edit</button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Organic Chemistry Lab</h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Audio</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Chemistry 101 - Week 3</p>
            <p className="text-xs text-gray-500">Duration: 32:15 • Plays: 67</p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600">Listen</button>
              <button className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
