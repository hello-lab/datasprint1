import db from '../../../db/db';
import { hashPassword} from '../../../utils/auth';

export async function GET(request) {
  return new Response(JSON.stringify({ user: 'John Doe' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
  });
}


export  async function POST(request, res) {
  if (request.method !== 'POST') return res.status(405).end();

  const {username,password,team,email} = await request.json()

console.log(username)


  try {
    const hashedPassword = await hashPassword(password);
    const stmt = db.prepare('INSERT INTO users (username, password,balance,team, email) VALUES (?, ?,100,?,?)');
    stmt.run(username, hashedPassword,team,email);

    return new Response(JSON.stringify("User Created"), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      
    })
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ message: err }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
  });
  }}
export async function PUT(request) {
    // Accept file upload (CSV/Excel)
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
        return new Response(JSON.stringify({ message: 'No file uploaded' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    // Parse CSV (simple comma separated, first row is header)
    const rows = text.split('\n').map(row => row.trim()).filter(Boolean);
    const headers = rows[0].split(',');
    const employees = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((acc, header, idx) => {
            acc[header.trim()] = values[idx].trim();
            return acc;
        }, {});
    });
console.log(employees);
    const results = [];
    for (const emp of employees) {
        // Generate random password based on email address
        const base = emp.email || '';
        const random = Math.random().toString(36).slice(-4);
        const password = (base.split('@')[0] + random).slice(0, 12);

        const hashedPassword = await hashPassword(password);

        try {
            const stmt = db.prepare('INSERT INTO users (username, password, balance, team, email) VALUES (?, ?, 100, ?, ?)');
            stmt.run(emp.Username, hashedPassword, emp.Team, emp.Email);
            // Send info to mailing API
            const hostUrl = request.headers.get('host');
            await fetch(`http://${hostUrl}/api/email/pass`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipient: emp.Email,
                    username: emp.Username,
                    password,
                }),
            });

            results.push({ username: emp.username, status: 'created' });
        } catch (err) {
            results.push({ username: emp.username, status: 'error', error: err.message });
        }
    }

    return new Response(JSON.stringify(results), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
