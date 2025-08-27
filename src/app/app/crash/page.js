'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [speed, setSpeed] = useState(0);
    const [isCrashed, setIsCrashed] = useState(false);
    const [betAmount, setBetAmount] = useState();
    const [isBetPlaced, setIsBetPlaced] = useState(false);
    const [socket, setSocket] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch('/api/auth/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'value' }) // Adjust the body as needed
            });
            const data = await res.json();
            
            console.log(data.user)
            setUser(data.user);
            setBalance(data.user.balance);
        };

        fetchProfile();
    }, []);


    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080?subdomain=crash');
        setSocket(socket);

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            const newMessage = event.data;
            let evennt = JSON.parse(event.data);
            console.log(evennt.type);
            if (evennt.type === "crash") {
                console.log('Crash');
                setSpeed(0);
                setIsCrashed(true);
                setIsBetPlaced(false);
            } else if (evennt.type === "game_tick") {
                setSpeed(evennt.multiplier);
                setIsCrashed(false);
                console.log(evennt.multiplier);
            } else if (evennt.type === "game_start") {
                setGameId(evennt.gameId);
                console.log(`Game started with ID: ${evennt.gameId}`);
            }
            else if(evennt.type === "balance"){
                console.log('Cashout');
                setBalance(evennt.balance);
        }}

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    const handlePlaceBet = async () => {
        toast.loading('Placing bet...');
        if (betAmount > 0) {
            setIsBetPlaced(true);
            console.log(`Bet placed: ${betAmount}`);
           
            const res = await fetch('/api/crashBets/bet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameid: gameId, betAmount })
            });
            const data = await res.json();
            console.log(data);
            if (data.message) {
                toast.dismiss();
                toast.success(data.message);
                setBalance(balance - betAmount);
            } else {
                toast.dismiss();
                toast.error(data.message);    
                
                setIsBetPlaced(false);
            }
        }
    };

    const handleCashOut = async () => {
        if (isBetPlaced) {
            toast.loading('Cashing out...');
            console.log(`Cashed out at: ${speed}x`);
            setIsBetPlaced(false);
            const token = Cookies.get('token');
            if (socket) {
               
                socket.send(JSON.stringify({ type: 'cashout', userId: user.username, multiplier: speed, gameId, token,betAmount }));
                
                const res = await fetch('/api/auth/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'value' }) // Adjust the body as needed
                });
                const data = await res.json().then(data => {console.log(data.user)
                    toast.dismiss();
                    toast.success('Cashed out successfully');
                    setBalance(data.user.balance);});
                
                
            }
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div >
                              <img src="/vimaanbanner.png" alt="Banner" className='banner' />

            <h1 className='highlights'>Crash</h1>
            <br></br>
            <div className='par'>
            <div className="canvas" style={{ width:"100%", overflow: 'hidden' }}>
                <div className={`sky ${isCrashed ? 'no-animation' : ''}`} style={{ animation: `scroll-sky ${5}s linear infinite` }}>
                    <img
                        src="/sky.jpg"
                        alt="Sky"
                        layout="fill"
                       
                    />
                    <img
                        src="/sky.jpg"
                        alt="Sky"
                        layout="fill"
                        
                    />
                </div>
            </div>
            <img className={`plane ${isCrashed ? 'no-animation' : ''}`}
                src="/plane.png"
                alt="Plane"
                style={{ rotate: `${10 - speed}deg`, height: 'auto', display: 'block', margin: '0 auto', animation: `vibrate 0.3s linear infinite` }}
            /> 
            <div className='overlay' style={{zIndex:`${isCrashed ? '2' : '-1'}`}}>CRASHED!!</div>
            <div className='mult'>{speed}x</div>
            </div>
            <div className="bet-controls">
                <div>
                <p style={{color:'black',fontSize:'larger',fontWeight:'bold'}}>Account Balance: Rs {balance}</p><input
                style={{color: 'black'}}
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    placeholder="Enter bet amount"
                    disabled={!isCrashed}
                />&nbsp;
                <button onClick={handlePlaceBet} disabled={!isCrashed || isBetPlaced}>Place Bet</button>&nbsp;

               
                
                <button onClick={handleCashOut} disabled={isCrashed || !isBetPlaced}>Cash Out</button>
            </div> </div>
        </div>
    );
};

export default HomePage;