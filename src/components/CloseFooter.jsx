import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function CloseFooter({ onBackToTop }) {
  return (
    <footer id="close-section" style={{
      backgroundColor: '#F5F3EF',
      borderTop: '1px solid #D8D4CE',
      padding: '100px 40px 60px 40px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        {/* Centered Editorial Composition */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '72px'
        }}>
          {/* Sequence badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B' }} />
            <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.8rem' }}>
              EXPLORE → ESTIMATE → CONSULT
            </span>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B' }} />
          </div>

          {/* Large Editorial Headline */}
          <h2 className="headline-section" style={{
            maxWidth: '820px',
            marginBottom: '24px',
            color: '#111111',
            textTransform: 'uppercase',
            fontWeight: 400
          }}>
            ELEVATING THE RENOVATION<br />
            EXPERIENCE FOR SYDNEY<br />
            HOMEOWNERS
          </h2>

          {/* Supporting Text */}
          <p style={{
            color: '#66615C',
            fontSize: '1.05rem',
            maxWidth: '640px',
            lineHeight: 1.65,
            marginBottom: '36px'
          }}>
            An interactive digital planning experience that helps clients explore design decisions, understand investment parameters and arrive at consultation better prepared.
          </p>

          {/* CTA: BACK TO TOP */}
          <button
            onClick={onBackToTop}
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '0.78rem' }}
          >
            <ArrowUp size={15} />
            <span>BACK TO TOP</span>
          </button>
        </div>

        {/* Footer Brand & Credit Strip */}
        <div style={{
          paddingTop: '36px',
          borderTop: '1px solid #D8D4CE',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Sabra Projects Logo & Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              height: '44px',
              width: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img
                src="/assets/image.png"
                alt="Sabra Projects"
                style={{ height: '100%', width: '100%', objectFit: 'contain' }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#111111', fontSize: '0.92rem', letterSpacing: '0.04em' }}>
                SABRA PROJECTS PTY LTD
              </div>
              <div style={{ fontSize: '0.74rem', color: '#66615C' }}>
                Sydney, New South Wales · Bespoke Residential Joinery & Kitchens
              </div>
            </div>
          </div>

          {/* Concept Credit */}
          <div style={{
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{ fontSize: '0.74rem', color: '#66615C' }}>
              Digital Project Planner Concept
            </div>
            <div style={{ fontSize: '0.74rem', color: '#111111', fontWeight: 600 }}>
              Designed & Engineered by <span style={{ color: '#EC202B' }}>Oelrix</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
