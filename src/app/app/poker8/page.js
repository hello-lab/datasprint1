"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [winbetW, setwinbetW] = useState(0);
  const [betAmountW, setbetAmountW] = useState();
  const [isBetPlacedW, setIsBetPlacedW] = useState(false);

  const [winbetF, setwinbetF] = useState(0);
  const [betAmountF, setbetAmountF] = useState();
  const [isBetPlacedF, setIsBetPlacedF] = useState(false);

  const [winbetS, setwinbetS] = useState(0);
  const [betAmountS, setbetAmountS] = useState();
  const [isBetPlacedS, setIsBetPlacedS] = useState(false);

  const [winbetSF, setwinbetSF] = useState(0);
  const [betAmountSF, setbetAmountSF] = useState();
  const [isBetPlacedSF, setIsBetPlacedSF] = useState(false);

  const [isCrashed, setIsCrashed] = useState(true);
  
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [cards, setCards] = useState([]);
  const [winningHand, setWinningHand] = useState(2);
  const [isFlush, setIsFlush] = useState([]);
  const [isStraight, setIsStraight] = useState([]);
  const [isStraightFlush, setIsStraightFlush] = useState([]);
  const [faceCardsCount, setFaceCardsCount] = useState([]);
  const [flipped, setFlipped] = useState(false);

  function handleclik(value, a) {
    if (a == "W") setwinbetW(value);
    else if(a == "F") setwinbetF(value);
    else if(a == "S") setwinbetS(value);
    else if(a == "SF") setwinbetSF(value);
    
  }

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
    setCards([
      ["back.png", "back.png", "back.png"],
      ["back.png", "back.png", "back.png"],
      ["back.png", "back.png", "back.png"]
    ]);
    
    const socket = new WebSocket("ws://localhost:8080?subdomain=poker8");
    setSocket(socket);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
    
      const newMessage = event.data;
      let evennt = JSON.parse(event.data);
      console.log(evennt.type);
      if (evennt.type === "deal") {
        setIsBetPlacedW(false);
        setIsBetPlacedF(false);
        setIsBetPlacedS(false);
        setIsBetPlacedSF(false);
        console.log(evennt);
       
        setIsCrashed(false);
        setCards(evennt.hands); // Update the cards state with the received cards
        setWinningHand(evennt.winningHand);
        setIsFlush(evennt.isFlush);
        setIsStraight(evennt.isStraight);
        setIsStraightFlush(evennt.isStraightFlush);
        setFaceCardsCount(evennt.faceCardsCount);
        setFlipped(true);
        setTimeout(() => {
          setwinbetW("");
            setwinbetF("");
            setwinbetS("");
            setwinbetSF("");
          setIsCrashed(true);
          setFlipped(false);
          console.log(cards);
          setTimeout(
            () =>
              setCards([
                ["back.png", "back.png", "back.png"],
                ["back.png", "back.png", "back.png"],
                ["back.png", "back.png", "back.png"]
              ]),
            0
          );
          console.log(cards);
          setWinningHand(2);
          setIsFlush(evennt.isFlush);
          setIsStraight(evennt.isStraight);
          setIsStraightFlush(evennt.isStraightFlush);
          setFaceCardsCount(evennt.faceCardsCount);
        }, 5000);
      } else if (evennt.type === "game_tick") {
        setSpeed(evennt.multiplier);
        setIsCrashed(false);
        console.log(evennt.multiplier);
      } else if (evennt.type === "game_start") {
        setGameId(evennt.gameid);
        console.log(`Game started with ID: ${evennt.gameid}`);
      } else if (evennt.type === "balance") {
        console.log("Cashout");
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

  const handlePlaceBetW = async () => {
    toast.loading("Placing bet...");
    if (betAmountW > 0) {
      setIsBetPlacedW(true);
      console.log(`Bet placed: ${betAmountW}`);

      const res = await fetch("/api/poker8/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameid: gameId, betAmount:betAmountW, winbet: winbetW, type: "W" }),
      });
      const data = await res.json();
      console.log(data);
      if (data.message) {
        toast.dismiss();
        toast.success(data.message);
        setBalance(balance - betAmountW);
      } else {
        toast.dismiss();
        toast.error(data.message);
        setIsBetPlacedW(false);
      }
    }
  };



  const handlePlaceBetS = async () => {
    toast.loading("Placing bet...");
    if (betAmountS > 0) {
      setIsBetPlacedS(true);
      console.log(`Bet placed: ${betAmountW}`);

      const res = await fetch("/api/poker1/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameid: gameId, betAmount:betAmountS, winbet:winbetS, type: "S" }),
      });
      const data = await res.json();
      console.log(data);
      if (data.message) {
        toast.dismiss();
        toast.success(data.message);
        setBalance(balance - betAmountW);
      } else {
        toast.dismiss();
        toast.error(data.message);
        setIsBetPlacedW(false);
      }
    }
  };



  const handlePlaceBetF = async () => {
    toast.loading("Placing bet...");
    if (betAmountF > 0) {
      setIsBetPlacedF(true);
      console.log(`Bet placed: ${betAmountF}`);

      const res = await fetch("/api/poker8/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameid: gameId, betAmount:betAmountF,  winbet:winbetF, type: "F" }),
      });
      const data = await res.json();
      console.log(data);
      if (data.message) {
        toast.dismiss();
        toast.success(data.message);
        setBalance(balance - betAmountW);
      } else {
        toast.dismiss();
        toast.error(data.message);
        setIsBetPlacedW(false);
      }
    }
  };





  const handlePlaceBetSF = async () => {
    toast.loading("Placing bet...");
    if (betAmountSF> 0) {
      setIsBetPlacedSF(true);
      console.log(`Bet placed: ${betAmountSF}`);

      const res = await fetch("/api/poker1/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameid: gameId, betAmount:betAmountSF, winbet:winbetSF, type: "SF" }),
      });
      const data = await res.json();
      console.log(data);
      if (data.message) {
        toast.dismiss();
        toast.success(data.message);
        setBalance(balance - betAmountW);
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
      <h1 className="highlights">3 CARDS POKER</h1>
      <br></br>
      <div className="par1">
        <div className="canvas1" style={{ width: "100%", overflow: "hidden" }}>
          {cards.length === 0 ? (
            <div className="placeholder">
              <p>Waiting for cards...</p>
            </div>
          ) : (
            cards.map((hand, handIndex) => (
              <div key={handIndex} className="hand">
                <p className="player">{["DRAGON", "TIGER  ","LION  "][handIndex]}</p>
                {hand.map((card, cardIndex) => (
                  <div
                    key={cardIndex}
                    className={`card ${flipped ? "flipped" : ""}`}
                  >
                    <Image
                      src={`/cards/${card}`}
                      alt={`Card ${card}`}
                      width={100}
                      height={150}
                    />
                  </div>
                ))}
                <div className="hand-info" hidden>
                  <p>Flush: {isFlush[handIndex] ? "Yes" : "No"}</p>
                  <p>Straight: {isStraight[handIndex] ? "Yes" : "No"}</p>
                  <p>
                    Straight Flush: {isStraightFlush[handIndex] ? "Yes" : "No"}
                  </p>
                  <p>Face Cards Count: {faceCardsCount[handIndex]}</p>
                </div>
              </div>
            ))
          )}

          <div className="winning-hand">
            <h2>Winning Hand:</h2>
            {["DRAGON", "TIGER", "Betting Stage","LION"][winningHand]}
          </div>
        </div>

        <br></br>
        <p style={{ color: "black", fontSize: "larger", fontWeight: "bold" }}>
          Account Balance: Rs {balance}
        </p>
        <br></br>
        <div>
          <div className="Winning-Hand ">
            <div>Winning Hand: 2x</div>

            <div className="probablity">
              <p
                className={` ${winbetW == "A" ? "active" : "inactive"}`}
                onClick={() => handleclik("A", "W")}
              >
                DRAGON
              </p>
              <p
                className={` ${winbetW == "B" ? "active" : "inactive"}`}
                onClick={() => handleclik("B", "W")}
              >
                TIGER
              </p>
              <p
                className={` ${winbetW == "C" ? "active" : "inactive"}`}
                onClick={() => handleclik("C", "W")}
              >
                LION
              </p>
              <div className="bet-controls">
                <div>
                  <input
                    style={{ color: "black" }}
                    type="number"
                    value={betAmountW}
                    onChange={(e) => setbetAmountW(Number(e.target.value))}
                    placeholder="Enter bet amount"
                    disabled={!isCrashed}
                  />
                  &nbsp;
                  <button
                    onClick={handlePlaceBetW}
                    disabled={!isCrashed || isBetPlacedW}
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
          <br></br>
          <br></br>
         
        </div>
      </div>
    </div>
  );
};

export default HomePage;
