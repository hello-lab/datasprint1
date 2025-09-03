import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const csvPath = path.join(process.cwd(), 'src', 'app', 'app', 'market', 'product.csv');
  let data = [];
  try {
    const csv = fs.readFileSync(csvPath, 'utf8');
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.trim();
      });
      return obj;
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read CSV', details: err.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}

export async function POST(req) {
  if (req.method === 'POST') {
    try {
      const { url } = await req.json();
      const response = await fetch(url);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response(JSON.stringify({ error: 'Error fetching data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,      headers: { 'Content-Type': 'application/json' },
    });
  }
}