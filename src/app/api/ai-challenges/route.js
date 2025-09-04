import { NextResponse } from 'next/server';
import challengesDb from '../../db/challengesDb';
import stepDb from '../../db/stepDb';

// AI-powered adaptive challenge recommendation system
export async function POST(req) {
  try {
    const { team, timeframe = '7days', challengeType = 'mixed' } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    // Get team activity data for analysis
    const teamData = await getTeamAnalytics(team, timeframe);
    
    // Generate AI recommendations using Gemini
    const prompt = createChallengePrompt(teamData, challengeType);
    
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
    
    const body = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const aiRecommendation = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse AI response and create structured challenge
    const challenge = parseAIResponse(aiRecommendation, team);
    
    // Save the AI-generated challenge to database
    if (challenge) {
      const stmt = challengesDb.prepare(`
        INSERT INTO challenges (title, type, description, steps, squats, pushups, deadline, challenge_type, target_teams, created_by, difficulty, points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        challenge.title,
        challenge.type,
        challenge.description,
        challenge.steps || 0,
        challenge.squats || 0,
        challenge.pushups || 0,
        challenge.deadline,
        challenge.challenge_type || 'team',
        team,
        'ai_system',
        challenge.difficulty || 'medium',
        challenge.points || 100
      );

      challenge.id = result.lastInsertRowid;
    }

    return NextResponse.json({ 
      success: true, 
      challenge,
      analytics: teamData,
      aiInsight: aiRecommendation
    });

  } catch (error) {
    console.error('Error generating AI challenge:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate adaptive challenge' 
    }, { status: 500 });
  }
}

// Get comprehensive team analytics for AI analysis
async function getTeamAnalytics(team, timeframe) {
  const daysBack = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  const startDateStr = startDate.toISOString().split('T')[0];

  // Get team step data
  const stepQuery = stepDb.prepare(`
    SELECT 
      AVG(steps) as avg_steps,
      MAX(steps) as max_steps,
      MIN(steps) as min_steps,
      COUNT(DISTINCT user_name) as active_members,
      COUNT(*) as total_entries,
      SUM(steps) as total_steps
    FROM user_steps 
    WHERE team = ? AND date >= ?
  `);
  
  const stepData = stepQuery.get(team, startDateStr);

  // Get recent challenge participation
  const challengeQuery = challengesDb.prepare(`
    SELECT 
      COUNT(*) as total_challenges,
      COUNT(CASE WHEN completed = 1 THEN 1 END) as completed_challenges
    FROM challenge_participants cp
    JOIN challenges c ON cp.challenge_id = c.id
    WHERE cp.team = ? AND cp.created_at >= ?
  `);
  
  const challengeData = challengeQuery.get(team, startDateStr) || { total_challenges: 0, completed_challenges: 0 };

  // Calculate engagement patterns
  const engagementScore = calculateEngagementScore(stepData, challengeData);
  
  return {
    team,
    timeframe,
    stepData,
    challengeData,
    engagementScore,
    analytics: {
      avgDailySteps: Math.round(stepData?.avg_steps || 0),
      totalMembers: stepData?.active_members || 0,
      completionRate: challengeData.total_challenges > 0 ? 
        (challengeData.completed_challenges / challengeData.total_challenges * 100).toFixed(1) : 0,
      activityLevel: getActivityLevel(stepData?.avg_steps || 0),
      needsMotivation: engagementScore < 0.6
    }
  };
}

function calculateEngagementScore(stepData, challengeData) {
  const stepScore = Math.min((stepData?.avg_steps || 0) / 10000, 1); // Normalize to 10k steps
  const challengeScore = challengeData.total_challenges > 0 ? 
    challengeData.completed_challenges / challengeData.total_challenges : 0;
  const participationScore = Math.min((stepData?.active_members || 0) / 10, 1); // Assume 10 members max
  
  return (stepScore * 0.4 + challengeScore * 0.4 + participationScore * 0.2);
}

function getActivityLevel(avgSteps) {
  if (avgSteps < 3000) return 'low';
  if (avgSteps < 7000) return 'moderate';
  if (avgSteps < 10000) return 'high';
  return 'very_high';
}

function createChallengePrompt(teamData, challengeType) {
  return `You are an AI fitness coach creating adaptive wellness challenges for corporate teams. 

Team Analytics:
- Team: ${teamData.team}
- Average daily steps: ${teamData.analytics.avgDailySteps}
- Active members: ${teamData.analytics.totalMembers}
- Activity level: ${teamData.analytics.activityLevel}
- Challenge completion rate: ${teamData.analytics.completionRate}%
- Needs motivation: ${teamData.analytics.needsMotivation ? 'Yes' : 'No'}

Based on this data, create a personalized wellness challenge. Respond with a JSON object containing:
{
  "title": "Challenge name (max 50 chars)",
  "type": "steps|squats|pushups|mixed",
  "description": "Detailed description encouraging team participation",
  "steps": number (if step challenge, 0 otherwise),
  "squats": number (if squat challenge, 0 otherwise), 
  "pushups": number (if pushup challenge, 0 otherwise),
  "deadline": "YYYY-MM-DD (1 week from today)",
  "difficulty": "easy|medium|hard",
  "points": number (50-200 based on difficulty),
  "motivational_message": "Encouraging team message"
}

Guidelines:
- If activity level is low, suggest easier, more engaging challenges
- If completion rate is low, make challenges more achievable  
- If team needs motivation, add social/competitive elements
- For sedentary teams (low steps), suggest movement-based challenges
- Make challenges team-focused and achievable but motivating

Only respond with the JSON object, no other text.`;
}

function parseAIResponse(aiResponse, team) {
  try {
    // Extract JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const challenge = JSON.parse(jsonMatch[0]);
    
    // Set deadline to 1 week from now if not specified
    if (!challenge.deadline) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);
      challenge.deadline = deadline.toISOString().split('T')[0];
    }
    
    // Ensure required fields
    challenge.challenge_type = 'team';
    challenge.name = challenge.title;
    
    return challenge;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
}

// GET endpoint to fetch existing AI-generated challenges
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const team = searchParams.get('team');
    
    let query = 'SELECT * FROM challenges WHERE created_by = "ai_system"';
    let params = [];
    
    if (team) {
      query += ' AND (target_teams = ? OR target_teams IS NULL)';
      params.push(team);
    }
    
    query += ' ORDER BY created_at DESC LIMIT 10';
    
    const stmt = challengesDb.prepare(query);
    const challenges = stmt.all(...params);
    
    return NextResponse.json({ success: true, challenges });
  } catch (error) {
    console.error('Error fetching AI challenges:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch challenges' 
    }, { status: 500 });
  }
}