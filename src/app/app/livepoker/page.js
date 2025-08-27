'use client'
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react'
const HomePage = () => {
  
    const [activeIndex, setActiveIndex] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSport, setSelectedSport] = useState('Cricket');
    const [casinoMenu, setCasinoMenu] = useState([]);
    const [casinoLobby, setCasinoLobby] = useState( [
        {
          "eventId": "99.0010",
          "eventName": "TEENPATTI",
          "menuId": "2",
          "menuName": "Teen Patti",
          "url": "/poker.jpg",
          "link": "/app/poker1",
          "popular": true,
          "sequence": 1,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "88.0022",
          "eventName": "VIMAAN",
          "menuId": "16",
          "menuName": "Virtual",
          "url": "/vimaan.jpg",
          "link": "/app/crash",
          "popular": true,
          "sequence": 2,
          "companyName": "UNIVERSE",
          "room": "virtual"
        },
        {
          "eventId": "99.0001",
          "eventName": "BACCARAT",
          "menuId": "5",
          "menuName": "Baccarat",
          "url": "/baccarat.jpg",
          "link": "/app/poker4",
          "popular": true,
          "sequence": 4,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0019",
          "eventName": "20-20 DRAGON TIGER",
          "menuId": "4",
          "menuName": "Dragon Tiger",
          "url": "/dragon1.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 5,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0030",
          "eventName": "LUCKY 7 - A",
          "menuId": "3",
          "menuName": "Lucky 7",
          "url": "http:///api/users/images/LUCKY7-A.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 5,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0025",
          "eventName": "ANDAR BAHAR - A",
          "menuId": "9",
          "menuName": "Andar Bahar",
          "url": "http:///api/users/images/AndarBahar2-min-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 5,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0022",
          "eventName": "32 CARDS - A",
          "menuId": "20",
          "menuName": "Other",
          "url": "/poker7.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 6,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0007",
          "eventName": "20-20 POKER -  A",
          "menuId": "10",
          "menuName": "Poker",
          "url": "http:///api/users/images/poker-min (1).png",
          "link": "/app/home",
          "popular": true,
          "sequence": 7,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0002",
          "eventName": "BACCARAT SUPER 6",
          "menuId": "5",
          "menuName": "Baccarat",
          "url": "/poker4.png",
          "link": "/app/poker5",
          "popular": true,
          "sequence": 8,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0013",
          "eventName": "1 DAY TEEN PATTI",
          "menuId": "2",
          "menuName": "Teen Patti",
          "url": "/poker5.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 9,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0018",
          "eventName": "DRAGON TIGER",
          "menuId": "4",
          "menuName": "Dragon Tiger",
          "url": "http:///api/users/images/Dragon-Tiger-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 10,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0032",
          "eventName": "FAST LUCKY - 7",
          "menuId": "3",
          "menuName": "Lucky 7",
          "url": "http:///api/users/images/Fast lucky7-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 11,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0021",
          "eventName": "1 DAY DRAGON TIGER",
          "menuId": "20",
          "menuName": "Other",
          "url": "/dragon.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 12,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0014",
          "eventName": "MUFLIS TEEN PATTI",
          "menuId": "2",
          "menuName": "Teen Patti",
          "url": "/poker3.jpg",
          "link": "/app/poker3",
          "popular": true,
          "sequence": 14,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0041",
          "eventName": "DTL - A",
          "menuId": "4",
          "menuName": "Dragon Tiger",
          "url": "http:///api/users/images/DTL-01 3-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 15,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0020",
          "eventName": "FAST DRAGON TIGER",
          "menuId": "4",
          "menuName": "Dragon Tiger",
          "url": "http:///api/users/images/Fast Dragon-Tiger-min-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 16,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0027",
          "eventName": "CASINO WAR",
          "menuId": "20",
          "menuName": "Other",
          "url": "/poker9.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 17,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        
        {
          "eventId": "99.0056",
          "eventName": "32 CARD BACCARAT",
          "menuId": "5",
          "menuName": "Baccarat",
          "url": "/poker6.jpg",
          "link": "/app/poker6",
          "popular": true,
          "sequence": 20,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        
        {
          "eventId": "99.0015",
          "eventName": "POINT TEEN PATTI",
          "menuId": "20",
          "menuName": "teen patti",
          "url": "/poker13.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 21,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0016",
          "eventName": "JOKER TEEN PATTI",
          "menuId": "20",
          "menuName": "Other",
          "url": "/joker.jpg",
          "link": "/app/poker2",
          "popular": true,
          "sequence": 21,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "88.0021",
          "eventName": "HEADS & TAILS",
          "menuId": "16",
          "menuName": "Virtual",
          "url": "/coin.jpg",
          "link": "/app/toss",
          "popular": true,
          "sequence": 21,
          "companyName": "UNIVERSE",
          "room": "virtual"
        },
        {
          "eventId": "88.0020",
          "eventName": " ROULETTE",
          "menuId": "16",
          "menuName": "Virtual",
          "url": "/roulette1.png",
          "link": "/app/roulette",
          "popular": true,
          "sequence": 21,
          "companyName": "UNIVERSE",
          "room": "virtual"
        },
        {
          "eventId": "88.0019",
          "eventName": "LUCKY 0 TO 9",
          "menuId": "16",
          "menuName": "Virtual",
          "url": "/0-9.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 21,
          "companyName": "UNIVERSE",
          "room": "virtual"
        },
        {
          "eventId": "10238658846815",
          "eventName": "BETGAMES CASINO",
          "menuId": "10",
          "menuName": "Poker",
          "url": "https://universe-studio.s3.ap-south-1.amazonaws.com/abevolution+gaming-3-min.png",
          "link": "https://pi.njoybingo.com/game.do?token={$token}&pn=t20exchange&lang=en&game=BGAMES-betgames&type=CHARGED",
          "popular": true,
          "sequence": 22,
          "companyName": "INTERNATIONAL",
          "room": "asian"
        },
        {
          "eventId": "10238658846812",
          "eventName": "TVBET",
          "menuId": "10",
          "menuName": "Poker",
          "url": "https://universe-studio.s3.ap-south-1.amazonaws.com/abevolution+gaming-2-min.png",
          "link": "https://pi.njoybingo.com/game.do?token={$token}&pn=t20exchange&lang=en&game=TVBET-lobby&type=CHARGED",
          "popular": true,
          "sequence": 22,
          "companyName": "INTERNATIONAL",
          "room": "asian"
        },
        {
          "eventId": "99.0005",
          "eventName": "AMAR AKBAR ANTHONY",
          "menuId": "15",
          "menuName": "Bollywood",
          "url": "http:///api/users/images/amar_akbar_anthony-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 23,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0040",
          "eventName": "3 CARD JUDGEMENT - A",
          "menuId": "20",
          "menuName": "Other",
          "url": "/poker10.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 24,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0051",
          "eventName": "1 CARD METER",
          "menuId": "20",
          "menuName": "Other",
          "url": "/poker16.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 25,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0057",
          "eventName": "1 CARD 20-20",
          "menuId": "20",
          "menuName": "Other",
          "url": "/poker17.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 26,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0060",
          "eventName": "TRIO",
          "menuId": "20",
          "menuName": "Other",
          "url": "/poker14.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 27,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0034",
          "eventName": "ANDAR BAHAR - C",
          "menuId": "9",
          "menuName": "Andar Bahar",
          "url": "http:///api/users/images/AndarBahar3-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 28,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0058",
          "eventName": "LOTTERY",
          "menuId": "20",
          "menuName": "Other",
          "url": "/lottery.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 28,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0008",
          "eventName": "20-20 POKER - B",
          "menuId": "10",
          "menuName": "Poker",
          "url": "http:///api/users/images/20-20 Poker-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 29,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0004",
          "eventName": "DTL TEENPATTI",
          "menuId": "2",
          "menuName": "Teen Patti",
          "url": "/dtl.jpg",
          "link": "/app/poker8",
          "popular": true,
          "sequence": 30,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0006",
          "eventName": "INA MINA DIKA",
          "menuId": "15",
          "menuName": "Bollywood",
          "url": "http:///api/users/images/InaMinaDika-01-min-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 31,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0031",
          "eventName": "LUCKY 7 - B",
          "menuId": "3",
          "menuName": "Lucky 7",
          "url": "http:///api/users/images/LUCKY7-B.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 31,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0050",
          "eventName": "BOLLYWOOD CASINO",
          "menuId": "15",
          "menuName": "Bollywood",
          "url": "http:///api/users/images/Bollywood Casino 2-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 32,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0046",
          "eventName": "20-20 CARD RACE",
          "menuId": "1",
          "menuName": "Popular",
          "url": "http:///api/users/images/CardRace-01-min.png",
          "link": "/app/home",
          "popular": true,
          "sequence": 33,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        {
          "eventId": "99.0036",
          "eventName": "BACCARAT STANDARD 6",
          "menuId": "5",
          "menuName": "Baccarat",
          "url": "/poker5.jpg",
          "link": "/app/poker7",
          "popular": true,
          "sequence": 38,
          "companyName": "UNIVERSE",
          "room": "asian"
        },
        
        {
          "eventId": "99.0059",
          "eventName": "KBC",
          "menuId": "20",
          "menuName": "Other",
          "url": "/quiz.jpg",
          "link": "/app/home",
          "popular": true,
          "sequence": 45,
          "companyName": "UNIVERSE",
          "room": "asian"
        }
      ]);
 const [activeLink, setActiveLink] = useState('');
    const router = useRouter();

    useEffect(() => {
        setActiveLink(router.pathname);
    }, [router.pathname]);

      const [emblaRef] = useEmblaCarousel()
      
    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const handleLinkClick = (href) => {
      setActiveLink(href);
      setTimeout(() => {setActiveLink('');}, 100);
      
      router.push(href);
  };

    useEffect(() => {
        fetch('https://www.55sport.in/api/exchange/events/searchEventList?key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: '' })
        })
            .then(response => response.json())
            .then(data => {
                setData(data.data);
                setFilteredData(data.data.filter(item => item.sportName === 'Cricket'));
                console.log(data);
            })
            .catch(error => console.error('Error fetching data:', error));


    }, []);

    const filterData = (sportName) => {
        setSelectedSport(sportName);
        setFilteredData(data.filter(item => item.sportName === sportName));
    };

    return (
      <div>
                                    <img src="/pokerbanner.png" className='banner' alt="Banner"  />

      <div className='hidden'>
        <br></br>
        <div className='p-1 submenu'>
          <span onClick={() => filterData('Cricket')} className={selectedSport === 'Cricket' ? 'active' : ''}>Cricket</span>
          <span onClick={() => filterData('Soccer')} className={selectedSport === 'Soccer' ? 'active' : ''}>Soccer</span>
          <span onClick={() => filterData('Tennis')} className={selectedSport === 'Tennis' ? 'active' : ''}>Tennis</span>
        </div>
        <table className='bgs'>
          <tbody>
          <tr>
            {filteredData.map((item, index) => (
              <td key={index} className='c46'>
                <span>{item.eventName}</span>
                <span className='date'>{new Date(item.eventTime).toLocaleString()}</span>
              </td>
            ))}
          </tr>
          </tbody>
        </table>
        
      </div>
        
         
          <br></br>
          <div className='casinos1'>
        <div className='highlights'>3 Card Poker</div>
        <div className='tiles1'>
          {casinoLobby.filter(item => item.menuName.toLowerCase() === 'teen patti').map((item, index) => (
            <div  key={index} onClick={() => handleLinkClick(item.link)} className={`tile ${item.link=='/app/home'?'disabled':''}`}>
            <img  src= {item.url}  /> <span>{item.eventName}</span>
           </div>
          ))}
        </div>
          </div>
          <br></br>
          <br></br>
          
          
       </div>
    );
};

export default HomePage;
