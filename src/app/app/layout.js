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
        <div style={{ padding: '20px', maxHeight: '100vh', overflowY: 'none' }}>
            <header className="" style={{ fontWeight:"bold",display: 'flex',  marginBottom: '20px' }}>
                <img className="logo" src="/longlogo.png" alt="Logo" style={{ borderRadius:'1vh', maxWidth:'200px', maxHeight:'100px', marginRight: '0px'  }} />
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
                                <li className={`ver-menu ${activeLink === '/app/leaderboard' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/leaderboard')}>
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
                                <li className={`ver-menu ${activeLink === '/app/googlefit' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/googlefit')}>
                                    <a className="navbar-item hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.871 407.871" fill="white" className="size-6">
                                        <g>
                                            <path d="M353.613,151.529l-10.036-19.16c-1.534-2.918-5.126-4.046-8.055-2.518l-49.561,25.944l-25.95-49.561
                                            c-0.734-1.402-1.999-2.458-3.509-2.93c-0.782-0.245-1.593-0.322-2.393-0.239l-0.871-0.263
                                            c18.849-8.348,32.048-27.197,32.048-49.101C285.286,24.094,261.198,0,231.584,0s-53.702,24.094-53.702,53.702
                                            c0,10.782,3.222,20.818,8.718,29.244l-5.096-1.522c-1.104-0.764-2.423-1.164-3.92-1.05l-0.042,0.006
                                            c-0.656-0.066-1.313,0.006-1.939,0.167l-81.251,7.071c-3.282,0.286-5.71,3.18-5.424,6.462l7.244,83.22
                                            c0.131,1.575,0.889,3.031,2.106,4.051c1.211,1.014,2.739,1.516,4.356,1.372l21.546-1.874c3.282-0.286,5.71-3.18,5.424-6.462
                                            l-4.845-55.725l36.481-3.174l-46.034,115.704c-0.268,0.662-0.406,1.366-0.424,2.076l-1.408,65.761H59.547
                                            c-3.3,0-5.967,2.667-5.967,5.967v35.055c0,3.3,2.667,5.967,5.967,5.967h98.453c3.3,0,5.967-2.667,5.967-5.967v-81.824
                                            L276.234,405.52c1.169,1.539,2.948,2.351,4.75,2.351c1.259,0,2.53-0.394,3.61-1.223l30.849-23.509
                                            c1.259-0.955,2.082-2.375,2.297-3.944c0.209-1.569-0.209-3.156-1.17-4.415l-105.9-138.944l35.515-83.667l22.847,43.642
                                            c1.533,2.918,5.126,4.052,8.055,2.518l74.007-38.749c1.402-0.734,2.452-1.993,2.924-3.503
                                            C354.49,154.566,354.347,152.931,353.613,151.529z"/>
                                        </g>
                                        </svg>
                                        stats
                                    </a>
                                </li>
                                <li className={`ver-menu ${activeLink === '/app/exercise' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/exercise')}>
                                    <a className="navbar-item hover:underline">
                                        <svg viewBox="0 0 94.5 94.5" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                                            <g fill="white">
                                                <path d="M7.276,64.894c0.783,1.856,2.596,3.055,4.619,3.055c0.666,0,1.316-0.131,1.932-0.391L41.164,56.03 
                                                c0.321-0.135,0.62-0.301,0.896-0.492c0.247-0.037,0.491-0.093,0.725-0.191l23.384-9.861l8.864,21.018 
                                                c0.469,1.114,1.557,1.834,2.77,1.834c0.4,0,0.791-0.079,1.16-0.235l2.072-0.874c0.737-0.31,1.309-0.891,1.611-1.635 
                                                c0.303-0.744,0.298-1.559-0.012-2.295L72.141,38.417l-0.001-0.001l-2.017-4.783c-0.469-1.114-1.557-1.834-2.77-1.834 
                                                c-0.4,0-0.791,0.079-1.16,0.235L37.972,43.934c-1.21,0.511-1.898,1.728-1.814,2.971L9.804,58.019 
                                                c-1.227,0.517-2.18,1.484-2.685,2.725s-0.497,2.599,0.02,3.825L7.276,64.894z"/>
                                                <path d="M83.695,41.547c1.358,0,2.686-0.27,3.947-0.801c2.503-1.056,4.445-3.022,5.468-5.539c1.023-2.516,1.006-5.28-0.05-7.783 
                                                c-1.594-3.778-5.273-6.219-9.375-6.219c-1.358,0-2.686,0.269-3.947,0.801c-5.167,2.179-7.597,8.155-5.418,13.322 
                                                C75.914,39.106,79.594,41.547,83.695,41.547z"/>
                                                <path d="M92.5,69.295H2c-1.104,0-2,0.896-2,2s0.896,2,2,2h90.5c1.104,0,2-0.896,2-2S93.604,69.295,92.5,69.295z"/>
                                            </g>
                                            </svg>


                                        exercise
                                    </a>
                                </li>
                                <li className={`ver-menu ${activeLink === '/app/steppe' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/steppe')}>
                                    <a className="navbar-item hover:underline">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6">
                                            <g stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 3H11V1H13V3H12C7.6 3 4 6.6 4 11C4 13.2 4.9 15.2 6.4 16.6L5.5 20L10 18.5C10.6 18.7 11.3 18.8 12 18.8C16.4 18.8 20 15.2 20 11C20 6.6 16.4 3 12 3Z"/>
                                                <circle cx="12" cy="10" r="2"/>
                                                <path d="M9 14C10.5 15.5 13.5 15.5 15 14"/>
                                            </g>
                                        </svg>
                                        steppe
                                    </a>
                                </li>
                                <li className={`ver-menu ${activeLink === '/app/socials' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/socials')}>
                                    <a className="navbar-item hover:underline">
                                        <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      opacity="0.5"
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
      fill="#ffffff"
    />
    <path
      d="M7.5 11.1093C7.5 12.4777 8.81884 13.9135 10.0286 14.9426C10.8524 15.6435 11.2644 15.9939 12 15.9939C12.7356 15.9939 13.1476 15.6435 13.9714 14.9426C15.1812 13.9135 16.5 12.4777 16.5 11.1093C16.5 8.43212 14.0249 7.4326 12 9.50069C9.97507 7.4326 7.5 8.43212 7.5 11.1093Z"
      fill="#ffffff"
    />
  </svg>
                                        steppe
                                    </a>
                                </li>
                                
                                <li className={`ver-menu ${activeLink === '/app/market' ? 'active' : ''}`} onClick={() => handleLinkClick('/app/market')}>
                                    <a className="navbar-item hover:underline">
                                        <img src="/market.svg"  width="28" height="28" className="size-6 filter-white"/>
                                        Market
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
            <div style={{ display: 'flex', minHeight: '79vh' }}>
                <div style={{borderRadius:'2vh', boxShadow:" 0 0 20px 3px #ff00ff", width: '100%', backgroundColor: '#f0f0f0', padding: '10px' }}>
                    <Suspense fallback={<Loading/>}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
