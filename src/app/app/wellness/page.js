'use client'

import { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const WellnessDashboard = () => {
  const [goals, setGoals] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [newGoal, setNewGoal] = useState({
    type: 'daily_steps',
    target: 10000
  })

  // Fetch user profile and goals
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Get user profile (assuming we have user context)
      const profileResponse = await fetch('/api/auth/profile')
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUserProfile(profileData)
        
        // Fetch goals for this user
        const goalsResponse = await fetch(`/api/goals?userEmail=${profileData.username}@wellness.com`)
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json()
          if (goalsData.success) {
            setGoals(goalsData.goals)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load wellness data')
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async () => {
    if (!userProfile || !newGoal.target) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: `${userProfile.username}@wellness.com`,
          userName: userProfile.username,
          goalType: newGoal.type,
          targetValue: parseInt(newGoal.target)
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        fetchUserData() // Refresh data
        setNewGoal({ type: 'daily_steps', target: 10000 }) // Reset form
      } else {
        toast.error(data.error || 'Failed to create goal')
      }
    } catch (error) {
      console.error('Error creating goal:', error)
      toast.error('Failed to create goal')
    }
  }

  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId })
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Goal deleted successfully')
        fetchUserData() // Refresh data
      } else {
        toast.error(data.error || 'Failed to delete goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to delete goal')
    }
  }

  const getGoalTypeLabel = (type) => {
    switch (type) {
      case 'daily_steps': return 'Daily Steps'
      case 'weekly_steps': return 'Weekly Steps'
      case 'monthly_steps': return 'Monthly Steps'
      default: return type
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌟 Wellness Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your wellness goals and earn stepcoins for staying active
          </p>
        </div>

        {/* User Stats */}
        {userProfile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Stepcoins Balance</h3>
                  <p className="text-3xl font-bold text-green-600">₹{userProfile.balance?.toLocaleString()}</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Steps</h3>
                  <p className="text-3xl font-bold text-blue-600">{userProfile.stepcount?.toLocaleString()}</p>
                </div>
                <div className="text-4xl">👟</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Active Goals</h3>
                  <p className="text-3xl font-bold text-purple-600">{goals.filter(g => g.status === 'active').length}</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Creation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Set New Wellness Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
              <select
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily_steps">Daily Steps</option>
                <option value="weekly_steps">Weekly Steps</option>
                <option value="monthly_steps">Monthly Steps</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 10000"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={createGoal}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Your Wellness Goals</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">No goals set yet!</h3>
              <p className="text-gray-600">Create your first wellness goal to start tracking your progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getGoalTypeLabel(goal.goal_type)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Target: {goal.target_value.toLocaleString()} steps
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(goal.status)}`}>
                        {goal.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress: {goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()}</span>
                      <span>{goal.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          goal.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <span>Period: {goal.start_date} to {goal.end_date}</span>
                    {goal.status === 'completed' && (
                      <span className="ml-4 text-green-600 font-semibold">🎉 Goal Achieved!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/app/googlefit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
            >
              🏃‍♂️ Sync Steps
            </a>
            <a
              href="/app/leaderboard"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
            >
              🏆 View Leaderboard
            </a>
            <a
              href="/app/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
            >
              👤 View Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WellnessDashboard