import React, { useEffect, useState } from 'react';

export default function ScrollProgressIndicator({ currentView, onNavigate }) {
  const [activeSection, setActiveSection] = useState('01');

  useEffect(() => {
    if (currentView === 'home') {
      const handleScroll = () => {
        const labElem = document.getElementById('material-lab');
        const exploreElem = document.getElementById('explore');
        const scrollY = window.scrollY + 300;

        if (labElem && scrollY >= labElem.offsetTop) {
          setActiveSection('02');
        } else if (exploreElem && scrollY >= exploreElem.offsetTop) {
          setActiveSection('01');
        } else {
          setActiveSection('01');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else if (currentView === 'design') {
      const handleScroll = () => {
        const investmentElem = document.getElementById('investment-section');
        const scrollY = window.scrollY + 350;

        if (investmentElem && scrollY >= investmentElem.offsetTop) {
          setActiveSection('04');
        } else {
          setActiveSection('03');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else if (currentView === 'estimator') {
      setActiveSection('04');
    } else if (currentView === 'consultation') {
      setActiveSection('05');
    }
  }, [currentView]);

  const stages = [
    { num: '01', label: 'EXPLORE', view: 'home', target: 'explore' },
    { num: '02', label: 'MATERIALS', view: 'home', target: 'material-lab' },
    { num: '03', label: 'DESIGN', view: 'design', target: null },
    { num: '04', label: 'INVESTMENT', view: 'design', target: 'investment-section' },
    { num: '05', label: 'CONSULT', view: 'consultation', target: null }
  ];

  return (
    <aside
      aria-label="Progress navigation"
      className="desktop-progress-tracker"
      style={{
        position: 'fixed',
        right: '28px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        display: 'none',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <style>{`
        @media (min-width: 1240px) {
          .desktop-progress-tracker { display: flex !important; }
        }
      `}</style>

      {/* Thin Architectural Vertical Spine */}
      <div style={{
        position: 'absolute',
        top: '8px',
        bottom: '8px',
        left: '4px',
        width: '1px',
        backgroundColor: '#D8D4CE',
        zIndex: 1
      }} />

      {stages.map((stage) => {
        const isActive = activeSection === stage.num;

        return (
          <div
            key={stage.num}
            onClick={() => onNavigate(stage.view, stage.target)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
              userSelect: 'none'
            }}
            title={`${stage.num} / ${stage.label}`}
          >
            {/* Dot indicator on vertical spine */}
            <div
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#EC202B' : '#FFFFFF',
                border: '1px solid',
                borderColor: isActive ? '#EC202B' : '#8E8A84',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1.2)' : 'scale(1)',
                boxShadow: isActive ? '0 0 0 3px rgba(236, 32, 43, 0.15)' : 'none'
              }}
            />

            {/* Stage Label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: isActive ? 1 : 0.45,
              transition: 'all 0.25s ease'
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: isActive ? '#EC202B' : '#111111'
              }}>
                {stage.num}
              </span>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive ? '#111111' : '#66615C'
              }}>
                {stage.label}
              </span>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
