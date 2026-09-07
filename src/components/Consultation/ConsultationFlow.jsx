import React, { useState } from 'react';
import {
  PROJECT_TYPES,
  SYDNEY_SUBURBS,
  TIMELINES,
  AVAILABLE_SLOTS,
  calculateBudgetRange
} from '../../data/estimatorData';
import {
  TIMBER_MATERIALS,
  CABINET_STYLES,
  CABINET_LAYOUTS,
  HARDWARE_OPTIONS,
  COUNTERTOP_OPTIONS
} from '../../data/materials';
import { Check, Calendar, Clock, MapPin, Send, Phone, Mail, User, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const PREVIEW_SLOTS = [
  { day: 'Tuesday', time: '10:00 AM', label: 'Design Studio Consultation' },
  { day: 'Wednesday', time: '2:30 PM', label: 'Virtual Video Briefing' },
  { day: 'Thursday', time: '11:00 AM', label: 'On-Site Architectural Review' }
];

export default function ConsultationFlow({
  plannerState,
  onUpdateField,
  onReset,
  onBackToEstimator
}) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active specs from previous sections
  const activeTimber = TIMBER_MATERIALS.find(t => t.id === plannerState.cabinetFinish) || TIMBER_MATERIALS[0];
  const activeStyle = CABINET_STYLES.find(s => s.id === (plannerState.cabinetStyle || 'flat-panel')) || CABINET_STYLES[0];
  const activeLayout = CABINET_LAYOUTS.find(l => l.id === (plannerState.cabinetLayout || '3-door')) || CABINET_LAYOUTS[1];
  const activeHardware = HARDWARE_OPTIONS.find(h => h.id === (plannerState.hardware || 'brushed-brass')) || HARDWARE_OPTIONS[0];
  const activeBenchtop = COUNTERTOP_OPTIONS.find(b => b.id === (plannerState.benchtop || 'calacatta')) || COUNTERTOP_OPTIONS[0];

  const activeType = PROJECT_TYPES.find(p => p.id === plannerState.projectType) || PROJECT_TYPES[0];
  const activeTimeline = TIMELINES.find(t => t.id === plannerState.timeline) || TIMELINES[1];

  const budget = calculateBudgetRange({
    projectType: plannerState.projectType,
    size: plannerState.size,
    finishLevel: plannerState.finishLevel,
    features: plannerState.features,
    cabinetMultiplier: activeTimber.priceFactor,
    benchtopMultiplier: activeBenchtop.priceFactor,
    hardwareMultiplier: activeHardware.priceFactor
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#EC202B', '#111111', '#66615C', '#C4A47C']
      });
    } catch (err) {
      // ignore if not supported
    }
  };

  return (
    <section id="consultation" style={{
      backgroundColor: '#F5F3EF',
      padding: '100px 40px 100px 40px',
      borderBottom: '1px solid #D8D4CE',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {onBackToEstimator && (
          <div style={{ marginBottom: '28px' }}>
            <button
              onClick={onBackToEstimator}
              style={{
                background: 'none',
                border: 'none',
                color: '#66615C',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#EC202B'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#66615C'}
            >
              <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
              <span>← BACK TO ESTIMATE</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B' }} />
            <span className="label-tech" style={{ color: '#EC202B' }}>
              05 / CONSULT
            </span>
          </div>

          <h2 className="headline-section" style={{ color: '#111111', marginBottom: '8px' }}>
            DESIGN CONSULTATION & FEASIBILITY BRIEF
          </h2>

          <p style={{ color: '#66615C', fontSize: '1.02rem', maxWidth: '680px', lineHeight: 1.6 }}>
            A clearer starting point for your project, your investment and the conversation with the Sabra Projects team.
          </p>
        </div>

        {/* If Submitted: Architectural Confirmation Card */}
        {isSubmitted ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '56px 48px',
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(236, 32, 43, 0.08)',
              border: '1px solid #EC202B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: '#EC202B'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <div className="label-tech" style={{ color: '#EC202B', marginBottom: '8px' }}>
              BRIEF TRANSMITTED TO SENIOR DESIGN
            </div>

            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.4rem',
              fontWeight: 400,
              color: '#111111',
              marginBottom: '16px'
            }}>
              Thank You, {contactName || 'Valued Client'}.
            </h3>

            <p style={{
              fontSize: '1rem',
              color: '#66615C',
              maxWidth: '560px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6
            }}>
              Your design specification, material palette, and indicative investment range have been recorded. A senior project consultant from Sabra Projects will contact you shortly to confirm your consultation.
            </p>

            {/* Summary Ticket */}
            <div style={{
              backgroundColor: '#F5F3EF',
              border: '1px solid #D8D4CE',
              borderRadius: '2px',
              padding: '24px 32px',
              textAlign: 'left',
              maxWidth: '600px',
              margin: '0 auto 36px auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#66615C', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  Project Type
                </span>
                <strong style={{ color: '#111111' }}>{activeType.name}</strong>
              </div>
              <div>
                <span style={{ color: '#66615C', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  Indicative Investment
                </span>
                <strong style={{ color: '#EC202B' }}>{budget.formattedRange}</strong>
              </div>
              <div>
                <span style={{ color: '#66615C', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  Material & Style
                </span>
                <strong style={{ color: '#111111' }}>{activeTimber.name} · {activeStyle.name}</strong>
              </div>
              <div>
                <span style={{ color: '#66615C', fontSize: '0.72rem', textTransform: 'uppercase', display: 'block' }}>
                  Requested Availability
                </span>
                <strong style={{ color: '#111111' }}>
                  {PREVIEW_SLOTS[selectedSlotIndex].day} · {PREVIEW_SLOTS[selectedSlotIndex].time}
                </strong>
              </div>
            </div>

            <button
              onClick={onReset}
              className="btn-secondary"
              style={{ padding: '12px 28px', fontSize: '0.78rem' }}
            >
              <span>RESET PLANNER FOR NEW PROJECT</span>
            </button>
          </div>
        ) : (
          /* Main Layout: 4 Step Brief Form (Left) + Final Project Specification Card (Right) */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
            gap: '36px',
            alignItems: 'start'
          }} className="consultation-grid">
            <style>{`
              @media (max-width: 980px) {
                .consultation-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>

            {/* LEFT COLUMN: 4-STEP QUALIFIED BRIEF INPUTS & CONTACT FORM */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8D4CE',
              borderRadius: '2px',
              padding: '36px 40px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* 1. PROJECT TYPE (Pre-filled) */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111111' }}>
                      1. PROJECT TYPE
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#8E8A84' }}>Pre-filled from selections</span>
                  </div>
                  <select
                    value={plannerState.projectType}
                    onChange={(e) => onUpdateField('projectType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D8D4CE',
                      borderRadius: '2px',
                      fontSize: '0.88rem',
                      color: '#111111',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer'
                    }}
                  >
                    {PROJECT_TYPES.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.timeframe})</option>
                    ))}
                  </select>
                </div>

                {/* 2. SYDNEY SUBURB */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111111' }}>
                      2. SYDNEY SUBURB
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#8E8A84' }}>Local site location</span>
                  </div>

                  <input
                    type="text"
                    value={plannerState.suburb || ''}
                    onChange={(e) => onUpdateField('suburb', e.target.value)}
                    placeholder="e.g. Mosman, Paddington, Bellevue Hill, Balmain..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D8D4CE',
                      borderRadius: '2px',
                      fontSize: '0.88rem',
                      color: '#111111',
                      fontFamily: 'var(--font-sans)',
                      marginBottom: '10px'
                    }}
                  />

                  {/* Popular Suburb Quick Select Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {SYDNEY_SUBURBS.slice(0, 6).map(sub => (
                      <button
                        type="button"
                        key={sub.name}
                        onClick={() => onUpdateField('suburb', sub.name)}
                        style={{
                          background: plannerState.suburb === sub.name ? 'rgba(236, 32, 43, 0.08)' : '#F5F3EF',
                          border: '1px solid',
                          borderColor: plannerState.suburb === sub.name ? '#EC202B' : '#EAE6DF',
                          borderRadius: '2px',
                          padding: '4px 8px',
                          fontSize: '0.7rem',
                          color: plannerState.suburb === sub.name ? '#EC202B' : '#66615C',
                          cursor: 'pointer'
                        }}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. BUDGET (Pre-filled from estimator) */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111111' }}>
                      3. INDICATIVE INVESTMENT RANGE
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#8E8A84' }}>Calculated from Estimator</span>
                  </div>

                  <div style={{
                    backgroundColor: '#F5F3EF',
                    border: '1px solid #D8D4CE',
                    borderRadius: '2px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#66615C', textTransform: 'uppercase' }}>
                        Calculated Planning Range
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.45rem',
                        fontWeight: 600,
                        color: '#111111'
                      }}>
                        {budget.formattedRange}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      color: '#EC202B',
                      backgroundColor: 'rgba(236, 32, 43, 0.08)',
                      padding: '4px 10px',
                      borderRadius: '2px',
                      fontWeight: 600
                    }}>
                      LOCKED IN BRIEF
                    </span>
                  </div>
                </div>

                {/* 4. TIMELINE */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111111' }}>
                      4. TARGET TIMELINE
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#8E8A84' }}>Expected commencement</span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '10px'
                  }}>
                    {TIMELINES.map(time => {
                      const isSelected = plannerState.timeline === time.id;
                      return (
                        <div
                          key={time.id}
                          onClick={() => onUpdateField('timeline', time.id)}
                          style={{
                            backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                            border: '1px solid',
                            borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                            borderRadius: '2px',
                            padding: '12px 14px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#EC202B' : '#111111'
                          }}>
                            {time.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CONTACT DETAILS INPUTS */}
                <div style={{
                  paddingTop: '20px',
                  borderTop: '1px solid #EAE6DF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div className="label-tech" style={{ color: '#111111' }}>
                    YOUR CONTACT DETAILS
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '14px'
                  }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#66615C', display: 'block', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D8D4CE',
                          borderRadius: '2px',
                          fontSize: '0.84rem',
                          color: '#111111'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#66615C', display: 'block', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. eleanor@residence.com.au"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D8D4CE',
                          borderRadius: '2px',
                          fontSize: '0.84rem',
                          color: '#111111'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#66615C', display: 'block', marginBottom: '6px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. +61 400 000 000"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D8D4CE',
                        borderRadius: '2px',
                        fontSize: '0.84rem',
                        color: '#111111'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#66615C', display: 'block', marginBottom: '6px' }}>
                      Project Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={projectNotes}
                      onChange={(e) => setProjectNotes(e.target.value)}
                      placeholder="Any specific architectural details, builder references, or questions..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D8D4CE',
                        borderRadius: '2px',
                        fontSize: '0.84rem',
                        color: '#111111',
                        resize: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '0.86rem' }}
                >
                  <span>REQUEST CONSULTATION</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: COMPLETE PROJECT SPECIFICATION CARD + PREVIEW AVAILABILITY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* 16 — FINAL PROJECT SPECIFICATION CARD (Required structure) */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8D4CE',
                borderRadius: '2px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #EAE6DF',
                  marginBottom: '20px'
                }}>
                  <div>
                    <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.64rem' }}>
                      ARCHITECTURAL BRIEF
                    </span>
                    <h4 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.45rem',
                      fontWeight: 600,
                      color: '#111111',
                      marginTop: '2px'
                    }}>
                      PROJECT SPECIFICATION
                    </h4>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img src="/assets/image.png" alt="Sabra" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F5F3EF' }}>
                    <span style={{ color: '#66615C' }}>Material</span>
                    <strong style={{ color: '#111111' }}>{activeTimber.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F5F3EF' }}>
                    <span style={{ color: '#66615C' }}>Cabinet Style</span>
                    <strong style={{ color: '#111111' }}>{activeStyle.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F5F3EF' }}>
                    <span style={{ color: '#66615C' }}>Cabinet Layout</span>
                    <strong style={{ color: '#111111' }}>{activeLayout.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F5F3EF' }}>
                    <span style={{ color: '#66615C' }}>Hardware</span>
                    <strong style={{ color: '#111111' }}>{activeHardware.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F5F3EF' }}>
                    <span style={{ color: '#66615C' }}>Benchtop</span>
                    <strong style={{ color: '#111111' }}>{activeBenchtop.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F5F3EF' }}>
                    <span style={{ color: '#66615C' }}>Project Type</span>
                    <strong style={{ color: '#111111' }}>{activeType.name}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F5F3EF' }}>
                    <span style={{ color: '#66615C' }}>Timeline</span>
                    <strong style={{ color: '#111111' }}>{activeTimeline.label}</strong>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #D8D4CE',
                    marginTop: '6px'
                  }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#66615C', textTransform: 'uppercase' }}>
                      Indicative Investment
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: '#EC202B'
                    }}>
                      {budget.formattedRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* PREVIEW AVAILABILITY */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8D4CE',
                borderRadius: '2px',
                padding: '28px 32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.66rem' }}>
                    PREVIEW AVAILABILITY
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    color: '#8E8A84',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    DEMONSTRATIVE
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#66615C', marginBottom: '16px', lineHeight: 1.45 }}>
                  Select an indicative preference for your consultation. Time slots are demonstrative and confirmed directly by our studio team.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PREVIEW_SLOTS.map((slot, idx) => {
                    const isSelected = selectedSlotIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedSlotIndex(idx)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                          border: '1px solid',
                          borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                          borderRadius: '2px',
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isSelected ? '#EC202B' : '#111111' }}>
                            {slot.day} · {slot.time}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#66615C' }}>
                            {slot.label}
                          </div>
                        </div>

                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '1px solid',
                          borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                          backgroundColor: isSelected ? '#EC202B' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
