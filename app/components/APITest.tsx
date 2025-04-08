'use client'

export default function APITest() {
  const testEnv = async () => {
    try {
      const response = await fetch('/api/test-env')
      const data = await response.json()
      console.log('Environment Test:', data)
    } catch (error) {
      console.error('Environment test error:', error)
    }
  }

  const testYouTube = async () => {
    try {
      const response = await fetch('/api/youtube?q=health+tips')
      const data = await response.json()
      console.log('YouTube API Test:', data)
    } catch (error) {
      console.error('YouTube API test error:', error)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Tests</h2>
      <div className="space-x-4">
        <button 
          onClick={testEnv}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Test Environment
        </button>
        <button 
          onClick={testYouTube}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Test YouTube API
        </button>
      </div>
    </div>
  )
} 