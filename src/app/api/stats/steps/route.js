import db from '../../../db/db';

export  async function POST(req, res) {
    if (req.method === 'POST') {

                const { steps , user } = await req.json();

    let userr=""

       
                   try {
                       const userr =user;
                       
        
        try {
            const user = db.prepare('SELECT * FROM users WHERE username = ?').get(userr);

            if (!user) {
                return new Response(JSON.stringify("User Not found"), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            let newSteps = user.stepcount||0;
                newSteps += steps;
           
            db.prepare('UPDATE users SET stepcount = ? WHERE username = ?')
                .run(newSteps, userr);


            return new Response(JSON.stringify({steps:newSteps}), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error(error);
            return new Response(JSON.stringify("Something went wrong"), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        
                    } catch (error) {
            console.error(error);
            return new Response(JSON.stringify("Something went wrong"), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } else {
        return new Response(JSON.stringify("Nope"), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET(request) {
    return new Response(JSON.stringify({ user: 'John Doe' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
  }