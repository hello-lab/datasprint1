"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [speed, setSpeed] = useState('none');
  const [bspeed, setbSpeed] = useState('none');
  const [distance, setDistance] = useState([]);
  const [degree, setDegree] = useState(0);
  const [bdegree, setbDegree] = useState(0);
  const [betAmountW, setBetAmountW] = useState();
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

  const handleFirstDropdownChange = (value, index) => {
    let val = [...firstDropdown];
    val[index] = value;
    setFirstDropdown(val);
    let options = [];
    switch (value) {
      case "A":
        options = ["ODD", "EVEN"];
        break;
      case "B":
        options = ["RED", "BLACK"];
        break;
      case "C":
        options = ["1-18", "19-36"];
        break;
      case "D":
        options = ["Column 1", "Column 2", "Column 3"];
        break;
      case "E":
        options = ["1st Dozen", "2nd Dozen", "3rd Dozen"];
        break;
      case "F":
        options = ["1-6", "4-9", "7-12", "10-15", "13-18", "16-21", "19-24", "22-27", "25-30", "28-33", "31-36"];
        break;
      case "G":
        options = ["0,1,2,3","1,2,4,5","2,3,5,6","4,5,7,8","5,6,8,9","7,8,10,11","8,9,11,12","10,11,13,14","11,12,14,15","13,14,16,17","14,15,17,18","16,17,19,20","17,18,20,21","19,20,22,23","20,21,23,24","22,23,25,26","23,24,26,27","25,26,28,29","26,27,29,30","28,29,31,32","29,30,32,33","31,32,34,35","32,33,35,36"];
        break;
      case "H":
        options = ["1,2,3","4,5,6","7,8,9","10,11,12","13,14,15","16,17,18","19,20,21","22,23,24","25,26,27","28,29,30","31,32,33","34,35,36"];
        break;
      case "I":
        options = [
          "1-2", "1-4", "2-3", "2-5", "3-6", 
          "4-5", "4-7", "5-6", "5-8", "6-9", 
          "7-8", "7-10", "8-9", "8-11", "9-12", 
          "10-11", "10-13", "11-12", "11-14", "12-15", 
          "13-14", "13-16", "14-15", "14-17", "15-16", 
          "15-18", "16-17", "16-19", "17-18", "17-20", 
          "18-21", "19-20", "19-22", "20-21", "20-23", 
          "21-22", "21-24", "22-23", "22-25", "23-24", 
          "23-26", "24-25", "24-27", "25-26", "25-28", 
          "26-27", "26-29", "27-30", "28-29", "28-31", 
          "29-30", "29-32", "30-31", "30-33", "31-32", 
          "31-34", "32-33", "32-35", "33-34", "33-36", 
          "34-35", "35-36"
        ];
        break;
      case "J":
        options = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36"];
        break;
      default:
        options = [];
    }
    let newSecondDropdownOptions = [...secondDropdownOptions];
    newSecondDropdownOptions[index] = options;
    setSecondDropdownOptions(newSecondDropdownOptions);
    let vall = [...seconddropdown];
    vall[index] = options[0];
    setseconddropdown(vall);
    console.log(newSecondDropdownOptions)
    console.log(firstDropdown)
  };


  const handleSecondDropdownChange = (value, index) => {
    let val = [...seconddropdown];
    val[index] = value;
    setseconddropdown(val);
   
    console.log("help",seconddropdown,value)

  };

  function rot(n) {
    setNumber("Spinning")
    if (n==NaN)
      return
    let rott = [5, 142, 308, 26, 328, 180, 270, 63, 211, 103, 191, 230, 46, 249, 122, 347, 161, 288, 84, 338, 134, 319, 94, 201, 171, 300, 16, 261, 55, 74, 220, 113, 354, 151, 280, 36, 240];
    let k = Math.floor((Math.random() * 360));
    let r = 5 + ((k) / 360);
    let t = 10 + 0.25 + (((360 - rott[n]) / 360)) + r;
    console.log(r, t);
    setSpeed(`rotate 1s linear ${r} forwards`);
    setbSpeed(`rotate 0.5s linear  ${t} forwards`);
    setTimeout(() => {
      setDegree(k);
      setbDegree(k + 450 - rott[n]);
      setSpeed(`none`);
      setbSpeed(`none`);
      setNumber(n)
    }, 12000);
  }



  const addBetDiv = () => {
    setBetDivs([...betDivs, betDivs.length]);
    setFirstDropdown([...firstDropdown, "SELECT"]);
    setSecondDropdownOptions([...secondDropdownOptions, []]);
  };

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
 
    
    const socket = new WebSocket("ws://localhost:8080?subdomain=roulette");
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
      for (let i=0;i<isBetPlacedW.length;i++){
       t[i]=false
      }
      setIsBetPlacedW(t)

      
       
        setIsCrashed(false);
        
        setTimeout(() => {
         
          setIsCrashed(true);
         
        }, 5500);
      } else if (evennt.type === "game_start") {
        setGameId(evennt.gameid2);
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

  const handlePlaceBet = async (betAmountW,index) => {
    toast.loading("Placing bet...");
    if (betAmountW > 0) {
     
      console.log(`Bet placed: ${betAmountW}`);

      const res = await fetch("/api/roulette/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameid: gameId, betAmount: betAmountW, winbet: seconddropdown[index], type: firstDropdown[index] }),
      });
      const data = await res.json();
      console.log(data);
      if (data.message) {
        toast.dismiss();
        toast.success(data.message);
        setBalance((balance - betAmountW).toFixed(2));
        let valk = [...isBetPlacedW];
        valk[index] = true;
        setIsBetPlacedW(valk);
      } else {
        toast.dismiss();
        toast.error(data.message);
       
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
                  <img src="/roulettebanner.png" alt="Banner" className='banner' />

      <h1 className="highlights">Roulette</h1>
      <br></br>
      <div className="scores"> 
            Lucky Number: <span style={{color:"#e0ffe0"}}>{number}</span>
          </div>
      <div className="par1">
        <div className="canvas2" style={{ width: "100%", overflow: "hidden" }}>
          <div className="roulette" style={{ transform: `rotate(${degree}deg)`, animation: speed }}>
            <img src="/roulette.png" alt="back" />
          </div>
          <div className="ball" style={{ transform: `rotate(${bdegree - 2}deg)`, animation: bspeed }}>
            <img width={"15vw"} src="/ball.png" alt="ball" />
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
                {betDivs.map((div, index) => (
                  <div  className="Winning-Hand" key={index}>
                    <select
                    disabled={!isCrashed || isBetPlacedW[index]}
                      className="dropdown"
                      value={firstDropdown[index]}
                      onChange={(e) => handleFirstDropdownChange(e.target.value, index)}
                     
                      style={{ color: 'black', padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                      <option value="SELECT">Select Bet Type</option>
                      <option value="A">ODD/EVEN(2x)</option>
                      <option value="B">RED/BLACK(2x)</option>
                      <option value="C">18 NUMBERS(2x)</option>
                      <option value="D">COLUMN BET(3x)</option>
                      <option value="E">DOZENS(3x)</option>
                      <option value="F">SIX NUMBERS(4x)</option>
                      <option value="G">FOUR NUMBERS(8x)</option>
                      <option value="H">THREE NUMBERS(12x)</option>
                      <option value="I">DOUBLE NUMBERS(18x)</option>
                      <option value="J">SINGLE NUMBERS(36x)</option>
                    </select>
                    &nbsp;
                    <select
                      className="dropdown"
                      value={seconddropdown[index]}
                      onChange={(e) =>{handleSecondDropdownChange(e.target.value, index)}}
                      disabled={!isCrashed || isBetPlacedW[index]}
                      style={{ color: 'black', padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                      {secondDropdownOptions[index].map((option, idx) => (
                        <option key={idx} value={String(option)}>
                          {option}
                        </option>
                      ))}
                    </select>
                    &nbsp;
                    <input
                     disabled={!isCrashed || isBetPlacedW[index]}
                      type="number"
                      value={betAmountW}
                      onChange={(e) => {
                        
                        let ff=distance
                        ff[index]=Number(e.target.value)
                        setDistance(ff)}}
                      placeholder="Enter bet amount"
                      
                      style={{ color: 'black', padding: "8px",paddingLeft:0,paddingRight:0, borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    &nbsp;
                    <button
                      onClick={() => { handlePlaceBet(distance[index],index) }}
                      disabled={!isCrashed || isBetPlacedW[index]}
                    >
                      Place Bet
                    </button>
                    &nbsp;
                  </div>
                ))}
                <button onClick={addBetDiv} style={{ marginTop: "10px" }}>
                  +
                </button>
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
