'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { toast, Toaster } from 'react-hot-toast'

const GoogleFitPage = () => {
  const { data: session, status } = useSession()
  const [stepData, setStepData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch step data when user is signed in
  const fetchStepData = async () => {
    if (!session) {
      toast.error('Please sign in with Google first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/fit')
      const data = await response.json()
      
      if (response.ok) {
        setStepData(data)
        toast.success('Step data loaded successfully!')
      } else {
        toast.error(data.error || 'Failed to fetch step data')
        console.error('Error:', data)
      }
    } catch (error) {
      toast.error('Failed to fetch step data')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    signIn('google')
  }

  // Handle Sign Out
  const handleSignOut = () => {
    signOut()
    setStepData(null)
    toast.success('Signed out successfully')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏃‍♂️ Google Fit Integration
          </h1>
          <p className="text-lg text-gray-600">
            Connect your Google Fit account to view your step data for the last 24 hours
          </p>
        </div>

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Authentication Status
          </h2>
          
          {status === 'loading' && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {status === 'unauthenticated' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                You need to sign in with Google to access your Google Fit data
              </p>
              <button
                onClick={handleGoogleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}

          {status === 'authenticated' && session && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                {session.user.image && (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full mr-3"
                  />
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Welcome, {session.user.name}!
                  </p>
                  <p className="text-gray-600">{session.user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Step Data Section */}
        {status === 'authenticated' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📊 Your Google Fit Data
            </h2>
            
            <div className="text-center mb-6">
              <button
                onClick={fetchStepData}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  'Fetch Step Data (Last 24 Hours)'
                )}
              </button>
            </div>

            {stepData && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    {stepData.steps.toLocaleString()}
                  </div>
                  <div className="text-xl text-gray-700">Steps</div>
                  <div className="text-sm text-gray-500">
                    Last 24 hours
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Time Range:</h3>
                  <div className="text-sm text-gray-600">
                    <p><strong>From:</strong> {new Date(stepData.timeRange.start).toLocaleString()}</p>
                    <p><strong>To:</strong> {new Date(stepData.timeRange.end).toLocaleString()}</p>
                  </div>
                </div>

                {/* Step Goal Progress */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Daily Goal Progress:</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stepData.steps / 10000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {stepData.steps >= 10000 ? (
                      <span className="text-green-600 font-semibold">🎉 Goal achieved!</span>
                    ) : (
                      <span>{(10000 - stepData.steps).toLocaleString()} steps to reach 10,000 steps goal</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!stepData && !loading && (
              <div className="text-center text-gray-500 py-8">
                Click the button above to fetch your Google Fit step data
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="text-center mt-8">
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

export default GoogleFitPage