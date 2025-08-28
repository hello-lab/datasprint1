'use client'

import { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      
      if (response.ok && data.success) {
        setLeaderboardData(data)
        toast.success('Leaderboard loaded successfully!')
      } else {
        toast.error(data.error || 'Failed to fetch leaderboard data')
        console.error('Error:', data)
      }
    } catch (error) {
      toast.error('Failed to fetch leaderboard data')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load leaderboard on component mount
  useEffect(() => {
    fetchLeaderboard()
  }, [])

  // Get medal emoji based on rank
  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏅'
    }
  }

  // Get rank styling
  const getRankStyling = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300'
      case 2: return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
      case 3: return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300'
      default: return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏆 Step Count Leaderboard
          </h1>
          <p className="text-lg text-gray-600">
            Daily rankings based on Google Fit step data
          </p>
          {leaderboardData && (
            <p className="text-sm text-gray-500 mt-2">
              Date: {new Date(leaderboardData.date).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mb-6">
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              '🔄 Refresh Leaderboard'
            )}
          </button>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Today's Top Steppers
          </h2>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading leaderboard...</span>
            </div>
          )}

          {leaderboardData && leaderboardData.leaderboard.length > 0 && (
            <div className="space-y-3">
              {leaderboardData.leaderboard.map((user) => (
                <div
                  key={user.user_email}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${getRankStyling(user.rank)}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getMedalEmoji(user.rank)}</span>
                      <span className="text-xl font-bold text-gray-700">#{user.rank}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.user_name}</h3>
                      <p className="text-sm text-gray-600">{user.user_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {user.steps.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">steps</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {leaderboardData && leaderboardData.leaderboard.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-6xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold mb-2">No data yet!</h3>
              <p>Be the first to sync your Google Fit data and appear on the leaderboard.</p>
              <div className="mt-4">
                <a 
                  href="/app/googlefit" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
                >
                  Sync Your Steps
                </a>
              </div>
            </div>
          )}

          {!leaderboardData && !loading && (
            <div className="text-center text-gray-500 py-8">
              <p>Click the refresh button to load the leaderboard</p>
            </div>
          )}
        </div>

        {/* Stats */}
        {leaderboardData && leaderboardData.leaderboard.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {leaderboardData.totalUsers}
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {leaderboardData.leaderboard[0]?.steps.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Top Step Count</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    leaderboardData.leaderboard.reduce((sum, user) => sum + user.steps, 0) / 
                    leaderboardData.totalUsers
                  ).toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Average Steps</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center mt-8 space-x-4">
          <a 
            href="/app/googlefit" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            🏃‍♂️ Sync Your Steps
          </a>
          <span className="text-gray-400">|</span>
          <a 
            href="/app/home" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage