"use client"

import Image from "next/image";
import { toast,Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Silk from './Silk';


export default function Home() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [team, setTeam] = useState('');
  const handleSignup = async (e) => {
    e.preventDefault();
    toast.loading('Waiting...');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username:username, password: password,team }),
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
      body: JSON.stringify({ username:username, password: password}),
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
  <Silk speed={5} scale={1} color="#00cfff" noiseIntensity={2.5} rotation={0} />
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
    <div>
    
    <div className="w-full p-8 sm:p-4 flex flex-col gap-8 items-center">
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
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setMode('login')}
              style={{
                color: mode === 'login' ? '#fff' : '#1976d2',
                background: mode === 'login' ? '#1976d2' : '#fff',
                fontWeight: mode === 'login' ? 700 : 500,
                border: '2px solid #1976d2',
                borderRadius: 8,
                padding: '8px 24px',
                boxShadow: mode === 'login' ? '0 2px 8px #1976d2' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              style={{
                color: mode === 'signup' ? '#fff' : '#1976d2',
                background: mode === 'signup' ? '#1976d2' : '#fff',
                fontWeight: mode === 'signup' ? 700 : 500,
                border: '2px solid #1976d2',
                borderRadius: 8,
                padding: '8px 24px',
                boxShadow: mode === 'signup' ? '0 2px 8px #1976d2' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Sign Up
            </button>
          </div>
          <form className="flex flex-col gap-4 items-center ">
            <input
              type="text"
              style={{ color: 'black' }}
              className="rounded border border-solid border-gray-300 p-2 mb-4"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            {mode === 'signup' && (
              <input
                type="text"
                style={{ color: 'black' }}
                className="rounded border border-solid border-gray-300 p-2 mb-4"
                placeholder="Department"
                onChange={(e) => setTeam(e.target.value)}
              />
            )}
            <input
              type="password"
              style={{ color: 'black' }}
              className="rounded border border-solid border-gray-300 p-2 mb-4"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={mode === 'login' ? handleLogin : handleSignup}
              style={{
                color: '#fff',
                background: '#1976d2',
                fontWeight: 700,
                border: '2px solid #1976d2',
                borderRadius: 8,
                padding: '10px 32px',
                fontSize: '1.1em',
                marginTop: 8,
                boxShadow: '0 2px 8px #1976d2',
                transition: 'all 0.2s',
              }}
            >
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
</div>
</div>

      </main>
    </div>
  );
}
