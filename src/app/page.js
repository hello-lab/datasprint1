"use client"

import Image from "next/image";
import { toast,Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Silk from './Silk';


export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    toast.loading('Waiting...');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username:username, password: password }),
    });

    const data = await res.json();
    toast.dismiss()
    console.log(data)
    try{
      data=='User Created' ? toast.success('User created successfully') : toast.error('User Exists');
    }
    catch(e){toast.error(e)}
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    toast.loading('Waiting...');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username:username, password: password }),
    });

    

    const data = await res.json();
    toast.dismiss()
    if (data.message=='Login successful'){
      toast.success('Login successful');
      window.location.href = '/app/home'
    }
    else{
      toast.error(data.message);
  };}

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-0 sm:p-2 font-[family-name:var(--font-geist-sans)]" style={{ backgroundColor: '#fff1c4ff' }}>
      {/* Silk background absolutely positioned */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100vw', height: '100vh', pointerEvents: 'none', filter: 'blur(12px)', WebkitFilter: 'blur(12px)' }}>
        <Silk speed={5} scale={1} color="#006effff" noiseIntensity={1.5} rotation={0} />
      </div>
      {/* Content above Silk */}
  <main
    className="flex flex-col gap-8 items-center"
    style={{
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      position: 'relative',
      zIndex: 1,
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.15), 8px 8px 12px 0 rgba(0,0,0,0.25)', // small black shadow bottom right
    }}
  >
        <img
          src="/logo.png"
          alt="Next.js logo"
          style={{
            width: '70%',
            height: 'auto',
            borderRadius: '24px',
            background: 'white',
            boxShadow: '0 0 48px 24px rgba(255,255,255,0.5), 0 0 0 12px white', // softer fading white shadow
          }}
          priority="true"
        />
        <ol className="list-inside list-decimal text-sm text-center font-[family-name:var(--font-geist-mono)]">
          {/* ...existing code... */}
        </ol>

        <div className="">
          <form className="flex flex-col gap-4 items-center ">
            <input
              type="text"
              style={{ color: 'black' }}
              className="rounded border border-solid border-gray-300 p-2 mb-4"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              style={{ color: 'black' }}
              className="rounded border border-solid border-gray-300 p-2 mb-4"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-4">
              <button
                onClick={handleLogin}
                style={{ color: 'black' }}
                className="rounded-full border border-solid border-solid transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                🙏
                Login
              </button>
              <button
                className="rounded-full border border-solid border-solid transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={handleSignup}
                style={{ color: 'black' }}
              >
                👋Sign UP
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
