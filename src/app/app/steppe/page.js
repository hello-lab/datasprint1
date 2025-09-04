"use client";
import React, { useState } from "react";

const GeminiChatbot = () => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hey there! I'm Steppe, your personal fitness assistant and corporate wellness coach! 🏃‍♂️ Ask me anything about workplace wellness, team challenges, or fitness motivation!" },
    ]);
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Fetch real Gemini response from backend API
    const getGeminiResponse = async (userMessage) => {
        try {
            // Get user data from localStorage
            const userData = localStorage.getItem('user');
            const user = userData ? JSON.parse(userData) : null;
            
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage,
                    userName: user?.username || 'Guest',
                    team: user?.team || 'Unknown'
                })
            });
            const data = await res.json();
            
            // Store suggestions if available
            if (data.suggestions) {
                setSuggestions(data.suggestions);
            }
            
            return data.reply || 'No response.';
        } catch (err) {
            return 'Error fetching Gemini response.';
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        const botReplyText = await getGeminiResponse(input);
        const botMessage = { sender: "bot", text: botReplyText };
        setMessages((prev) => [...prev, botMessage]);

        setInput("");
    };

    return (
        <div style={{ width:"100%", margin: "0", fontFamily: "sans-serif", overflow:"none"}}>
            <div
                style={{
                    border: "1px solid #3871f5ff",
                    borderRadius: 8,
                    padding: 16,
                    height: "67vh",
                    overflowY: "auto",
                    background: "#fafafa",
                    marginBottom: 16,
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            textAlign: msg.sender === "user" ? "right" : "left",
                            margin: "8px 0",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "8px 12px",
                                borderRadius: 16,
                                background: msg.sender === "user" ? "#3871f5ff" : "#7738f5ff",
                            }}
                        >
                            {msg.text}
                        </span>
                    </div>
                ))}
                
                {/* Smart Suggestions */}
                {suggestions.length > 0 && (
                    <div style={{ 
                        margin: "16px 0",
                        padding: "12px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: 8,
                        border: "1px solid #e9ecef"
                    }}>
                        <div style={{ 
                            fontSize: "14px", 
                            fontWeight: "bold", 
                            marginBottom: "8px",
                            color: "#6c757d"
                        }}>
                            💡 Smart Suggestions
                        </div>
                        {suggestions.map((suggestion, idx) => (
                            <div key={idx} style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "6px 8px",
                                margin: "4px 0",
                                backgroundColor: "white",
                                borderRadius: 6,
                                cursor: "pointer",
                                border: "1px solid #dee2e6"
                            }}
                            onClick={() => {
                                setInput(suggestion.text);
                            }}>
                                <span style={{ marginRight: "8px", fontSize: "16px" }}>
                                    {suggestion.icon}
                                </span>
                                <div>
                                    <div style={{ 
                                        fontWeight: "bold", 
                                        fontSize: "12px",
                                        color: "#495057"
                                    }}>
                                        {suggestion.title}
                                    </div>
                                    <div style={{ 
                                        fontSize: "11px",
                                        color: "#6c757d"
                                    }}>
                                        {suggestion.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <form
                onSubmit={handleSend}
                style={{
                    display: "flex",
                    gap: 8,
                    position: "fixed",
                    bottom: "3.5vh",
                    width: "96vw",
                    translate: "none",
                    padding: "12px 0px",
                    //marginBottom: "50px",
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{ 
                        flex: 1, 
                        color:"black",
                        padding: 8, 
                        borderRadius: 8, 
                        height: "7vh",
                        border: "1px solid #ccc",
                        boxShadow: "0 0 12px 2px #3871f5aa",
                    }}
                />
                <button type="submit" style={{
                    padding: "8px 16px",
                    borderRadius: 8 ,
                    border: "1px solid blue",
                    backgroundColor: "#3871f5ff",
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
     strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path d="M16.1391 2.95907L7.10914 5.95907C1.03914 7.98907 1.03914 11.2991 7.10914 13.3191L9.78914 14.2091L10.6791 16.8891C12.6991 22.9591 16.0191 22.9591 18.0391 16.8891L21.0491 7.86907C22.3891 3.81907 20.1891 1.60907 16.1391 2.95907Z" 
        strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M16.4591 8.33907L12.6591 12.1591C12.5091 12.3091 12.3191 12.3791 12.1291 12.3791C11.9391 12.3791 11.7491 12.3091 11.5991 12.1591C11.3091 11.8691 11.3091 11.3891 11.5991 11.0991L15.3991 7.27907C15.6891 6.98907 16.1691 6.98907 16.4591 7.27907C16.7491 7.56907 16.7491 8.04907 16.4591 8.33907Z" 
        strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                </button>
            </form>
        </div>
    );
};

export default GeminiChatbot;