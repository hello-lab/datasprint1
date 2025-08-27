"use client"

import Image from "next/image";
import { toast,Toaster } from 'react-hot-toast';
import { useState } from 'react';
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] ">
      
      <main className="flex flex-col gap-8 items-center">
        <img
          src="/logo.png"
          alt="Next.js logo"
         
          
          style={{ width: '100%', height: 'auto',borderRadius:'5px' }}
          priorty="true"
        />
        <ol className="list-inside list-decimal text-sm text-center font-[family-name:var(--font-geist-mono)]">
          {/* ...existing code... */}
        </ol>

        <div className="">
          <form  className="flex flex-col gap-4 items-center " >
          <input type="text" style={{color:'black'}} className="rounded border border-solid border-gray-300 p-2 mb-4" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            
          <input type="password" style={{color:'black'}}  className="rounded border border-solid border-gray-300 p-2 mb-4" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-4">
              <button
                onClick={ handleLogin}
                style={{color:'black'}}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                🙏
                Login
              </button>
              <button
                
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                onClick={handleSignup}
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
