'use client'

import { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const AnalyticsPage = () => {
  const [engagement, setEngagement] = useState(null)
  const [goals, setGoals] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState('7days')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/')
    }
  }, [router])

  // Fetch engagement analytics
  const fetchAnalytics = async () => {
    if (!user?.team) return
    
    setLoading(true)
    try {
      // Fetch team engagement
      const engagementRes = await fetch(`/api/engagement?team=${user.team}&timeframe=${timeframe}`)
      const engagementData = await engagementRes.json()
      
      if (engagementData.success) {
        setEngagement(engagementData.engagement)
      }

      // Fetch team goals
      const goalsRes = await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkGoals', team: user.team })
      })
      const goalsData = await goalsRes.json()
      
      if (goalsData.success) {
        setGoals(goalsData.goals)
      }

      // Get engagement notifications
      const notificationsRes = await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'triggerNotifications', team: user.team })
      })
      const notificationsData = await notificationsRes.json()
      
      if (notificationsData.success) {
        setNotifications(notificationsData.notifications)
      }

    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, timeframe])

  // Generate AI challenge
  const generateAIChallenge = async () => {
    try {
      const response = await fetch('/api/ai-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team: user.team,
          timeframe,
          challengeType: 'mixed'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('🤖 AI generated a new challenge based on your team analytics!')
        fetchAnalytics() // Refresh data
      } else {
        toast.error('Failed to generate AI challenge')
      }
    } catch (error) {
      console.error('Error generating AI challenge:', error)
      toast.error('Failed to generate AI challenge')
    }
  }

  // Get engagement score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Get goal status styling
  const getGoalStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'close': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'needs_work': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get insight type styling
  const getInsightStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Team Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive wellness insights for {user.team}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          
          <button
            onClick={generateAIChallenge}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2"
          >
            <span>🤖</span>
            <span>AI Challenge</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      )}

      {/* Engagement Metrics */}
      {engagement && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Overall Engagement</h3>
                <div className={`text-3xl font-bold ${getScoreColor(engagement.scores.overall)}`}>
                  {engagement.scores.overall}%
                </div>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Trend: {engagement.trends.direction === 'improving' ? '📈' : 
                        engagement.trends.direction === 'declining' ? '📉' : '➡️'} 
                {Math.abs(engagement.trends.stepTrend)}%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Avg Steps/Member</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {engagement.metrics.avgStepsPerMember.toLocaleString()}
                </div>
              </div>
              <div className="text-4xl">🚶‍♂️</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Target: 8,000 steps
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Active Members</h3>
                <div className="text-3xl font-bold text-green-600">
                  {engagement.totalMembers}
                </div>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Avg Active Days: {engagement.metrics.avgActiveDays}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Challenge Rate</h3>
                <div className={`text-3xl font-bold ${getScoreColor(engagement.metrics.challengeCompletionRate)}`}>
                  {engagement.metrics.challengeCompletionRate}%
                </div>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Completion rate
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Goals */}
      {goals.length > 0 && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Team Goals Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {goal.type.replace('_', ' ')} Goal
                    </h3>
                    <p className="text-sm text-gray-600">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getGoalStatusStyle(goal.status)}`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      goal.progress >= 100 ? 'bg-green-500' :
                      goal.progress >= 75 ? 'bg-blue-500' :
                      goal.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {goal.progress}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Insights */}
      {engagement?.insights && engagement.insights.length > 0 && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Team Insights</h2>
          
          <div className="space-y-4">
            {engagement.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightStyle(insight.type)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{insight.title}</h3>
                    <p className="text-sm mt-1">{insight.message}</p>
                    {insight.members && insight.members.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Members: </span>
                        <span className="text-xs">
                          {insight.members.slice(0, 3).join(', ')}
                          {insight.members.length > 3 && ` +${insight.members.length - 3} more`}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    insight.priority === 'positive' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {engagement?.recommendations && engagement.recommendations.length > 0 && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 AI Recommendations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {engagement.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <button
                      onClick={() => {
                        if (rec.action === 'generate_ai_challenge') {
                          generateAIChallenge()
                        } else {
                          toast.info(`Action: ${rec.action.replace('_', ' ')}`)
                        }
                      }}
                      className="mt-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md"
                    >
                      Take Action
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Breakdown */}
      {engagement && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Engagement Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(engagement.scores.stepEngagement)}`}>
                {engagement.scores.stepEngagement}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Step Activity</div>
              <div className="text-xs text-gray-500 mt-2">
                Based on daily step averages
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(engagement.scores.consistencyEngagement)}`}>
                {engagement.scores.consistencyEngagement}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Consistency</div>
              <div className="text-xs text-gray-500 mt-2">
                Regular participation rate
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(engagement.scores.challengeEngagement)}`}>
                {engagement.scores.challengeEngagement}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Challenge Success</div>
              <div className="text-xs text-gray-500 mt-2">
                Challenge completion rate
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !engagement && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Start tracking team activity to see analytics here!</p>
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage