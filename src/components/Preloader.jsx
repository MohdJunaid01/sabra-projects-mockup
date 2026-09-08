import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Smooth progress animation over ~1000ms
    const startTime = performance.now();
    const duration = 1050; // ms

    let frameId;
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        frameId = requestAnimationFrame(animate);
      } else {
        // Complete and begin fade-out
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 450);
        }, 120);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#F5F3EF',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFading ? 'none' : 'auto'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '420px',
        width: '100%'
      }}>
        {/* Sabra Projects Red Square Crest */}
        <div style={{
          width: '44px',
          height: '44px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src="/assets/image.png"
            alt="Sabra Projects"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Wordmark */}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.05rem',
          letterSpacing: '0.14em',
          fontWeight: 700,
          color: '#111111',
          marginBottom: '4px'
        }}>
          SABRA <span style={{ color: '#EC202B' }}>PROJECTS</span>
        </div>

        <div style={{
          fontSize: '0.62rem',
          color: '#8E8A84',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '36px'
        }}>
          SYDNEY RESIDENTIAL JOINERY · DIGITAL PLANNER
        </div>

        {/* Razor-thin Architectural Progress Line */}
        <div style={{
          width: '220px',
          height: '2px',
          backgroundColor: '#D8D4CE',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '14px',
          borderRadius: '1px'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress}%`,
            backgroundColor: '#EC202B',
            transition: 'width 0.05s linear'
          }} />
        </div>

        {/* Precision Percentage Readout */}
        <div style={{
          fontSize: '0.65rem',
          letterSpacing: '0.16em',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          color: '#66615C'
        }}>
          INITIALISING SPECIFICATION · {String(progress).padStart(3, '0')}%
        </div>
      </div>
    </div>
  );
}
