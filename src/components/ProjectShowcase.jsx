import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'kitchen-renovations',
    step: '01 / KITCHENS',
    title: 'KITCHEN\nRENOVATIONS',
    technicalLabel: 'BESPOKE JOINERY · SYDNEY',
    description: 'Thoughtful joinery, considered materials and spaces designed around everyday living.',
    image: '/assets/projects/kitchen_renovations.jpg',
    spanClass: 'card-large',
    projectTypeId: 'full-kitchen'
  },
  {
    id: 'new-build-joinery',
    step: '02 / NEW BUILDS',
    title: 'NEW BUILD\nJOINERY',
    technicalLabel: 'ARCHITECTURAL INTEGRATION',
    description: 'Precision joinery engineered for architectural plans, flush detailing and full-height timber veneers.',
    image: '/assets/projects/new_build_joinery.jpg',
    spanClass: 'card-medium',
    projectTypeId: 'new-build'
  },
  {
    id: 'butlers-pantry',
    step: '03 / SPECIALISED SPACES',
    title: "KITCHEN & BUTLER'S\nPANTRY",
    technicalLabel: 'SECONDARY JOINERY & STORAGE',
    description: 'Discreet prep spaces, custom wine cellaring and integrated storage engineered for seamless entertaining.',
    image: '/assets/projects/butlers_pantry.jpg',
    spanClass: 'card-medium',
    projectTypeId: 'butlers-pantry'
  },
  {
    id: 'apartment-compact',
    step: '04 / COMPACT LUXURY',
    title: 'APARTMENT &\nCOMPACT SPACES',
    technicalLabel: 'HIGH-DENSITY BESPOKE PLANNING',
    description: 'Maximising every millimeter with concealed pocket systems, integrated appliances and tailored stone surfaces.',
    image: '/assets/projects/apartment_compact.jpg',
    spanClass: 'card-large',
    projectTypeId: 'apartment'
  }
];

export default function ProjectShowcase({ onSelectCategory }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="explore" style={{
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
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px'
            }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B' }} />
              <span className="label-tech" style={{ color: '#EC202B' }}>
                01 / EXPLORE
              </span>
            </div>

            <h2 className="headline-section" style={{ color: '#111111', whiteSpace: 'pre-line' }}>
              BUILT AROUND{'\n'}HOW YOU LIVE.
            </h2>
          </div>

          <p style={{
            color: '#66615C',
            fontSize: '1.05rem',
            maxWidth: '480px',
            lineHeight: 1.6,
            marginBottom: '6px'
          }}>
            Explore the kinds of projects Sabra Projects brings to life. Every project is individually detailed and manufactured locally in Sydney.
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }} className="asymmetric-grid">
          <style>{`
            .card-large {
              grid-column: span 7;
            }
            .card-medium {
              grid-column: span 5;
            }
            @media (max-width: 980px) {
              .card-large, .card-medium {
                grid-column: span 12 !important;
              }
            }
          `}</style>

          {CATEGORIES.map((cat) => {
            const isHovered = hoveredId === cat.id;

            return (
              <div
                key={cat.id}
                className={cat.spanClass}
                onClick={() => onSelectCategory(cat.projectTypeId)}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid',
                  borderColor: isHovered ? '#EC202B' : '#D8D4CE',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                  transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow: isHovered ? '0 12px 32px rgba(0, 0, 0, 0.06)' : '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
              >
                {/* Architectural Imagery Container */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                  overflow: 'hidden',
                  backgroundColor: '#EAE6DF'
                }}>
                  <img
                    src={cat.image}
                    alt={cat.title.replace('\n', ' ')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isHovered ? 'scale(1.03)' : 'scale(1.0)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    border: '1px solid #D8D4CE',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#111111'
                  }}>
                    {cat.step}
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div style={{
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div className="label-tech" style={{
                      color: isHovered ? '#EC202B' : '#66615C',
                      fontSize: '0.66rem',
                      marginBottom: '10px',
                      transition: 'color 0.2s ease'
                    }}>
                      {cat.technicalLabel}
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.75rem',
                      fontWeight: 400,
                      lineHeight: 1.15,
                      color: '#111111',
                      marginBottom: '12px',
                      whiteSpace: 'pre-line'
                    }}>
                      {cat.title}
                    </h3>

                    <p style={{
                      fontSize: '0.92rem',
                      color: '#66615C',
                      lineHeight: 1.55,
                      marginBottom: '24px'
                    }}>
                      {cat.description}
                    </p>
                  </div>

                  {/* Indicator & Arrow */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #EAE6DF'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isHovered ? '#EC202B' : '#111111',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'color 0.2s ease'
                    }}>
                      <span>EXPLORE</span>
                      <ArrowRight size={14} style={{
                        transform: isHovered ? 'translateX(4px)' : 'none',
                        transition: 'transform 0.2s ease',
                        color: isHovered ? '#EC202B' : '#111111'
                      }} />
                    </span>

                    <span style={{
                      fontSize: '0.7rem',
                      color: '#8E8A84'
                    }}>
                      Configure in 3D
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
