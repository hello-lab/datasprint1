import { NextResponse } from 'next/server';

export async function POST(req) {
  const { message } = await req.json();
  const apiKey = process.env.GOOGLE_API_KEY;

  // Gemini API endpoint (replace with correct endpoint if needed)
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

  const body = {
    contents: [{ parts: [{ text: message }] }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return NextResponse.json({ reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.' });
  } catch (error) {
    return NextResponse.json({ reply: 'Error fetching Gemini response.' });
  }
}
