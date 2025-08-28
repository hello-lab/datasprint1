"use client"
import "./globals.css";
import { useState, useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';
import Loading from './loading.js'

export default function RootLayout({ children }) {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const img = new Image();
   // img.src = '/background1.png';
    img.onload = () => setLoad(true);
  }, []);

  return (
    <html lang="en">
      
      <body className="antialiased">

        <div className="loading"style={{ display: !load ? 'block' : 'none' }}>
          <Loading/>
        </div>
        <div className="body"
         style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: load ? 'block' : 'none' }}>
        <SessionProvider>
          <Toaster />
          {children}
        </SessionProvider>
        </div>
      </body>
    </html>
  );
}
