import { NextResponse } from 'next/server';
import stepDb from '../../db/stepDb';
import challengesDb from '../../db/challengesDb';

export async function POST(req) {
  const { message, userName, team } = await req.json();
  const apiKey = process.env.GOOGLE_API_KEY;

  // Get user context for personalized responses
  const userContext = await getUserWellnessContext(userName, team);
  
  // Enhanced prompt with corporate wellness expertise and user context
  const enhancedMessage = `${message}

User Context:
- Username: ${userName || 'Guest'}
- Team: ${team || 'Unknown'}
- Recent Step Average: ${userContext.avgSteps || 0} steps/day
- Active Challenges: ${userContext.activeChallenges || 0}
- Team Activity Level: ${userContext.teamActivityLevel || 'unknown'}
- Wellness Goal Progress: ${userContext.goalProgress || 0}%

You are Steppe, an AI-powered corporate wellness assistant specializing in:

🏃‍♂️ FITNESS & MOVEMENT
- Step counting and walking challenges
- Desk exercises and stretches for office workers
- Team-based fitness activities
- Ergonomic workplace wellness

💪 TEAM CHALLENGES & MOTIVATION
- Creating engaging wellness challenges
- Team building through fitness
- Gamification strategies for workplace wellness
- Progress tracking and goal setting

🧠 MENTAL WELLNESS AT WORK
- Stress management techniques
- Mindfulness and breathing exercises
- Work-life balance strategies
- Team morale and engagement

📊 WELLNESS ANALYTICS
- Understanding fitness data and progress
- Setting realistic wellness goals
- Team performance insights
- Habit formation strategies

🎯 CORPORATE WELLNESS PROGRAMS
- Designing inclusive wellness initiatives
- ROI of workplace wellness
- Employee engagement strategies
- Health and productivity connections

RESPONSE GUIDELINES:
- Be encouraging, motivational, and positive
- Provide actionable, practical advice
- Reference the user's context when relevant
- Suggest team-based activities when appropriate
- Keep responses conversational and supportive
- Include relevant emojis for engagement
- Focus on corporate wellness and team building
- Avoid medical advice, stick to general wellness

Please respond in a friendly, professional tone as a corporate wellness expert. Keep responses concise but helpful (200-300 words max).`;

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

  const body = {
    contents: [{ parts: [{ text: enhancedMessage }] }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    
    // Clean up markdown formatting
    reply = reply.replace(/\*\*(.*?)\*\*/g, '$1');
    reply = reply.replace(/\*(.*?)\*/g, '$1');
    reply = reply.replace(/#{1,6}\s/g, '');
    
    // Add personalized suggestions based on user context
    if (userContext.needsMotivation) {
      reply += `\n\n💡 Pro tip: I noticed your team could use some extra motivation! Why not start a friendly step challenge or suggest a walking meeting to boost engagement?`;
    }
    
    if (userContext.lowActivity) {
      reply += `\n\n🚶‍♂️ Quick suggestion: Try the "2-minute movement" rule - every hour, take 2 minutes to walk around or do desk stretches. Your team can do it together!`;
    }

    return NextResponse.json({ 
      reply,
      userContext,
      suggestions: generateSmartSuggestions(userContext)
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ 
      reply: `I'm having trouble connecting right now, but I'm here to help with your wellness journey! 💪 

Here are some quick tips:
• Take a 5-minute walking break every hour
• Try desk stretches to reduce tension
• Suggest a team walking meeting
• Set a daily step goal and track progress
• Practice deep breathing exercises

Would you like specific advice for ${team ? `your ${team} team` : 'workplace wellness'}?`
    });
  }
}

// Get user wellness context for personalized responses
async function getUserWellnessContext(userName, team) {
  try {
    if (!userName || !team) {
      return { needsMotivation: true, lowActivity: true };
    }

    // Get recent step data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const stepQuery = stepDb.prepare(`
      SELECT AVG(steps) as avg_steps, COUNT(*) as active_days
      FROM user_steps 
      WHERE user_name = ? AND date >= ?
    `);
    
    const stepData = stepQuery.get(userName, sevenDaysAgoStr);

    // Get team data
    const teamQuery = stepDb.prepare(`
      SELECT AVG(steps) as team_avg_steps, COUNT(DISTINCT user_name) as active_members
      FROM user_steps 
      WHERE team = ? AND date >= ?
    `);
    
    const teamData = teamQuery.get(team, sevenDaysAgoStr);

    // Get active challenges
    const challengeQuery = challengesDb.prepare(`
      SELECT COUNT(*) as active_challenges
      FROM challenge_participants cp
      JOIN challenges c ON cp.challenge_id = c.id
      WHERE cp.user_name = ? AND cp.completed = 0 AND c.status = 'active'
    `);
    
    const challengeData = challengeQuery.get(userName);

    const avgSteps = Math.round(stepData?.avg_steps || 0);
    const teamAvgSteps = Math.round(teamData?.team_avg_steps || 0);
    const activeDays = stepData?.active_days || 0;
    const activeChallenges = challengeData?.active_challenges || 0;

    return {
      avgSteps,
      teamAvgSteps,
      activeDays,
      activeChallenges,
      teamActivityLevel: getActivityLevel(teamAvgSteps),
      goalProgress: Math.min((avgSteps / 10000) * 100, 100),
      needsMotivation: avgSteps < 5000 || activeDays < 3,
      lowActivity: avgSteps < 3000,
      teamNeedsBoost: teamAvgSteps < 6000
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return { needsMotivation: true, lowActivity: true };
  }
}

function getActivityLevel(avgSteps) {
  if (avgSteps < 3000) return 'low';
  if (avgSteps < 7000) return 'moderate';
  if (avgSteps < 10000) return 'high';
  return 'very_high';
}

function generateSmartSuggestions(context) {
  const suggestions = [];
  
  if (context.lowActivity) {
    suggestions.push({
      type: 'movement',
      title: 'Start Small',
      text: 'Try a 10-minute walk during lunch break',
      icon: '🚶‍♂️'
    });
  }
  
  if (context.needsMotivation) {
    suggestions.push({
      type: 'challenge',
      title: 'Join a Challenge',
      text: 'Participate in team challenges for extra motivation',
      icon: '🏆'
    });
  }
  
  if (context.teamNeedsBoost) {
    suggestions.push({
      type: 'team',
      title: 'Team Activity',
      text: 'Suggest a group walking meeting or desk exercise session',
      icon: '👥'
    });
  }
  
  return suggestions;
}
