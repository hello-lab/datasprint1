'use client'
import Loading from '../loading';
import { useEffect, useState } from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";
const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('gambling');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(  () => {

      fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `https://newsapi.org/v2/everything?q=${selectedCategory}&apiKey=300cb1dbe3dc4d2fbc0f94cacced2c55` }),
      })
    
      .then(response => response.json())
      .then(data => {
        setArticles(data.articles);
        setFilteredArticles(data.articles);
        console.log(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [selectedCategory]);

  const filterArticles = (category) => {
    setSelectedCategory(category);
    setFilteredArticles(articles.filter(article => article.category === category));
  };


  const closePopup = () => {
    setSelectedArticle(null);
  };

  return (
    <div>
                          <img src="/newsbanner.png" alt="Banner" className='banner' />

      <div className='highlights'>News</div>
      <br></br>
      <div className='p-1 submenu'>
        <div onClick={() => filterArticles('gambling')} className={selectedCategory === 'gambling' ? 'active' : ''}>Gambling</div>
        <div onClick={() => filterArticles('casino')} className={selectedCategory === 'casino' ? 'active' : ''}>Casino</div>
      </div>
      <div className='post-cards'>
        {!filteredArticles.length &&
   <Loading/>
  
}

        {filteredArticles.map((article, index) => (
          <div key={index} className='post-card' onClick={() => handleArticleClick(article)}>
            <img src={article.urlToImage} alt={article.title} className='post-card-image' />
            <div className='post-card-content'>
              <h3>{article.title}</h3>
              <p className='date'>{new Date(article.publishedAt).toLocaleString()}</p>
              <p>{article.description}</p>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default HomePage;
