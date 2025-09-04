'use client'

import { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([])
  const [userParticipations, setUserParticipations] = useState([])
  const [aiChallenges, setAiChallenges] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('active')
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Mock user data - in real app, get from auth context
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/')
    }
  }, [router])

  // Fetch challenges and user participations
  const fetchData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Fetch active challenges
      const challengesRes = await fetch(`/api/challenges?team=${user.team}&status=active`)
      const challengesData = await challengesRes.json()
      
      if (challengesData.success) {
        setChallenges(challengesData.challenges)
      }

      // Fetch user participations
      const participationRes = await fetch(`/api/challenge-participation?userName=${user.username}&team=${user.team}`)
      const participationData = await participationRes.json()
      
      if (participationData.success) {
        setUserParticipations(participationData.participations)
      }

      // Fetch AI-generated challenges
      const aiRes = await fetch(`/api/ai-challenges?team=${user.team}`)
      const aiData = await aiRes.json()
      
      if (aiData.success) {
        setAiChallenges(aiData.challenges)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  // Join a challenge
  const joinChallenge = async (challengeId) => {
    try {
      const response = await fetch('/api/challenge-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          userName: user.username,
          team: user.team
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Successfully joined challenge!')
        fetchData() // Refresh data
      } else {
        toast.error(data.error || 'Failed to join challenge')
      }
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast.error('Failed to join challenge')
    }
  }

  // Generate AI challenge
  const generateAIChallenge = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team: user.team,
          timeframe: '7days',
          challengeType: 'mixed'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('🤖 AI generated a new challenge for your team!')
        fetchData() // Refresh data
      } else {
        toast.error('Failed to generate AI challenge')
      }
    } catch (error) {
      console.error('Error generating AI challenge:', error)
      toast.error('Failed to generate AI challenge')
    } finally {
      setLoading(false)
    }
  }

  // Check if user is participating in a challenge
  const isParticipating = (challengeId) => {
    return userParticipations.some(p => p.challenge_id === challengeId)
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Get challenge type icon
  const getChallengeIcon = (type) => {
    switch (type) {
      case 'steps': return '🚶‍♂️'
      case 'squats': return '🏋️‍♀️'
      case 'pushups': return '💪'
      case 'mixed': return '🏃‍♂️'
      default: return '🎯'
    }
  }

  // Calculate days remaining
  const getDaysRemaining = (deadline) => {
    if (!deadline) return null
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
            🎯 Wellness Challenges
          </h1>
          <p className="text-gray-600">
            Join team challenges and boost your wellness journey!
          </p>
        </div>
        
        <button
          onClick={generateAIChallenge}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50"
        >
          <span>🤖</span>
          <span>{loading ? 'Generating...' : 'AI Challenge'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'active'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Challenges ({challenges.length})
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'my'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Challenges ({userParticipations.length})
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'ai'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🤖 AI Generated ({aiChallenges.length})
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading challenges...</span>
        </div>
      )}

      {/* Active Challenges Tab */}
      {activeTab === 'active' && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getChallengeIcon(challenge.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{challenge.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

              {/* Challenge details */}
              <div className="space-y-2 mb-4">
                {challenge.steps > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Steps:</span>
                    <span className="font-medium">{challenge.steps.toLocaleString()}</span>
                  </div>
                )}
                {challenge.squats > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Squats:</span>
                    <span className="font-medium">{challenge.squats}</span>
                  </div>
                )}
                {challenge.pushups > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Push-ups:</span>
                    <span className="font-medium">{challenge.pushups}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium">
                    {getDaysRemaining(challenge.deadline)} days left
                  </span>
                </div>
              </div>

              {/* Participation stats */}
              {challenge.participation && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{challenge.participation.totalParticipants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium">{challenge.participation.completionRate}%</span>
                  </div>
                </div>
              )}

              {/* Action button */}
              {isParticipating(challenge.id) ? (
                <button
                  disabled
                  className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium"
                >
                  ✓ Joined
                </button>
              ) : (
                <button
                  onClick={() => joinChallenge(challenge.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Join Challenge
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* My Challenges Tab */}
      {activeTab === 'my' && !loading && (
        <div className="space-y-4">
          {userParticipations.map((participation) => (
            <div
              key={participation.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>{getChallengeIcon(participation.type)}</span>
                    <span>{participation.title}</span>
                  </h3>
                  <p className="text-gray-600 text-sm">{participation.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{participation.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {participation.current_progress} / {participation.target}
                    ({participation.progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      participation.completed 
                        ? 'bg-green-500' 
                        : participation.progressPercent > 75 
                        ? 'bg-blue-500' 
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(participation.progressPercent, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Status and deadline */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {participation.completed ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {participation.daysRemaining > 0 
                    ? `${participation.daysRemaining} days left`
                    : 'Deadline passed'
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Generated Challenges Tab */}
      {activeTab === 'ai' && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      AI Generated
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{challenge.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

              {/* Action button */}
              {isParticipating(challenge.id) ? (
                <button
                  disabled
                  className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium"
                >
                  ✓ Joined
                </button>
              ) : (
                <button
                  onClick={() => joinChallenge(challenge.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Join AI Challenge
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty states */}
      {!loading && (
        <>
          {activeTab === 'active' && challenges.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Challenges</h3>
              <p className="text-gray-600 mb-4">Create new challenges or generate AI-powered ones!</p>
              <button
                onClick={generateAIChallenge}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                🤖 Generate AI Challenge
              </button>
            </div>
          )}

          {activeTab === 'my' && userParticipations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Challenges Joined</h3>
              <p className="text-gray-600">Join some challenges to start your wellness journey!</p>
            </div>
          )}

          {activeTab === 'ai' && aiChallenges.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No AI Challenges Yet</h3>
              <p className="text-gray-600 mb-4">Let AI create personalized challenges for your team!</p>
              <button
                onClick={generateAIChallenge}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                🤖 Generate First AI Challenge
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ChallengesPage