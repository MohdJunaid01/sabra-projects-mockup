import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';

export default function Hero({ onStartPlanning }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '110px 40px 80px 40px',
      backgroundColor: '#F5F3EF',
      borderBottom: '1px solid #D8D4CE',
      overflow: 'hidden'
    }} className="subtle-grid-light">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Two column layout on desktop: Editorial headline & CTA on left, architectural hero photography on right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: '48px',
          alignItems: 'center'
        }} className="hero-grid">
          <style>{`
            @media (max-width: 980px) {
              .hero-grid {
                grid-template-columns: 1fr !important;
                gap: 36px !important;
              }
            }
          `}</style>

          {/* Left Column: Editorial Headline & Actions */}
          <div>
            {/* Technical Sub-badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8D4CE',
              borderRadius: '2px',
              marginBottom: '28px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#EC202B'
              }} />
              <span className="label-tech" style={{ color: '#111111', fontSize: '0.68rem' }}>
                SABRA PROJECTS · SYDNEY RESIDENTIAL JOINERY
              </span>
            </div>

            {/* Large Editorial Serif Headline */}
            <h1 className="headline-large" style={{
              color: '#111111',
              marginBottom: '24px',
              fontWeight: 400
            }}>
              YOUR KITCHEN.<br />
              <span style={{ color: '#66615C', fontStyle: 'italic', fontWeight: 300 }}>YOUR MATERIALS.</span><br />
              YOUR VISION.
            </h1>

            {/* Supporting Copy */}
            <p style={{
              fontSize: 'clamp(1.05rem, 1.6vw, 1.28rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#66615C',
              maxWidth: '560px',
              marginBottom: '38px',
              letterSpacing: '0.01em'
            }}>
              A smarter way to start your renovation. Explore architectural materials and finishes, configure your bespoke joinery in real-time 3D, and craft your space.
            </p>

            {/* CTA */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px'
            }}>
              <button
                onClick={onStartPlanning}
                className="btn-primary"
                style={{ padding: '16px 36px', fontSize: '0.84rem' }}
              >
                <span>EXPLORE MATERIALS</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Hero Photograph Frame */}
          <div style={{
            position: 'relative'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8D4CE',
              borderRadius: '2px',
              padding: '12px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: '1px'
              }}>
                <img
                  src="/assets/projects/kitchen_renovations.jpg"
                  alt="Sabra Projects bespoke kitchen joinery in Sydney residence"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  border: '1px solid #D8D4CE',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: '#111111'
                }}>
                  SYDNEY HARBOUR RESIDENCE
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 6px 4px 6px',
                fontSize: '0.72rem',
                color: '#66615C'
              }}>
                <span style={{ fontWeight: 600, color: '#111111' }}>
                  Custom Natural Oak & Calacatta Stone
                </span>
                <span className="label-tech" style={{ fontSize: '0.64rem', color: '#EC202B' }}>
                  SABRA ARCHITECTURAL JOINERY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
