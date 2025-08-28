"use client"
import "./../globals.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Loading from './loading'
import { Suspense } from 'react'
import Cookies from 'js-cookie';

export default function RootLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setActiveLink(router.pathname);
        const token = Cookies.get('token');
        setIsLoggedIn(!!token);
    }, [router.pathname]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = (href) => {
        setActiveLink(href);
        setTimeout(() => {setActiveLink('');}, 100);
        setMenuOpen(!menuOpen);
        router.push(href);
    };

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ fontWeight:"bold",display: 'flex', marginBottom: '20px' }}>
                <img className="logo" src="/longlogo.png" alt="Logo" style={{ borderRadius:'1vh', marginRight: '10px' }} />
                <button style={{borderRadius:'0.5vh'}} className="hamburger-menu" onClick={toggleMenu}>
                    <span className="hamburger-icon"></span>
                </button>
            
                <nav className={` navbar ${menuOpen ? 'open' : ''}`} style={{ alignItems: 'center', width: '100%', padding: '1px', justifyContent: 'center' }}>
                    <div className="menu-wrap">
                        <div className="full-wrap">
                            <ul className="tab-menu flex list-none p-1">
                                <li className={` first ver-menu ${activeLink === '/app/home' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/home')}>
                                    <a className="navbar-item hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                        </svg>
                                        Home
                                    </a>
                                </li>
                                <li className={`ver-menu ${activeLink === '/app/tips' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/tips')}>
                                    <a className="navbar-item hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                        </svg>
                                        News & Blog
                                    </a>
                                </li>
                                <li className={`ver-menu ${activeLink === '/app/cricket' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/cricket')}>
                                    <a className="navbar-item hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                        </svg>
                                        Products
                                    </a>
                                </li>
                                <li className={`ver-menu ${activeLink === '/app/soccer' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/soccer')}>
                                    <a className="navbar-item hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                                        </svg>
                                        Services
                                    </a>
                                </li>
                                <li className={`last ver-menu ${activeLink === '/app/profile' ? 'active' : ''}`} >
                                    {isLoggedIn ? (
                                        <a className="navbar-item hover:underline" onClick={() => handleLinkClick('/app/profile')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                                <path  d="M0 0h24v24H0z" fill="none"/>
                                                <path fill="currentColor" d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            Profile
                                        </a>
                                    ) : (
                                        <a className="navbar-item hover:underline" onClick={() => handleLinkClick('/')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                                <path  d="M0 0h24v24H0z" fill="none"/>
                                                <path fill="currentColor" d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            Login
                                        </a>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <div style={{borderRadius:'2vh', boxShadow:" 0 0 20px 3px #ff00ff", width: '100%', backgroundColor: '#f0f0f0', padding: '10px' }}>
                    <Suspense fallback={<Loading/>}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
