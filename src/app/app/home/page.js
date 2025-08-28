'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const router = useRouter();

  const handleLinkClick = (href) => {
    router.push(href);
  };

  const features = [
    {
      icon: "🏃‍♂️",
      title: "Step Tracking",
      description: "Connect with Google Fit to automatically track your daily steps and activity."
    },
    {
      icon: "💰",
      title: "Stepcoins Rewards",
      description: "Earn stepcoins for every step you take and redeem them for rewards."
    },
    {
      icon: "🏆",
      title: "Team Challenges",
      description: "Compete with colleagues in wellness challenges and climb the leaderboard."
    },
    {
      icon: "🎯",
      title: "Goal Setting",
      description: "Set daily, weekly, and monthly wellness goals to stay motivated."
    }
  ];

  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications built with the latest technologies.",
      image: "/service1.jpg"
    },
    {
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      image: "/service2.jpg"
    },
    {
      title: "Digital Solutions",
      description: "Complete digital transformation services for modern businesses.",
      image: "/service3.jpg"
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to StepUp
            <span className="hero-highlight"> Corporate Wellness</span>
          </h1>
          <p className="hero-description">
            Track your steps, set wellness goals, compete with colleagues, and earn stepcoins for staying active and healthy.
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => handleLinkClick('/app/wellness')} 
              className="btn-primary"
            >
              🌟 Wellness Dashboard
            </button>
            <button 
              onClick={() => handleLinkClick('/app/googlefit')} 
              className="btn-secondary"
              style={{ marginLeft: '10px' }}
            >
              🏃‍♂️ Sync Steps
            </button>
            <button 
              onClick={() => handleLinkClick('/app/leaderboard')} 
              className="btn-primary"
              style={{ marginLeft: '10px' }}
            >
              🏆 Leaderboard
            </button>
            <button 
              onClick={() => handleLinkClick('/app/profile')} 
              className="btn-secondary"
              style={{ marginLeft: '10px' }}
            >
              💰 View Stepcoins
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            🌟 Professional Website Base
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Wellness Features</h2>
          <p>Everything you need for a healthier, more active workplace</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Professional solutions tailored to your needs</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-image">
                <div className="service-placeholder">
                  📊 {service.title}
                </div>
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <button className="service-button">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust our professional services.</p>
          <div className="cta-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-outline">Contact Us</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Projects Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99%</div>
            <div className="stat-label">Customer Satisfaction</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
