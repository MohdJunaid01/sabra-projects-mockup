import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

export default function Navigation({
  currentView,
  onNavigate,
  onReset
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Materials', target: 'material-lab', view: 'home' },
    { label: 'Cabinet Designer', target: 'design', view: 'design' }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: scrolled ? '70px' : '76px',
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.94)' : '#FFFFFF',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid',
      borderColor: scrolled ? '#D8D4CE' : 'rgba(216, 212, 206, 0.7)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.04)' : '0 1px 3px rgba(0, 0, 0, 0.01)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Left: Official Sabra Projects Logo & Brand Wordmark */}
      <div
        onClick={() => onNavigate('home', 'hero')}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{
          height: '46px',
          width: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <img
            src="/assets/image.png"
            alt="Sabra Projects Logo"
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.05rem',
            letterSpacing: '0.12em',
            fontWeight: 700,
            color: '#111111',
            lineHeight: 1.1
          }}>
            SABRA <span style={{ color: '#EC202B' }}>PROJECTS</span>
          </span>
          <span style={{
            fontSize: '0.62rem',
            color: '#66615C',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginTop: '2px'
          }}>
            Sydney Residential Joinery
          </span>
        </div>
      </div>

      {/* Center: Minimal Architectural Navigation */}
      <nav style={{
        display: 'none',
        alignItems: 'center',
        gap: '32px'
      }} className="desktop-nav">
        <style>{`
          @media (min-width: 900px) {
            .desktop-nav { display: flex !important; }
          }
        `}</style>
        {navLinks.map((link) => {
          const isActive = (currentView === link.view && (link.view !== 'home' || link.target === 'material-lab'));
          return (
            <button
              key={link.label}
              onClick={() => onNavigate(link.view, link.target)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive ? '#EC202B' : '#66615C',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #EC202B' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#111111';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#66615C';
              }}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right Action: Clean CTA "START PLANNING →" & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onReset}
          title="Reset planner selections"
          style={{
            background: 'transparent',
            border: '1px solid #D8D4CE',
            color: '#66615C',
            borderRadius: '2px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#111111';
            e.currentTarget.style.color = '#111111';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#D8D4CE';
            e.currentTarget.style.color = '#66615C';
          }}
        >
          <RotateCcw size={13} />
          <span style={{ display: 'none' }} className="sm-show">RESET</span>
          <style>{`@media(min-width: 640px){ .sm-show { display: inline !important; } }`}</style>
        </button>

        <button
          onClick={() => onNavigate('home', 'material-lab')}
          className="btn-primary"
          style={{
            padding: '10px 20px',
            fontSize: '0.76rem',
            fontWeight: 600
          }}
        >
          <span>START PLANNING</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </header>
  );
}
