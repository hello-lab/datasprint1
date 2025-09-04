import { NextResponse } from 'next/server';
import challengesDb from '../../db/challengesDb';
import stepDb from '../../db/stepDb';

// Team engagement and notification system
export async function POST(req) {
  try {
    const { action, team, userName } = await req.json();

    switch (action) {
      case 'updateEngagement':
        return await updateTeamEngagement(team);
      case 'triggerNotifications':
        return await triggerEngagementNotifications(team);
      case 'checkGoals':
        return await checkTeamGoals(team);
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Engagement API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Get team engagement metrics
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const team = searchParams.get('team');
    const timeframe = searchParams.get('timeframe') || '7days';

    if (!team) {
      return NextResponse.json({ 
        success: false, 
        error: 'Team parameter required' 
      }, { status: 400 });
    }

    const daysBack = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 7;
    const engagement = await calculateTeamEngagement(team, daysBack);
    
    return NextResponse.json({ 
      success: true, 
      team,
      timeframe,
      engagement 
    });

  } catch (error) {
    console.error('Error fetching engagement:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch engagement data' 
    }, { status: 500 });
  }
}

// Calculate comprehensive team engagement metrics
async function calculateTeamEngagement(team, daysBack = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  const startDateStr = startDate.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  // Get team step data
  const stepQuery = stepDb.prepare(`
    SELECT 
      user_name,
      AVG(steps) as avg_steps,
      COUNT(*) as active_days,
      MAX(steps) as max_steps,
      MIN(steps) as min_steps,
      SUM(steps) as total_steps
    FROM user_steps 
    WHERE team = ? AND date >= ?
    GROUP BY user_name
  `);
  
  const memberData = stepQuery.all(team, startDateStr);

  // Get team challenge participation
  const challengeQuery = challengesDb.prepare(`
    SELECT 
      cp.user_name,
      COUNT(*) as total_challenges,
      COUNT(CASE WHEN cp.completed = 1 THEN 1 END) as completed_challenges,
      AVG(cp.current_progress) as avg_progress
    FROM challenge_participants cp
    JOIN challenges c ON cp.challenge_id = c.id
    WHERE cp.team = ? AND cp.created_at >= ?
    GROUP BY cp.user_name
  `);
  
  const challengeData = challengeQuery.all(team, startDateStr);

  // Calculate team totals and averages
  const totalMembers = memberData.length;
  const totalSteps = memberData.reduce((sum, member) => sum + (member.total_steps || 0), 0);
  const avgStepsPerMember = totalMembers > 0 ? totalSteps / totalMembers : 0;
  const avgActiveDays = totalMembers > 0 ? 
    memberData.reduce((sum, member) => sum + (member.active_days || 0), 0) / totalMembers : 0;

  // Calculate engagement scores
  const stepEngagement = Math.min(avgStepsPerMember / 10000, 1); // Normalize to 10k steps
  const consistencyEngagement = Math.min(avgActiveDays / daysBack, 1);
  
  const totalChallenges = challengeData.reduce((sum, member) => sum + (member.total_challenges || 0), 0);
  const totalCompleted = challengeData.reduce((sum, member) => sum + (member.completed_challenges || 0), 0);
  const challengeEngagement = totalChallenges > 0 ? totalCompleted / totalChallenges : 0;

  const overallEngagement = (stepEngagement * 0.4 + consistencyEngagement * 0.3 + challengeEngagement * 0.3);

  // Identify engagement issues and opportunities
  const insights = generateEngagementInsights(memberData, challengeData, overallEngagement);

  // Get recent trends
  const trends = await getEngagementTrends(team, daysBack);

  return {
    teamName: team,
    totalMembers,
    metrics: {
      totalSteps,
      avgStepsPerMember: Math.round(avgStepsPerMember),
      avgActiveDays: Math.round(avgActiveDays * 10) / 10,
      challengeCompletionRate: Math.round(challengeEngagement * 100),
      overallEngagementScore: Math.round(overallEngagement * 100)
    },
    scores: {
      stepEngagement: Math.round(stepEngagement * 100),
      consistencyEngagement: Math.round(consistencyEngagement * 100),
      challengeEngagement: Math.round(challengeEngagement * 100),
      overall: Math.round(overallEngagement * 100)
    },
    memberData,
    challengeData,
    insights,
    trends,
    recommendations: generateRecommendations(insights, overallEngagement)
  };
}

