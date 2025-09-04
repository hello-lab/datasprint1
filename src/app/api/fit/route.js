import { auth } from "../../lib/auth"
import stepDb from "../../db/stepDb"
import db from "../../db/db"
import { verifyToken } from '../../utils/auth';

export async function GET(request) {
  try {
    // Get the session to access the user's access token
    const session = await auth()
    let userr=""
    if (!session || !session.accessToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated with Google' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    //verify
      const cookies = request.cookies.getAll();
    const tokenCookie = cookies.find(c => c.name === 'token');
    const token = tokenCookie ? tokenCookie.value : null;
       
                   if (!token) return new Response(JSON.stringify({ error: 'Invalid token' }), {
                       status: 401,
                       headers: { 'Content-Type': 'application/json' },
                   });
       
                   try {
                        userr = verifyToken(token);
                        userr =db.prepare("SELECT * FROM users WHERE username = ?").get(userr.username);
                       console.log((userr.username) +"hey");
                   }
                   catch{
                     return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
                   }





    // Calculate date range for last 24 hours
    const endTime = new Date()
    // Set startTime to midnight of the previous day
    const startTime = new Date(endTime)
    startTime.setDate(endTime.getDate() - 1)
    startTime.setHours(0, 0, 0, 0)
    
    // Format dates for Google Fit API (nanoseconds since epoch)
    const startTimeNanos = (startTime.getTime() * 1000000).toString()
    const endTimeNanos = (endTime.getTime() * 1000000).toString()


  

    // Google Fit API request for step count data
    const fitApiUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'
    
    const requestBody = {
      aggregateBy: [
        {
          dataTypeName: "com.google.step_count.delta",
          dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }
      ],
      bucketByTime: { durationMillis: 86400000 }, // 24 hours in milliseconds
      startTimeMillis: startTime.getTime(),
      endTimeMillis: endTime.getTime()
    }

    // Make request to Google Fit API
    const response = await fetch(fitApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google Fit API error:', errorData)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch step data from Google Fit',
        details: errorData
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    
    // Extract step count from the response
    let totalSteps = 0
    if (data.bucket && data.bucket.length > 0) {
      data.bucket.forEach(bucket => {
        if (bucket.dataset && bucket.dataset.length > 0) {
          bucket.dataset[0].point.forEach(point => {
            if (point.value && point.value.length > 0) {
              totalSteps += point.value[0].intVal || 0
            }
          })
        }
      })
    }

    // Save step data to database
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const insertStmt = stepDb.prepare(`
        INSERT  INTO user_steps (user_email, user_name, steps, date, team)
        VALUES (?, ?, ?, ?, ?)
      `);
        const existingEntry = stepDb.prepare('SELECT * FROM user_steps WHERE user_name = ? AND date = ?').all(userr.username, today);
        console.log(existingEntry+"hiii");
        if(existingEntry.length==0)
         fetch("http://"+request.headers.get("host")+'/api/stats/steps',{
             method: 'POST',
      headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({steps:totalSteps,user:userr.username,team:userr.team}),
         })
         console.log(userr)
      insertStmt.run(
        userr.email || 'unknown',
        userr.username || 'Unknown User',
        totalSteps,
        today,
        userr.team
      );
    } catch (dbError) {
      console.error('Error saving step data to database:', dbError);
      // Continue execution even if database save fails
    }

    return new Response(JSON.stringify({ 
      steps: totalSteps,
      timeRange: {
        start: startTime.toISOString(),
        end: endTime.toISOString()
      },
      rawData: data // Include raw data for debugging
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error fetching Google Fit data:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}