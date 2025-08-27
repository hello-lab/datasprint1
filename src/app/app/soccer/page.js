'use client'

import { useEffect, useState } from 'react';

const HomePage = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSport, setSelectedSport] = useState('Cricket');

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
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
                setFilteredData(data.data.filter(item => item.sportName === 'Soccer'));
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
                              <img src="/footballbanner.png" alt="Banner" className='banner' />

            <div className='highlights'>Soccer</div>
            <br></br>
           
            <div className='bgs'>
                <ul>
                    {filteredData.map((item, index) => (
                        <li key={index} className='c46' name={item.exEventId}>
                            <span>{item.eventName}</span>
                            <span>{new Date(item.eventTime).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HomePage;
