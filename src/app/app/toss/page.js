"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [speed, setSpeed] = useState('none');
  const [bspeed, setbSpeed] = useState('none');
  const [winbetW, setwinbetW] = useState([]);
  const [degree, setDegree] = useState(0);
  const [bdegree, setbDegree] = useState(0);
  const [betAmountW, setbetAmountW] = useState();
  const [isBetPlacedW, setIsBetPlacedW] = useState([false]);
  const [socket,setSocket]=useState('')
const [number,setNumber]=useState(99)
  const [isCrashed, setIsCrashed] = useState(true);
  

  const [gameId, setGameId] = useState("SHIT");
  const [balance, setBalance] = useState(0);
  

  const [firstDropdown, setFirstDropdown] = useState(["SELECT"]);
  const [secondDropdownOptions, setSecondDropdownOptions] = useState([[]]);
  const [seconddropdown, setseconddropdown] = useState(["SELECT"]);
  const [betDivs, setBetDivs] = useState([0]);

 


  function rot(n) {
    setNumber("Spinning")
    if (n==NaN)
      return
    
    let r = 22 + n/2
    console.log(r);
    setSpeed(`spinX 0.5s linear ${r} forwards`);
    setTimeout(() => {
      setDegree('0')
      setSpeed(`none`);
      if (n==1)
      setDegree('180')

      
      setNumber(n==0?'Head':'Tail')
    }, 12000);
  }


  function handleclik(value, a) {
    if (a == "W") setwinbetW(value);}

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "value" }), // Adjust the body as needed
      });
      const data = await res.json();

      console.log(data.user);
      setUser(data.user);
      setBalance(data.user.balance);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
 
    
    const socket = new WebSocket("ws://localhost:8080?subdomain=toss");
    setSocket(socket);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const newMessage = event.data;
      let evennt = JSON.parse(event.data);
      console.log(evennt.type);
    
      
      if (evennt.type === "deal") {
        rot(evennt.number)
       let t=isBetPlacedW 
    
      

      
       
        setIsCrashed(true);
        
        setTimeout(() => {
         
          setIsCrashed(true);
         
        }, 5500);
      } else if (evennt.type === "game_start") {
         setIsCrashed(false);
         setIsBetPlacedW(false);
        setGameId(evennt.gameid);
        console.log(`Game started with ID: ${evennt}`);
        console.log(evennt)
      } else if (evennt.type === "balance") {
        console.log("Cashout");
      toast.success(`Won Rs${(evennt.balance-balance).toFixed(2)}`)
        setBalance(evennt.balance);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handlePlaceBet = async () => {
    toast.loading("Placing bet...");
   
    if (betAmountW > 0) {
     
      console.log(`Bet placed: ${betAmountW}`);

      const res = await fetch("/api/toss/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameid: gameId, betAmount: betAmountW, winbet: winbetW, type: 'W' }),
      });
      const data = await res.json();
      console.log(data);
      if (data.message) {
        toast.dismiss();
        toast.success(data.message);
        setBalance((balance - betAmountW).toFixed(2));
        
        setIsBetPlacedW(true);
      } else {
        toast.dismiss();
        toast.error(data.message);
        setIsBetPlacedW(false);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
                  <img src="/coin.jpg" alt="Banner" className='banner' />

      <h1 className="highlights">HEADS AND TAILS</h1>
      <br></br>
      <div className="scores"> 
            Winner: <span style={{color:"#e0ffe0"}}>{number}</span>
          </div>
      <div className="par1">
        <div className="canvas2" style={{ width: "100%", overflow: "hidden",padding:"15vh" }}>
         <div>
          <div className="coin"  style={{ transform: `rotateX(${degree}deg)`, animation: speed }} ><img className="front" src="/coin1.png"></img><img className="back" src="/coin2.png"></img></div>
         </div>
          
        </div>

        <br></br>
        <p style={{ color: "black", fontSize: "larger", fontWeight: "bold" }}>
          Account Balance: Rs {balance}
        </p>
        <br></br>
        <div>
          <div className="Winning-Hand ">
            <div style={{color:'purple',fontWeight:'bolder'}}>BETS</div>

            <div className="probability">
              <div className="bet-controls">
              
                  <div className="Winning-Hand ">
                  <div>Winning Hand: 2x</div>
      
                  <div className="probablity">
                    <p
                      className={` ${winbetW == "A" ? "active" : "inactive"}`}
                      onClick={() => handleclik("A", "W")}
                    >
                      HEAD
                    </p>
                    <p
                      className={` ${winbetW == "B" ? "active" : "inactive"}`}
                      onClick={() => handleclik("B", "W")}
                    >
                      TAIL
                    </p>
                   
                    <div className="bet-controls">
                      <div>
                        <input
                          style={{ color: "black" }}
                          type="number"
                          value={betAmountW}
                          onChange={(e) => setbetAmountW(Number(e.target.value))}
                          placeholder="Enter bet amount"
                          disabled={isCrashed||isBetPlacedW}
                        />
                        &nbsp;
                        <button
                          onClick={handlePlaceBet}
                          disabled={ isCrashed || isBetPlacedW}
                        >
                          Place Bet
                        </button>
                        &nbsp;
                      </div>
                    </div>
                  </div>
      
                  <div></div>
      
                  <br></br>
                </div>
                
               
              </div>
            </div>

            <div></div>

            <br></br>
          </div>
          <br></br>
          <br></br>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
