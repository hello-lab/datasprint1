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
      icon: "🚀",
      title: "Fast & Reliable",
      description: "Built with modern technologies for optimal performance and reliability."
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Perfectly adapted for all devices - desktop, tablet, and mobile."
    },
    {
      icon: "🔒",
      title: "Secure & Safe",
      description: "Enterprise-grade security to protect your data and privacy."
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Optimized for speed with cutting-edge performance techniques."
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
            Welcome to Your Professional
            <span className="hero-highlight"> Website Base</span>
          </h1>
          <p className="hero-description">
            A modern, clean, and professional website foundation ready to be customized for any business or organization.
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => handleLinkClick('/app/tips')} 
              className="btn-primary"
            >
              Explore News
            </button>
            <button 
              onClick={() => handleLinkClick('/app/cricket')} 
              className="btn-secondary"
            >
              View Products
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
          <h2>Why Choose Us</h2>
          <p>Discover the features that make us stand out</p>
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
