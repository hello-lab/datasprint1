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
            
                <nav className={` navbar  ${menuOpen ? 'open' : ''}`} style={{ alignItems: 'center', width: '100%', padding: '1px', justifyContent: 'center' }}>
                    <div className="menu-wrap">
                        <div className="full-wrap">
                            <ul className="tab-menu flex list-none p-1">
                                <li className={` first ver-menu ${activeLink === '/app/home' ? 'active' : ''} ${menuOpen ? 'open' : ''}`} onClick={() => handleLinkClick('/app/home')}>
                                    <a className="navbar-item hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                        </svg>
                                        Home
                                    </a>
                                </li>
                                <li className={`ver-menu ${activeLink === '/app/tips' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/tips')}>
                                    <a className="navbar-item hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                                            strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path d="M15 21H9V12.6C9 12.2686 9.26863 12 9.6 12H14.4C14.7314 12 15 12.2686 15 12.6V21Z" 
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20.4 21H15V18.1C15 17.7686 15.2686 17.5 15.6 17.5H20.4C20.7314 17.5 21 17.7686 21 18.1V20.4C21 20.7314 20.7314 21 20.4 21Z" 
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 21V16.1C9 15.7686 8.73137 15.5 8.4 15.5H3.6C3.26863 15.5 3 15.7686 3 16.1V20.4C3 20.7314 3.26863 21 3.6 21H9Z" 
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10.8056 5.11325L11.7147 3.1856C11.8314 2.93813 12.1686 2.93813 12.2853 3.1856L13.1944 5.11325L15.2275 5.42427C15.4884 5.46418 15.5923 5.79977 15.4035 5.99229L13.9326 7.4917L14.2797 9.60999C14.3243 9.88202 14.0515 10.0895 13.8181 9.96099L12 8.96031L10.1819 9.96099C9.94851 10.0895 9.67568 9.88202 9.72026 9.60999L10.0674 7.4917L8.59651 5.99229C8.40766 5.79977 8.51163 5.46418 8.77248 5.42427L10.8056 5.11325Z" 
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                        Leaderboard
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
                                <li><button onClick={async () => {
               
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = '/'; // Redirect to login page after logout
            }} style={{ marginTop: '20px', padding: '10px 20px', fontSize: 'large' }}>
                Logout
            </button></li>
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
