'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

  // Simple emoji icons for demo; replace with SVGs or icon components as needed
  const icons = {
    Breathing: '🌬️',
    Pushups: '💪',
    Squat: '🏋️',
    Steps: '🚶',
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '80vh', justifyContent: 'center' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '16px',
        height: '90vh',
        width: '95vw',
        background: 'rgba(201, 201, 224, 1)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px #0001',
        padding: '16px'
      }}>
        {[
          { label: 'Breathing', path: '/app/exercise/breathing' },
          { label: 'Pushups', path: '/app/exercise/pushups' },
          { label: 'Squat', path: '/app/exercise/squat' },
          { label: 'Steps', path: '/app/exercise/steps' }
        ].map(({ label, path }) => (
          <div
            key={label}
            style={{
              background: 'rgba(109, 134, 172, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              cursor: 'pointer',
              transition: 'transform 0.3s, background 0.3s',
              borderRadius: '12px',
              height: '100%'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(123, 123, 148, 1)';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(109, 134, 172, 0.6)';
              e.currentTarget.style.transform = 'scale(1) rotate(0)';
            }}
            onClick={e => {
              e.currentTarget.style.transform = 'scale(1.16) rotate(2deg)';
               location.href = path;
            }}
          >
            <span style={{ fontSize: '8rem', marginBottom: '0.5rem' }}>{icons[label]}</span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreathingExercise;