// Generate actionable insights based on engagement data
function generateEngagementInsights(memberData, challengeData, overallEngagement) {
  const insights = [];

  // Low activity members
  const lowActivityMembers = memberData.filter(member => (member.avg_steps || 0) < 3000);
  if (lowActivityMembers.length > 0) {
    insights.push({
      type: 'warning',
      category: 'activity',
      title: 'Low Activity Alert',
      message: `${lowActivityMembers.length} team members averaging under 3,000 steps/day`,
      members: lowActivityMembers.map(m => m.user_name),
      priority: 'high'
    });
  }

  // Inconsistent participation
  const inconsistentMembers = memberData.filter(member => (member.active_days || 0) < 3);
  if (inconsistentMembers.length > 0) {
    insights.push({
      type: 'info',
      category: 'consistency',
      title: 'Participation Drop',
      message: `${inconsistentMembers.length} members need consistency boost`,
      members: inconsistentMembers.map(m => m.user_name),
      priority: 'medium'
    });
  }

  // High performers
  const highPerformers = memberData.filter(member => (member.avg_steps || 0) > 10000);
  if (highPerformers.length > 0) {
    insights.push({
      type: 'success',
      category: 'achievement',
      title: 'Team Champions',
      message: `${highPerformers.length} members exceeding 10k steps/day!`,
      members: highPerformers.map(m => m.user_name),
      priority: 'positive'
    });
  }

  // Overall team health
  if (overallEngagement < 0.4) {
    insights.push({
      type: 'warning',
      category: 'overall',
      title: 'Team Needs Motivation',
      message: 'Overall engagement is low - time for team challenges!',
      priority: 'high'
    });
  } else if (overallEngagement > 0.8) {
    insights.push({
      type: 'success',
      category: 'overall',
      title: 'Excellent Team Engagement',
      message: 'Your team is crushing their wellness goals!',
      priority: 'positive'
    });
  }

  return insights;
}

// Generate recommendations based on insights
function generateRecommendations(insights, engagementScore) {
  const recommendations = [];

  const hasLowActivity = insights.some(i => i.category === 'activity');
  const hasConsistencyIssues = insights.some(i => i.category === 'consistency');
  const hasHighPerformers = insights.some(i => i.category === 'achievement');

  if (hasLowActivity) {
    recommendations.push({
      type: 'challenge',
      title: 'Start Simple Movement Challenge',
      description: 'Create easy, achievable challenges for less active members',
      action: 'create_easy_challenge',
      icon: '🚶‍♂️'
    });
  }

  if (hasConsistencyIssues) {
    recommendations.push({
      type: 'social',
      title: 'Buddy System',
      description: 'Pair inconsistent members with active teammates',
      action: 'create_buddy_pairs',
      icon: '👥'
    });
  }

  if (hasHighPerformers) {
    recommendations.push({
      type: 'leadership',
      title: 'Wellness Champions',
      description: 'Make high performers team wellness leaders',
      action: 'assign_champions',
      icon: '🏆'
    });
  }

  if (engagementScore < 0.5) {
    recommendations.push({
      type: 'ai',
      title: 'AI Challenge Boost',
      description: 'Generate personalized team challenges with AI',
      action: 'generate_ai_challenge',
      icon: '🤖'
    });
  }

  return recommendations;
}

