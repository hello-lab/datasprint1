import  challengesDb  from '../../db/claimDb.js';

export async function POST(req) {
    // Receive the id of the challenge in the request body
    const {  username, claim } = await req.json();
    const stmt=challengesDb.prepare('INSERT INTO claims ( username, claim) VALUES ( ?, ?)');
    // Update the 'clear' attribute to true for the specified challenge by id
      const stmt1=challengesDb.prepare('SELECT last_claimed FROM claims WHERE username= ?');
    // Update the 'clear' attribute to true for the specified challenge by id
    
    try {
        for (const row of stmt1.all(username)) {
            console.log(row);
            // Process each row as needed
            if (new Date(row.last_claimed).getDate() == new Date().getUTCDate()) {
               
            return new Response(JSON.stringify({ success: false,  error: "already claimed" }), { status: 400 });
        }
                 try {
        stmt.run( username, claim);
         fetch(`http://${req.headers.get('host')}/api/transaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            
            body: JSON.stringify({ user:username, amount:Math.round(claim/10), type:'deposit',remarks:'steps claim reward' }),
        }).then((res) => res.json()).then((data) => {
            console.log(data); // Handle the response data as needed
        }).catch((error) => {
            console.error('Error:', error); // Handle any errors that occur during the fetch
        });
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }

    }
 try {
        stmt.run( username, claim);
        fetch(`http://${req.headers.get('host')}/api/transaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user:username, amount:Math.round(claim/10), type:'deposit',remarks:'steps claim reward' }),
        }).then((res) => res.json()).then((data) => {
            console.log(data); // Handle the response data as needed
        }).catch((error) => {
            console.error('Error:', error); // Handle any errors that occur during the fetch
        });
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
       
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
   
}
export async function GET(req) {
    // Receive the id of the challenge in the request body
    const {  username, claim } = await req.json();
  
}