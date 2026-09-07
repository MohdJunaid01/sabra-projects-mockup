import React, { useState } from 'react';
import {
  PROJECT_TYPES,
  SIZES,
  FINISH_LEVELS,
  OPTIONAL_FEATURES,
  calculateBudgetRange
} from '../../data/estimatorData';
import {
  TIMBER_MATERIALS,
  CABINET_STYLES,
  CABINET_LAYOUTS,
  HARDWARE_OPTIONS,
  COUNTERTOP_OPTIONS
} from '../../data/materials';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function EstimatorFlow({
  plannerState,
  onUpdateField,
  onProceedToConsultation,
  onBackToDesign
}) {
  const [currentStep, setCurrentStep] = useState(1);

  // Active specs from Timber & Cabinet configuration
  const activeTimber = TIMBER_MATERIALS.find(t => t.id === plannerState.cabinetFinish) || TIMBER_MATERIALS[0];
  const activeStyle = CABINET_STYLES.find(s => s.id === (plannerState.cabinetStyle || 'flat-panel')) || CABINET_STYLES[0];
  const activeHardware = HARDWARE_OPTIONS.find(h => h.id === (plannerState.hardware || 'brushed-brass')) || HARDWARE_OPTIONS[0];
  const activeBenchtop = COUNTERTOP_OPTIONS.find(b => b.id === (plannerState.benchtop || 'calacatta')) || COUNTERTOP_OPTIONS[0];

  const budget = calculateBudgetRange({
    projectType: plannerState.projectType,
    size: plannerState.size,
    finishLevel: plannerState.finishLevel,
    features: plannerState.features,
    cabinetMultiplier: activeTimber.priceFactor,
    benchtopMultiplier: activeBenchtop.priceFactor,
    hardwareMultiplier: activeHardware.priceFactor
  });

  const toggleFeature = (featId) => {
    const existing = plannerState.features || [];
    if (existing.includes(featId)) {
      onUpdateField('features', existing.filter(id => id !== featId));
    } else {
      onUpdateField('features', [...existing, featId]);
    }
  };

  const stepsTotal = 4;

  return (
    <section id="estimator" style={{
      backgroundColor: '#F5F3EF',
      padding: '100px 40px 90px 40px',
      borderBottom: '1px solid #D8D4CE',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {onBackToDesign && (
          <div style={{ marginBottom: '28px' }}>
            <button
              onClick={onBackToDesign}
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
              <ArrowLeft size={16} />
              <span>← BACK TO CABINET DESIGN</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '36px',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B' }} />
              <span className="label-tech" style={{ color: '#EC202B' }}>
                04 / INVESTMENT
              </span>
            </div>

            <h2 className="headline-section" style={{ color: '#111111' }}>
              INDICATIVE INVESTMENT PLANNER
            </h2>

            <p style={{ color: '#66615C', fontSize: '1.02rem', maxWidth: '620px', marginTop: '8px', lineHeight: 1.6 }}>
              Transparent project planning based on your selected project type, materials and requirements.
            </p>
          </div>

          {/* Real-time calculated budget indicator */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
          }}>
            <div>
              <div style={{ fontSize: '0.66rem', letterSpacing: '0.12em', color: '#66615C', textTransform: 'uppercase', fontWeight: 600 }}>
                INDICATIVE PROJECT RANGE
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                fontWeight: 600,
                color: '#111111',
                lineHeight: 1.15
              }}>
                {budget.formattedRange}
              </div>
            </div>
            <span style={{
              fontSize: '0.7rem',
              color: '#EC202B',
              backgroundColor: 'rgba(236, 32, 43, 0.08)',
              border: '1px solid rgba(236, 32, 43, 0.2)',
              padding: '5px 10px',
              borderRadius: '2px',
              fontWeight: 600
            }}>
              LIVE RANGE
            </span>
          </div>
        </div>

        {/* Selected Project Configuration Bar (As required by prompt) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '16px 28px',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#111111', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CURRENT CONFIGURATION:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '0.84rem' }}>
            <span style={{ fontWeight: 700, color: '#111111', textTransform: 'uppercase' }}>
              {activeTimber.name}
            </span>
            <span style={{ color: '#D8D4CE' }}>·</span>
            <span style={{ fontWeight: 700, color: '#111111', textTransform: 'uppercase' }}>
              {activeStyle.name}
            </span>
            <span style={{ color: '#D8D4CE' }}>·</span>
            <span style={{ fontWeight: 700, color: '#111111', textTransform: 'uppercase' }}>
              {activeHardware.name}
            </span>
            <span style={{ color: '#D8D4CE' }}>·</span>
            <span style={{ fontWeight: 700, color: '#111111', textTransform: 'uppercase' }}>
              {activeBenchtop.name}
            </span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '28px'
        }}>
          {[1, 2, 3, 4].map(stepNum => (
            <div
              key={stepNum}
              onClick={() => setCurrentStep(stepNum)}
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: stepNum <= currentStep ? '#EC202B' : '#E0DCD6',
                cursor: 'pointer',
                transition: 'background-color 0.25s ease'
              }}
              title={`Question ${stepNum}`}
            />
          ))}
        </div>

        {/* Step Question Box Container */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '44px 48px',
          minHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
        }}>
          {/* STEP 1: PROJECT TYPE */}
          {currentStep === 1 && (
            <div>
              <div className="label-tech" style={{ color: '#EC202B', marginBottom: '8px' }}>
                QUESTION 1 OF 4 · SCOPE DEFINITION
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.9rem',
                fontWeight: 400,
                color: '#111111',
                marginBottom: '10px'
              }}>
                What type of project are you planning?
              </h3>
              <p style={{ color: '#66615C', fontSize: '0.94rem', marginBottom: '32px' }}>
                Select the project category that best matches your residential architectural requirements.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {PROJECT_TYPES.map(type => {
                  const isSelected = plannerState.projectType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => onUpdateField('projectType', type.id)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#D8D4CE';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111111' }}>
                          {type.name}
                        </div>
                        {isSelected && (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#EC202B',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#66615C', lineHeight: 1.5, marginBottom: '14px' }}>
                        {type.tagline}
                      </p>

                      <div style={{ fontSize: '0.72rem', color: '#8E8A84' }}>
                        Est. Timeframe: <strong style={{ color: '#111111' }}>{type.timeframe}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SIZE */}
          {currentStep === 2 && (
            <div>
              <div className="label-tech" style={{ color: '#EC202B', marginBottom: '8px' }}>
                QUESTION 2 OF 4 · SPATIAL FOOTPRINT
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.9rem',
                fontWeight: 400,
                color: '#111111',
                marginBottom: '10px'
              }}>
                What is the approximate size of your kitchen space?
              </h3>
              <p style={{ color: '#66615C', fontSize: '0.94rem', marginBottom: '32px' }}>
                Floorplan dimensions allow us to gauge linear joinery meterage and slab quantities.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px'
              }}>
                {SIZES.map(sz => {
                  const isSelected = plannerState.size === sz.id;
                  return (
                    <div
                      key={sz.id}
                      onClick={() => onUpdateField('size', sz.id)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#D8D4CE';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#111111' }}>
                          {sz.name}
                        </div>
                        {isSelected && (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#EC202B',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <div style={{
                        display: 'inline-block',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#EC202B',
                        backgroundColor: 'rgba(236, 32, 43, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '2px',
                        marginBottom: '12px'
                      }}>
                        {sz.dimension}
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#66615C', lineHeight: 1.5 }}>
                        {sz.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FINISH LEVEL */}
          {currentStep === 3 && (
            <div>
              <div className="label-tech" style={{ color: '#EC202B', marginBottom: '8px' }}>
                QUESTION 3 OF 4 · SPECIFICATION SPEC
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.9rem',
                fontWeight: 400,
                color: '#111111',
                marginBottom: '10px'
              }}>
                What finish specification level do you envision?
              </h3>
              <p style={{ color: '#66615C', fontSize: '0.94rem', marginBottom: '32px' }}>
                Refined baseline specifications through to custom architecturally detailed veneers and imported stone.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px'
              }}>
                {FINISH_LEVELS.map(fl => {
                  const isSelected = plannerState.finishLevel === fl.id;
                  return (
                    <div
                      key={fl.id}
                      onClick={() => onUpdateField('finishLevel', fl.id)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#D8D4CE';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#111111' }}>
                          {fl.name}
                        </div>
                        {isSelected && (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#EC202B',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#66615C', lineHeight: 1.5 }}>
                        {fl.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: OPTIONAL FEATURES */}
          {currentStep === 4 && (
            <div>
              <div className="label-tech" style={{ color: '#EC202B', marginBottom: '8px' }}>
                QUESTION 4 OF 4 · ARCHITECTURAL FEATURES
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.9rem',
                fontWeight: 400,
                color: '#111111',
                marginBottom: '10px'
              }}>
                Select any optional architectural features
              </h3>
              <p style={{ color: '#66615C', fontSize: '0.94rem', marginBottom: '32px' }}>
                Choose the bespoke elements you would like included in your indicative investment calculation.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px'
              }}>
                {OPTIONAL_FEATURES.map(feat => {
                  const isChecked = (plannerState.features || []).includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      style={{
                        backgroundColor: isChecked ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isChecked ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '22px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'flex-start'
                      }}
                      onMouseEnter={(e) => {
                        if (!isChecked) e.currentTarget.style.borderColor = '#111111';
                      }}
                      onMouseLeave={(e) => {
                        if (!isChecked) e.currentTarget.style.borderColor = '#D8D4CE';
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '2px',
                        border: '1px solid',
                        borderColor: isChecked ? '#EC202B' : '#D8D4CE',
                        backgroundColor: isChecked ? '#EC202B' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111111', marginBottom: '4px' }}>
                          {feat.name}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#66615C', lineHeight: 1.45, marginBottom: '8px' }}>
                          {feat.description}
                        </p>
                        <span style={{ fontSize: '0.72rem', color: '#111111', fontWeight: 600 }}>
                          + ${(feat.cost).toLocaleString()} AUD
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stepper Navigation */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '32px',
            marginTop: '32px',
            borderTop: '1px solid #EAE6DF',
            gap: '16px'
          }}>
            <div>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#66615C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#111111'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#66615C'}
                >
                  <ArrowLeft size={16} />
                  <span>PREVIOUS QUESTION</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {currentStep < stepsTotal ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '0.8rem' }}
                >
                  <span>NEXT QUESTION</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  onClick={onProceedToConsultation}
                  className="btn-primary"
                  style={{ padding: '14px 32px', fontSize: '0.84rem' }}
                >
                  <span>TAKE THE NEXT STEP</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Indicative Project Range Result Card */}
        <div style={{
          marginTop: '36px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '32px 40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <div className="label-tech" style={{ color: '#EC202B', marginBottom: '6px' }}>
              INDICATIVE PROJECT RANGE
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 600,
              color: '#111111',
              lineHeight: 1.1
            }}>
              {budget.formattedRange}
            </div>
            <p style={{
              fontSize: '0.82rem',
              color: '#66615C',
              marginTop: '8px',
              maxWidth: '620px',
              lineHeight: 1.5
            }}>
              Indicative project range — final pricing depends on design, materials and site requirements.
            </p>
          </div>

          <button
            onClick={onProceedToConsultation}
            className="btn-primary"
            style={{ padding: '15px 36px', fontSize: '0.84rem' }}
          >
            <span>TAKE THE NEXT STEP</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
