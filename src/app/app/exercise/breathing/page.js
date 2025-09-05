'use client'

import { useState, useEffect } from 'react';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('Inhale');
  const [size, setSize] = useState(120);

  useEffect(() => {
    let inhale = true;
    const interval = setInterval(() => {
      inhale = !inhale;
      setPhase(inhale ? 'Inhale' : 'Exhale');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let anim;
    if (phase === 'Inhale') {
      anim = setInterval(() => setSize(s => Math.min(s + 2, 180)), 50);
    } else {
      anim = setInterval(() => setSize(s => Math.max(s - 2, 120)), 50);
    }
    return () => clearInterval(anim);
  }, [phase]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', width: '80vw',transform:"translateX(10%)" }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: 24, fontWeight: 700 , color: '#3871f5ff'}}>Breathing Exercise</h1>
      <div style={{ fontSize: '1.3rem', marginBottom: 16, color: '#3871f5ff', fontWeight: 600 }}>{phase}</div>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #aee1f9 60%, #3871f5ff 100%)',
        boxShadow: '0 0 32px 8px #3871f555',
        transition: 'width 0.5s, height 0.5s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
      }}>
        <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>{phase === 'Inhale' ? '🫁' : '💨'}</span>
      </div>
      <div style={{ fontSize: '1.1rem', color: '#555', maxWidth: 320, textAlign: 'center' }}>
        Follow the circle: Inhale as it grows, exhale as it shrinks. Repeat for a few cycles to relax and refocus.
      </div>
    </div>
  );
};

export default BreathingExercise;
