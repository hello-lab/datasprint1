'use client'
import Loading from '../loading';
import { useEffect, useState } from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";

const NewsPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('technology');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const categories = [
    { name: 'Technology', value: 'technology' },
    { name: 'Business', value: 'business' },
    { name: 'Science', value: 'science' },
    { name: 'Health', value: 'health' },
    { name: 'Sports', value: 'sports' }
  ];

  useEffect(() => {
    setLoading(true);
    fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://newsapi.org/v2/everything?q=${selectedCategory}&sortBy=publishedAt&apiKey=300cb1dbe3dc4d2fbc0f94cacced2c55` }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.articles) {
        setArticles(data.articles);
        setFilteredArticles(data.articles);
      }
      setLoading(false);
      console.log(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [selectedCategory]);

  const filterArticles = (category) => {
    setSelectedCategory(category);
  };

  const closePopup = () => {
    setSelectedArticle(null);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>Latest News & Updates</h1>
        <p>Stay informed with the latest developments across various industries</p>
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button 
            key={category.value}
            onClick={() => filterArticles(category.value)} 
            className={`filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="articles-grid">
        {loading && (
          <div className="loading-container">
            <PacmanLoader color="#2563eb" />
            <p>Loading articles...</p>
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="no-articles">
            <p>No articles found for this category.</p>
          </div>
        )}

        {!loading && filteredArticles.map((article, index) => (
          <div key={index} className="article-card" onClick={() => handleArticleClick(article)}>
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} className="article-image" />
            )}
            <div className="article-content">
              <h3 className="article-title">{article.title}</h3>
              <p className="article-date">{new Date(article.publishedAt).toLocaleDateString()}</p>
              <p className="article-description">{article.description}</p>
              <div className="article-source">
                <span>Source: {article.source.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={closePopup}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closePopup}>×</button>
            <h2>{selectedArticle.title}</h2>
            {selectedArticle.urlToImage && (
              <img src={selectedArticle.urlToImage} alt={selectedArticle.title} className="modal-image" />
            )}
            <p className="modal-date">{new Date(selectedArticle.publishedAt).toLocaleDateString()}</p>
            <p className="modal-description">{selectedArticle.content || selectedArticle.description}</p>
            <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
              Read Full Article
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
