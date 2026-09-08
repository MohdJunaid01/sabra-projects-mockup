import React, { useState } from 'react';
import { TIMBER_MATERIALS } from '../data/materials';
import { Check, ArrowRight } from 'lucide-react';

// Generates an architectural wood swatch with realistic grain texture
function WoodTextureSwatch({ timber, isHovered, isSelected }) {
  const isDark = timber.baseColor === '#1F1F20' || timber.baseColor === '#151515' || timber.baseColor === '#2B231D' || timber.baseColor === '#34261E';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '16/11',
      overflow: 'hidden',
      backgroundColor: timber.baseColor,
      borderRadius: '1px'
    }}>
      {/* SVG Grain Pattern with realistic wood texture layers */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 280"
        preserveAspectRatio="none"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'scale(1.04)' : 'scale(1)'
        }}
      >
        <defs>
          <linearGradient id={`cat-grad-${timber.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={timber.highlightColor} stopOpacity="0.35" />
            <stop offset="45%" stopColor={timber.baseColor} stopOpacity="0" />
            <stop offset="100%" stopColor={timber.grainColor} stopOpacity="0.4" />
          </linearGradient>

          <pattern id={`cat-grain-${timber.id}`} width="40" height="280" patternUnits="userSpaceOnUse">
            <line x1="6" y1="0" x2="8" y2="280" stroke={timber.grainColor} strokeWidth="1" strokeOpacity="0.45" />
            <line x1="16" y1="0" x2="14" y2="280" stroke={timber.grainColor} strokeWidth="1.5" strokeOpacity="0.3" />
            <line x1="24" y1="0" x2="26" y2="280" stroke={timber.highlightColor} strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="34" y1="0" x2="32" y2="280" stroke={timber.grainColor} strokeWidth="1.2" strokeOpacity="0.4" />
          </pattern>
        </defs>

        <rect width="400" height="280" fill={timber.baseColor} />
        <rect width="400" height="280" fill={`url(#cat-grain-${timber.id})`} />

        {timber.grainType === 'wide-wave' || timber.grainType === 'flowing-crown' ? (
          <g stroke={timber.grainColor} fill="none" strokeWidth="2" strokeOpacity="0.32">
            <path d="M 60,0 C 90,90 120,180 80,280" />
            <path d="M 180,0 C 230,110 190,190 220,280" />
            <path d="M 280,0 C 310,70 340,210 320,280" />
            <path d="M 130,40 C 200,80 200,200 140,240" strokeWidth="1.4" strokeOpacity="0.25" />
          </g>
        ) : timber.grainType === 'charred-alligator' ? (
          <g stroke={timber.highlightColor} fill="none" strokeWidth="1.2" strokeOpacity="0.25">
            <path d="M 0,50 L 400,55 M 0,110 L 400,105 M 0,170 L 400,175 M 0,230 L 400,225" />
            <path d="M 70,0 L 65,280 M 150,0 L 155,280 M 240,0 L 235,280 M 330,0 L 335,280" strokeDasharray="12,18" />
          </g>
        ) : (
          <g stroke={timber.grainColor} fill="none" strokeWidth="1.2" strokeOpacity="0.38">
            <line x1="45" y1="0" x2="48" y2="280" />
            <line x1="95" y1="0" x2="92" y2="280" strokeWidth="1.6" />
            <line x1="145" y1="0" x2="148" y2="280" />
            <line x1="205" y1="0" x2="202" y2="280" strokeWidth="2" />
            <line x1="265" y1="0" x2="268" y2="280" strokeWidth="1.4" />
            <line x1="315" y1="0" x2="312" y2="280" />
            <line x1="365" y1="0" x2="368" y2="280" strokeWidth="1.5" />
          </g>
        )}

        <rect width="400" height="280" fill={`url(#cat-grad-${timber.id})`} />
      </svg>

      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.92)' : 'rgba(17, 17, 17, 0.88)',
        color: isDark ? '#111111' : '#FFFFFF',
        fontSize: '0.62rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '3px 7px',
        borderRadius: '2px',
        pointerEvents: 'none'
      }}>
        {timber.finish}
      </div>

      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '24px',
          height: '24px',
          backgroundColor: '#EC202B',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(236, 32, 43, 0.4)',
          zIndex: 5
        }}>
          <Check size={14} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

