import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Social Scheduler
          </h1>
          <p className="text-gray-600 mb-6">
            Your project is now running! Ready to build something amazing.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✅ Development server is active
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App