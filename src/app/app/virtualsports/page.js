'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const VirtualSportsPage = () => {
  const router = useRouter();

  const sportsCategories = [
    {
      name: "Virtual Football",
      description: "Experience realistic football matches with advanced AI",
      image: "⚽",
      features: ["Real-time statistics", "Multiple leagues", "Live commentary"]
    },
    {
      name: "Virtual Basketball",
      description: "High-energy basketball games with professional teams",
      image: "🏀",
      features: ["NBA-style gameplay", "Player statistics", "Tournament mode"]
    },
    {
      name: "Virtual Tennis",
      description: "Professional tennis matches on world-class courts",
      image: "🎾",
      features: ["Grand slam venues", "Player rankings", "Match highlights"]
    },
    {
      name: "Virtual Racing",
      description: "Thrilling racing experiences with realistic physics",
      image: "🏎️",
      features: ["Multiple tracks", "Car customization", "Time trials"]
    }
  ];

  const upcomingEvents = [
    {
      title: "Virtual Champions League Final",
      date: "2024-01-15 20:00",
      teams: "Barcelona vs Real Madrid",
      category: "Football"
    },
    {
      title: "NBA Virtual Championship",
      date: "2024-01-16 19:30",
      teams: "Lakers vs Warriors",
      category: "Basketball"
    },
    {
      title: "Wimbledon Virtual Open",
      date: "2024-01-17 15:00",
      teams: "Federer vs Nadal",
      category: "Tennis"
    }
  ];

  return (
    <div className="virtual-sports">
      {/* Header Section */}
      <section className="vs-header">
        <div className="vs-hero">
          <h1>Virtual Sports Experience</h1>
          <p>Immerse yourself in the future of digital sports entertainment</p>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="vs-categories">
        <h2>Available Sports</h2>
        <div className="vs-grid">
          {sportsCategories.map((sport, index) => (
            <div key={index} className="vs-card">
              <div className="vs-icon">{sport.image}</div>
              <h3>{sport.name}</h3>
              <p>{sport.description}</p>
              <ul className="vs-features">
                {sport.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
              <button className="vs-button">Play Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="vs-events">
        <h2>Upcoming Virtual Events</h2>
        <div className="vs-events-list">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="vs-event-card">
              <div className="vs-event-info">
                <h3>{event.title}</h3>
                <p className="vs-event-teams">{event.teams}</p>
                <div className="vs-event-meta">
                  <span className="vs-event-date">{new Date(event.date).toLocaleString()}</span>
                  <span className="vs-event-category">{event.category}</span>
                </div>
              </div>
              <button className="vs-watch-btn">Watch Live</button>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="vs-features">
        <h2>Why Choose Virtual Sports?</h2>
        <div className="vs-features-grid">
          <div className="vs-feature">
            <div className="vs-feature-icon">🎮</div>
            <h3>Realistic Gameplay</h3>
            <p>Advanced AI and physics engines create authentic sports experiences</p>
          </div>
          <div className="vs-feature">
            <div className="vs-feature-icon">📊</div>
            <h3>Real Statistics</h3>
            <p>Comprehensive statistics and analytics for every game and player</p>
          </div>
          <div className="vs-feature">
            <div className="vs-feature-icon">🏆</div>
            <h3>Tournaments</h3>
            <p>Participate in seasonal tournaments and championships</p>
          </div>
          <div className="vs-feature">
            <div className="vs-feature-icon">📱</div>
            <h3>Multi-Platform</h3>
            <p>Play on any device - desktop, tablet, or mobile</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualSportsPage;