export default function MaterialCatalogue({
  selectedMaterialId,
  onSelectAndOpenDesign
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [activatingId, setActivatingId] = useState(null);

  const selectedTimber = TIMBER_MATERIALS.find(t => t.id === selectedMaterialId) || TIMBER_MATERIALS[0];

  const handleCardClick = (timberId) => {
    setActivatingId(timberId);
    setTimeout(() => {
      onSelectAndOpenDesign(timberId);
    }, 380);
  };

  return (
    <section id="material-lab" style={{
      backgroundColor: '#F5F3EF',
      padding: '100px 40px 100px 40px',
      borderBottom: '1px solid #D8D4CE',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '56px',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B' }} />
              <span className="label-tech" style={{ color: '#EC202B' }}>
                02 / MATERIAL LAB
              </span>
            </div>

            <h2 className="headline-section" style={{ color: '#111111', whiteSpace: 'pre-line' }}>
              MATERIALS{'\n'}THAT DEFINE{'\n'}THE SPACE.
            </h2>
          </div>

          <p style={{
            color: '#66615C',
            fontSize: '1.05rem',
            maxWidth: '480px',
            lineHeight: 1.6,
            marginBottom: '6px'
          }}>
            Explore timber finishes and architectural materials, then click any finish to enter the dedicated cabinet design studio.
          </p>
        </div>

        {/* 4 × 4 Architectural Material Grid (16 Materials Total) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }} className="material-grid-responsive">
          <style>{`
            @media (max-width: 1080px) {
              .material-grid-responsive {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 20px !important;
              }
            }
            @media (max-width: 720px) {
              .material-grid-responsive {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 16px !important;
              }
            }
          `}</style>

          {TIMBER_MATERIALS.map((timber) => {
            const isSelected = selectedMaterialId === timber.id;
            const isHovered = hoveredId === timber.id;
            const isActivating = activatingId === timber.id;

            return (
              <div
                key={timber.id}
                onClick={() => handleCardClick(timber.id)}
                onMouseEnter={() => setHoveredId(timber.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  backgroundColor: isSelected || isActivating ? 'rgba(236, 32, 43, 0.03)' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: isActivating || isSelected ? '#EC202B' : (isHovered ? '#111111' : '#D8D4CE'),
                  borderRadius: '2px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  transform: isActivating ? 'scale(0.985)' : (isHovered ? 'translateY(-2px)' : 'none'),
                  boxShadow: isHovered ? '0 8px 24px rgba(0, 0, 0, 0.06)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
                }}
              >
                {/* Visual Swatch */}
                <WoodTextureSwatch timber={timber} isHovered={isHovered} isSelected={isSelected} />

                {/* Card Information */}
                <div style={{ paddingTop: '16px', paddingBottom: '4px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    {/* Technical Code Identifier */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span className="label-tech" style={{
                        color: isSelected || isActivating ? '#EC202B' : '#8E8A84',
                        fontSize: '0.64rem',
                        transition: 'color 0.2s ease'
                      }}>
                        {timber.code}
                      </span>
                      {isHovered && !isSelected && (
                        <span style={{
                          width: '5px',
                          height: '5px',
                          backgroundColor: '#EC202B',
                          borderRadius: '50%'
                        }} />
                      )}
                    </div>

                    {/* Material Name */}
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#111111',
                      lineHeight: 1.15,
                      marginBottom: '4px',
                      transform: isHovered ? 'translateX(2px)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}>
                      {timber.name}
                    </h3>

                    {/* Subtle Metadata */}
                    <div style={{
                      fontSize: '0.74rem',
                      color: '#66615C',
                      lineHeight: 1.4,
                      marginBottom: '10px'
                    }}>
                      {timber.species} · {timber.finish}
                    </div>
                  </div>

                  {/* Micro selection cue */}
                  <div style={{
                    paddingTop: '8px',
                    borderTop: '1px solid #EAE6DF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.68rem',
                    color: isSelected || isActivating ? '#EC202B' : '#8E8A84',
                    fontWeight: 600
                  }}>
                    <span>{isActivating ? 'OPENING DESIGN STUDIO...' : (isSelected ? 'SELECTED · OPEN DESIGN' : 'CLICK TO DESIGN')}</span>
                    <span style={{
                      color: isSelected || isHovered ? '#EC202B' : '#111111',
                      fontWeight: 700,
                      display: 'inline-block',
                      transform: isHovered ? 'translateX(3px)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}>
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Persistent Selected Material Summary & CTA Bar */}
        <div style={{
          marginTop: '48px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '28px 36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: selectedTimber.baseColor,
              borderRadius: '2px',
              border: '1px solid #D8D4CE',
              flexShrink: 0,
              boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.15)'
            }} />

            <div>
              <div className="label-tech" style={{ color: '#EC202B', marginBottom: '2px', fontSize: '0.66rem' }}>
                SELECTED MATERIAL · {selectedTimber.code}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                fontWeight: 600,
                color: '#111111',
                lineHeight: 1.15
              }}>
                {selectedTimber.name}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#66615C', marginTop: '2px', maxWidth: '580px' }}>
                {selectedTimber.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectAndOpenDesign(selectedTimber.id)}
            className="btn-primary"
            style={{ padding: '15px 32px', fontSize: '0.84rem' }}
          >
            <span>DESIGN THIS MATERIAL</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