// Get engagement trends over time
async function getEngagementTrends(team, daysBack) {
  // This would typically involve more complex time-series analysis
  // For now, return a simplified trend
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

  // Compare this week vs last week
  const thisWeekQuery = stepDb.prepare(`
    SELECT AVG(steps) as avg_steps, COUNT(DISTINCT user_name) as active_members
    FROM user_steps 
    WHERE team = ? AND date >= ?
  `);

  const lastWeekQuery = stepDb.prepare(`
    SELECT AVG(steps) as avg_steps, COUNT(DISTINCT user_name) as active_members
    FROM user_steps 
    WHERE team = ? AND date >= ? AND date < ?
  `);

  const thisWeek = thisWeekQuery.get(team, weekAgoStr);
  const lastWeek = lastWeekQuery.get(team, twoWeeksAgoStr, weekAgoStr);

  const stepTrend = thisWeek && lastWeek ? 
    ((thisWeek.avg_steps - lastWeek.avg_steps) / lastWeek.avg_steps * 100) : 0;

  const memberTrend = thisWeek && lastWeek ?
    ((thisWeek.active_members - lastWeek.active_members) / lastWeek.active_members * 100) : 0;

  return {
    stepTrend: Math.round(stepTrend * 10) / 10,
    memberTrend: Math.round(memberTrend * 10) / 10,
    direction: stepTrend > 0 ? 'improving' : stepTrend < 0 ? 'declining' : 'stable'
  };
}

// Update team engagement metrics in database
async function updateTeamEngagement(team) {
  try {
    const engagement = await calculateTeamEngagement(team);
    const today = new Date().toISOString().split('T')[0];

    const insertQuery = challengesDb.prepare(`
      REPLACE INTO team_engagement (team, date, active_members, total_steps, engagement_score)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertQuery.run(
      team,
      today,
      engagement.totalMembers,
      engagement.metrics.totalSteps,
      engagement.scores.overall / 100
    );

    return NextResponse.json({ 
      success: true, 
      engagement,
      message: 'Team engagement updated successfully' 
    });
  } catch (error) {
    console.error('Error updating engagement:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update engagement' 
    }, { status: 500 });
  }
}

// Trigger engagement notifications and recommendations
async function triggerEngagementNotifications(team) {
  try {
    const engagement = await calculateTeamEngagement(team);
    const notifications = [];

    // Generate notifications based on insights
    engagement.insights.forEach(insight => {
      if (insight.priority === 'high') {
        notifications.push({
          type: 'alert',
          team,
          title: insight.title,
          message: insight.message,
          action: 'review_team_engagement',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Add recommendations as notifications
    engagement.recommendations.slice(0, 2).forEach(rec => {
      notifications.push({
        type: 'suggestion',
        team,
        title: rec.title,
        message: rec.description,
        action: rec.action,
        timestamp: new Date().toISOString()
      });
    });

    return NextResponse.json({ 
      success: true, 
      notifications,
      engagement: engagement.scores,
      message: `Generated ${notifications.length} engagement notifications`
    });
  } catch (error) {
    console.error('Error triggering notifications:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to trigger notifications' 
    }, { status: 500 });
  }
}

// Check team goals and milestones
async function checkTeamGoals(team) {
  try {
    const engagement = await calculateTeamEngagement(team);
    const goals = [];

    // Define team goals
    const teamGoals = [
      { type: 'steps', target: 100000, current: engagement.metrics.totalSteps, unit: 'steps/week' },
      { type: 'average', target: 8000, current: engagement.metrics.avgStepsPerMember, unit: 'avg steps/member' },
      { type: 'participation', target: 80, current: engagement.scores.consistencyEngagement, unit: '% active days' },
      { type: 'challenges', target: 70, current: engagement.scores.challengeEngagement, unit: '% completion rate' }
    ];

    teamGoals.forEach(goal => {
      const progress = Math.min((goal.current / goal.target) * 100, 100);
      goals.push({
        ...goal,
        progress: Math.round(progress),
        achieved: progress >= 100,
        status: progress >= 100 ? 'completed' : progress >= 75 ? 'close' : progress >= 50 ? 'progress' : 'needs_work'
      });
    });

    return NextResponse.json({ 
      success: true, 
      team,
      goals,
      overallProgress: Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    });
  } catch (error) {
    console.error('Error checking goals:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check team goals' 
    }, { status: 500 });
  }
}