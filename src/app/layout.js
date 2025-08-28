"use client"
import "./globals.css";
import { useState, useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';
import Loading from './loading.js'

export default function RootLayout({ children }) {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/background1.png';
    img.onload = () => setLoad(true);
  }, []);

  return (
    <html lang="en">
      
      <body className="antialiased">

        <div className="loading"style={{ display: !load ? 'block' : 'none' }}>
          <Loading/>
        </div>
        <div className="body"
         style={{ backgroundImage: `url(/background1.png)`, display: load ? 'block' : 'none' }}>
        <SessionProvider>
          <Toaster />
          {children}
        </SessionProvider>
        </div>
      </body>
    </html>
  );
}
