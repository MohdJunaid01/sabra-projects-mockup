import React, { useState, useEffect } from 'react';
import {
  TIMBER_MATERIALS,
  CABINET_STYLES,
  CABINET_LAYOUTS,
  HARDWARE_OPTIONS,
  COUNTERTOP_OPTIONS,
  LAMINATE_MATERIALS,
  PAINTED_MATERIALS,
  VENEER_MATERIALS,
  MATERIAL_CATEGORIES,
  getMaterialById
} from '../data/materials';
import { Check, ArrowRight, ArrowLeft, RotateCcw, Box, Layers, Sliders } from 'lucide-react';
import Interactive3DCabinet from './Interactive3DCabinet';
import { calculateEstimate, PRICING } from '../data/estimatorData';

// Precision Architectural 2D Elevation Cabinet Renderer with Pure White Studio Background
export function CabinetElevationRender({
  timber,
  styleId,
  layoutId,
  hardwareId,
  benchtopId,
  scale = 1,
  showDimensions = true
}) {
  const currentStyle = CABINET_STYLES.find(s => s.id === styleId) || CABINET_STYLES[0];
  const currentLayout = CABINET_LAYOUTS.find(l => l.id === layoutId) || CABINET_LAYOUTS[1];
  const currentHardware = HARDWARE_OPTIONS.find(h => h.id === hardwareId) || HARDWARE_OPTIONS[0];
  const currentBenchtop = COUNTERTOP_OPTIONS.find(b => b.id === benchtopId) || COUNTERTOP_OPTIONS[0];

  const doorCount = currentLayout.doorCount || 3;
  const hasDrawers = currentLayout.hasDrawers;

  // ViewBox geometry
  const width = 840;
  const height = 540;
  const benchtopHeight = 32;
  const carcassTop = 76;
  const carcassHeight = 370;
  const plinthHeight = 44;
  const plinthY = carcassTop + carcassHeight;
  const plinthIndent = 36;

  // Door span calculations
  const doorMargin = 16;
  const activeWidth = width - (doorMargin * 2);
  const gapWidth = 4;
  const totalGaps = (doorCount - 1) * gapWidth;
  const doorWidth = (activeWidth - totalGaps) / doorCount;

  // Drawer heights if drawer-door layout
  const drawerHeight = 92;
  const lowerDoorHeight = carcassHeight - drawerHeight - gapWidth;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      border: '1px solid #D8D4CE',
      borderRadius: '2px',
      padding: scale === 1 ? '36px 32px 28px 32px' : '48px 40px 36px 40px',
      position: 'relative'
    }}>
      {/* Studio Header & Architectural Dimension Labels */}
      {showDimensions && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '14px',
          borderBottom: '1px solid #EAE6DF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B', borderRadius: '50%' }} />
            <span className="label-tech" style={{ color: '#111111', fontSize: '0.66rem' }}>
              ARCHITECTURAL COMPONENT ELEVATION · PURE WHITE STUDIO CANVAS
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#66615C', letterSpacing: '0.04em' }}>
            <strong style={{ color: '#111111' }}>{timber.name}</strong> · {currentStyle.name} · {currentLayout.name} · {currentBenchtop.name}
          </div>
        </div>
      )}

      {/* SVG Canvas for precision vector joinery rendering on PURE WHITE */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', overflow: 'visible', margin: '0 auto' }}
      >
        <defs>
          {/* Soft architectural drop shadow for pure white studio depth */}
          <filter id={`soft-shadow-${scale}`} x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#111111" floodOpacity="0.08" />
          </filter>

          <filter id={`handle-shadow-${scale}`} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.22" />
          </filter>

          {/* Procedural fine timber grain lines */}
          <pattern id={`door-grain-${timber.id}-${scale}`} width="48" height="400" patternUnits="userSpaceOnUse">
            <line x1="8" y1="0" x2="10" y2="400" stroke={timber.grainColor} strokeWidth="1" strokeOpacity="0.35" />
            <line x1="20" y1="0" x2="18" y2="400" stroke={timber.grainColor} strokeWidth="1.4" strokeOpacity="0.28" />
            <line x1="32" y1="0" x2="34" y2="400" stroke={timber.highlightColor} strokeWidth="0.8" strokeOpacity="0.45" />
            <line x1="42" y1="0" x2="40" y2="400" stroke={timber.grainColor} strokeWidth="1" strokeOpacity="0.3" />
          </pattern>

          {/* Slatted wood batten pattern */}
          <pattern id={`slat-pattern-${timber.id}-${scale}`} width="18" height="400" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="13" height="400" fill={timber.baseColor} />
            <rect x="13" y="0" width="5" height="400" fill="#14110E" opacity="0.65" />
            <line x1="2" y1="0" x2="2" y2="400" stroke={timber.highlightColor} strokeWidth="0.8" opacity="0.4" />
            <line x1="7" y1="0" x2="7" y2="400" stroke={timber.grainColor} strokeWidth="1" opacity="0.3" />
          </pattern>

          {/* Benchtop stone gradient & veining */}
          <linearGradient id={`benchtop-grad-${benchtopId}-${scale}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentBenchtop.baseColor} />
            <stop offset="60%" stopColor={currentBenchtop.baseColor} />
            <stop offset="100%" stopColor={currentBenchtop.veinColor} stopOpacity="0.3" />
          </linearGradient>

          {/* Hardware metallic gradient */}
          <linearGradient id={`hardware-grad-${hardwareId}-${scale}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentHardware.color} />
            <stop offset="40%" stopColor={currentHardware.highlight} />
            <stop offset="100%" stopColor={currentHardware.color} />
          </linearGradient>
        </defs>

        {/* 1. Recessed Plinth / Kickboard with shadow line */}
        <rect
          x={plinthIndent}
          y={plinthY}
          width={width - (plinthIndent * 2)}
          height={plinthHeight}
          fill="#1C1B19"
        />
        <line
          x1={plinthIndent}
          y1={plinthY}
          x2={width - plinthIndent}
          y2={plinthY}
          stroke="#0D0C0B"
          strokeWidth="3"
        />

        {/* 2. Main Cabinet Carcass */}
        <rect
          x="12"
          y={carcassTop}
          width={width - 24}
          height={carcassHeight}
          fill={timber.baseColor}
          filter={`url(#soft-shadow-${scale})`}
        />
        <rect
          x="12"
          y={carcassTop}
          width={width - 24}
          height={carcassHeight}
          fill={`url(#door-grain-${timber.id}-${scale})`}
          opacity="0.65"
        />

        {/* 3. Door & Drawer Elevation Panels */}
        {Array.from({ length: doorCount }).map((_, i) => {
          const xPos = doorMargin + (i * (doorWidth + gapWidth));

          if (hasDrawers) {
            // Render upper drawer + lower door
            return (
              <g key={`col-${i}`}>
                {/* Upper Drawer */}
                <g>
                  <rect
                    x={xPos}
                    y={carcassTop + 6}
                    width={doorWidth}
                    height={drawerHeight}
                    fill={styleId === 'slatted' ? `url(#slat-pattern-${timber.id}-${scale})` : timber.baseColor}
                    stroke="#1C1814"
                    strokeWidth="0.8"
                  />
                  {styleId !== 'slatted' && (
                    <rect
                      x={xPos}
                      y={carcassTop + 6}
                      width={doorWidth}
                      height={drawerHeight}
                      fill={`url(#door-grain-${timber.id}-${scale})`}
                      opacity="0.8"
                    />
                  )}

                  {/* Shaker / Framed Inset */}
                  {(styleId === 'shaker' || styleId === 'framed') && (
                    <rect
                      x={xPos + 10}
                      y={carcassTop + 16}
                      width={doorWidth - 20}
                      height={drawerHeight - 20}
                      fill="none"
                      stroke={timber.grainColor}
                      strokeWidth={styleId === 'shaker' ? 2 : 1}
                      strokeOpacity="0.6"
                    />
                  )}

                  {/* Drawer Horizontal Handle */}
                  {hardwareId !== 'handleless' && (
                    <rect
                      x={xPos + (doorWidth / 2) - 26}
                      y={carcassTop + (drawerHeight / 2) - 3}
                      width="52"
                      height="7"
                      rx="2"
                      fill={`url(#hardware-grad-${hardwareId}-${scale})`}
                      filter={`url(#handle-shadow-${scale})`}
                    />
                  )}
                  {hardwareId === 'handleless' && (
                    <line
                      x1={xPos + 8}
                      y1={carcassTop + 12}
                      x2={xPos + doorWidth - 8}
                      y2={carcassTop + 12}
                      stroke="#141210"
                      strokeWidth="3.5"
                    />
                  )}
                </g>

                {/* Lower Door */}
                <g>
                  <rect
                    x={xPos}
                    y={carcassTop + drawerHeight + gapWidth + 6}
                    width={doorWidth}
                    height={lowerDoorHeight - 12}
                    fill={styleId === 'slatted' ? `url(#slat-pattern-${timber.id}-${scale})` : timber.baseColor}
                    stroke="#1C1814"
                    strokeWidth="0.8"
                  />
                  {styleId !== 'slatted' && (
                    <rect
                      x={xPos}
                      y={carcassTop + drawerHeight + gapWidth + 6}
                      width={doorWidth}
                      height={lowerDoorHeight - 12}
                      fill={`url(#door-grain-${timber.id}-${scale})`}
                      opacity="0.8"
                    />
                  )}

                  {/* Shaker / Framed Inset */}
                  {(styleId === 'shaker' || styleId === 'framed') && (
                    <rect
                      x={xPos + 12}
                      y={carcassTop + drawerHeight + gapWidth + 18}
                      width={doorWidth - 24}
                      height={lowerDoorHeight - 36}
                      fill="none"
                      stroke={timber.grainColor}
                      strokeWidth={styleId === 'shaker' ? 3 : 1.2}
                      strokeOpacity="0.6"
                    />
                  )}

                  {/* Vertical Handle */}
                  {hardwareId !== 'handleless' && (
                    <rect
                      x={i % 2 === 0 ? (xPos + doorWidth - 20) : (xPos + 14)}
                      y={carcassTop + drawerHeight + gapWidth + 32}
                      width="6"
                      height="64"
                      rx="2"
                      fill={`url(#hardware-grad-${hardwareId}-${scale})`}
                      filter={`url(#handle-shadow-${scale})`}
                    />
                  )}
                  {hardwareId === 'handleless' && (
                    <line
                      x1={xPos + 8}
                      y1={carcassTop + drawerHeight + gapWidth + 12}
                      x2={xPos + doorWidth - 8}
                      y2={carcassTop + drawerHeight + gapWidth + 12}
                      stroke="#141210"
                      strokeWidth="3.5"
                    />
                  )}
                </g>
              </g>
            );
          }

          // Full Height Doors (2, 3, or 4 door layouts)
          return (
            <g key={`door-${i}`}>
              {/* Main Door Face */}
              <rect
                x={xPos}
                y={carcassTop + 6}
                width={doorWidth}
                height={carcassHeight - 12}
                fill={styleId === 'slatted' ? `url(#slat-pattern-${timber.id}-${scale})` : timber.baseColor}
                stroke="#1C1814"
                strokeWidth="0.8"
              />
              {styleId !== 'slatted' && (
                <rect
                  x={xPos}
                  y={carcassTop + 6}
                  width={doorWidth}
                  height={carcassHeight - 12}
                  fill={`url(#door-grain-${timber.id}-${scale})`}
                  opacity="0.8"
                />
              )}

              {/* Shaker Inset Center Panel */}
              {styleId === 'shaker' && (
                <g>
                  <rect
                    x={xPos + 14}
                    y={carcassTop + 20}
                    width={doorWidth - 28}
                    height={carcassHeight - 40}
                    fill={timber.baseColor}
                    stroke={timber.grainColor}
                    strokeWidth="2.5"
                    strokeOpacity="0.5"
                  />
                  <rect
                    x={xPos + 14}
                    y={carcassTop + 20}
                    width={doorWidth - 28}
                    height={carcassHeight - 40}
                    fill={`url(#door-grain-${timber.id}-${scale})`}
                    opacity="0.65"
                  />
                </g>
              )}

              {/* Framed Shadowline Edge */}
              {styleId === 'framed' && (
                <rect
                  x={xPos + 8}
                  y={carcassTop + 14}
                  width={doorWidth - 16}
                  height={carcassHeight - 28}
                  fill="none"
                  stroke={timber.highlightColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                />
              )}

              {/* Handles */}
              {hardwareId !== 'handleless' && (
                <rect
                  x={i % 2 === 0 ? (xPos + doorWidth - 20) : (xPos + 14)}
                  y={carcassTop + (carcassHeight / 2) - 40}
                  width="6"
                  height="80"
                  rx="2"
                  fill={`url(#hardware-grad-${hardwareId}-${scale})`}
                  filter={`url(#handle-shadow-${scale})`}
                />
              )}

              {/* Handleless J-Pull Shadow Channel */}
              {hardwareId === 'handleless' && (
                <line
                  x1={xPos + 6}
                  y1={carcassTop + 14}
                  x2={xPos + doorWidth - 6}
                  y2={carcassTop + 14}
                  stroke="#141210"
                  strokeWidth="3.5"
                />
              )}
            </g>
          );
        })}

        {/* 4. Countertop Slab on Top with Stone Texture */}
        <g filter={`url(#soft-shadow-${scale})`}>
          <rect
            x="4"
            y={carcassTop - benchtopHeight}
            width={width - 8}
            height={benchtopHeight}
            fill={`url(#benchtop-grad-${benchtopId}-${scale})`}
            stroke={currentBenchtop.veinColor}
            strokeWidth="0.8"
          />

          {benchtopId === 'calacatta' && (
            <g stroke={currentBenchtop.veinColor} strokeWidth="1.5" fill="none" opacity="0.45">
              <path d="M 40,50 Q 160,60 240,68 T 420,56" />
              <path d="M 380,52 Q 480,66 620,58 T 780,70" stroke={currentBenchtop.goldVein} strokeWidth="1" />
            </g>
          )}

          {benchtopId === 'travertine' && (
            <g stroke={currentBenchtop.goldVein} strokeWidth="1" fill="none" opacity="0.5">
              <line x1="8" y1="54" x2="832" y2="54" strokeDasharray="16,8,24,6" />
              <line x1="8" y1="62" x2="832" y2="62" strokeDasharray="30,12,18,10" />
            </g>
          )}

          {benchtopId === 'charcoal' && (
            <g stroke="#EAE6DF" strokeWidth="0.8" fill="none" opacity="0.35">
              <path d="M 120,56 L 280,62 M 450,52 L 680,60" strokeDasharray="6,4" />
            </g>
          )}

          {/* Shadow beneath countertop */}
          <rect
            x="10"
            y={carcassTop}
            width={width - 20}
            height="5"
            fill="#0E0D0B"
            opacity="0.35"
          />
        </g>
      </svg>
    </div>
  );
}

// Visual Architectural Diagram Icon for Component Controls
function ComponentVisualDiagram({ type, id, isSelected }) {
  if (type === 'style') {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
        <rect x="2" y="2" width="32" height="32" fill="#F5F3EF" stroke={isSelected ? '#EC202B' : '#D8D4CE'} strokeWidth="1" />
        {id === 'flat-panel' && (
          <line x1="18" y1="2" x2="18" y2="34" stroke="#8E8A84" strokeWidth="1" />
        )}
        {id === 'shaker' && (
          <rect x="6" y="6" width="24" height="24" fill="none" stroke={isSelected ? '#EC202B' : '#8E8A84'} strokeWidth="1.2" />
        )}
        {id === 'slatted' && (
          <g stroke={isSelected ? '#EC202B' : '#8E8A84'} strokeWidth="1">
            <line x1="7" y1="4" x2="7" y2="32" />
            <line x1="14" y1="4" x2="14" y2="32" />
            <line x1="21" y1="4" x2="21" y2="32" />
            <line x1="28" y1="4" x2="28" y2="32" />
          </g>
        )}
        {id === 'framed' && (
          <rect x="4" y="4" width="28" height="28" fill="none" stroke={isSelected ? '#EC202B' : '#8E8A84'} strokeWidth="1" strokeDasharray="2,2" />
        )}
      </svg>
    );
  }

  if (type === 'layout') {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: 'block', flexShrink: 0 }}>
        <rect x="2" y="2" width="32" height="32" fill="#F5F3EF" stroke={isSelected ? '#EC202B' : '#D8D4CE'} strokeWidth="1" />
        {id === '2-door' && (
          <line x1="18" y1="2" x2="18" y2="34" stroke={isSelected ? '#EC202B' : '#8E8A84'} strokeWidth="1.2" />
        )}
        {id === '3-door' && (
          <g stroke={isSelected ? '#EC202B' : '#8E8A84'} strokeWidth="1.2">
            <line x1="12" y1="2" x2="12" y2="34" />
            <line x1="24" y1="2" x2="24" y2="34" />
          </g>
        )}
        {id === '4-door' && (
          <g stroke={isSelected ? '#EC202B' : '#8E8A84'} strokeWidth="1">
            <line x1="10" y1="2" x2="10" y2="34" />
            <line x1="18" y1="2" x2="18" y2="34" />
            <line x1="26" y1="2" x2="26" y2="34" />
          </g>
        )}
        {id === 'drawer-door' && (
          <g stroke={isSelected ? '#EC202B' : '#8E8A84'} strokeWidth="1.2">
            <line x1="2" y1="12" x2="34" y2="12" />
            <line x1="18" y1="12" x2="18" y2="34" />
          </g>
        )}
      </svg>
    );
  }

  return null;
}

export default function CabinetDesignPage({
  plannerState,
  onUpdateField,
  onBackToMaterials,
  onProceedToEstimator,
  onProceedToConsultation
}) {
  const [selectedCategory, setSelectedCategory] = useState(plannerState.materialType || 'timber');
  const [viewMode, setViewMode] = useState('3D');
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Synchronize category with plannerState if user navigated with a specific material
  useEffect(() => {
    if (plannerState.materialType) {
      setSelectedCategory(plannerState.materialType);
    } else if (plannerState.cabinetFinish) {
      if (TIMBER_MATERIALS.some(t => t.id === plannerState.cabinetFinish)) {
        setSelectedCategory('timber');
      } else if (LAMINATE_MATERIALS.some(l => l.id === plannerState.cabinetFinish)) {
        setSelectedCategory('laminate');
      } else if (PAINTED_MATERIALS.some(p => p.id === plannerState.cabinetFinish)) {
        setSelectedCategory('painted');
      } else if (VENEER_MATERIALS.some(v => v.id === plannerState.cabinetFinish)) {
        setSelectedCategory('veneer');
      } else if (COUNTERTOP_OPTIONS.some(c => c.id === plannerState.cabinetFinish)) {
        setSelectedCategory('stone');
      }
    }
  }, [plannerState.materialType, plannerState.cabinetFinish]);

  // Central deterministic pricing calculation
  const estimate = calculateEstimate(plannerState);

  // Smooth 300–500ms transition for indicative estimate range
  const [animatedLow, setAnimatedLow] = useState(estimate.low);
  const [animatedHigh, setAnimatedHigh] = useState(estimate.high);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 400; // ms
    const startLow = animatedLow;
    const startHigh = animatedHigh;
    const deltaLow = estimate.low - startLow;
    const deltaHigh = estimate.high - startHigh;

    if (deltaLow === 0 && deltaHigh === 0) return;

    let frameId;
    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedLow(Math.round(startLow + deltaLow * ease));
      setAnimatedHigh(Math.round(startHigh + deltaHigh * ease));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [estimate.low, estimate.high]);

  const displayRange = `$${Math.round(animatedLow / 1000)}K — $${Math.round(animatedHigh / 1000)}K AUD`;

  // Resolve current active selection models
  const selectedMaterial = getMaterialById(plannerState.cabinetFinish || 'smoked-oak');
  const currentStyle = CABINET_STYLES.find(s => s.id === (plannerState.cabinetStyle || 'slatted')) || CABINET_STYLES[2];
  const currentLayout = CABINET_LAYOUTS.find(l => l.id === (plannerState.cabinetLayout || '3-door')) || CABINET_LAYOUTS[1];
  const currentHardware = HARDWARE_OPTIONS.find(h => h.id === (plannerState.hardware || 'brushed-brass')) || HARDWARE_OPTIONS[0];
  const currentBenchtop = COUNTERTOP_OPTIONS.find(b => b.id === (plannerState.benchtop || 'calacatta')) || COUNTERTOP_OPTIONS[0];

  const currentCategoryMeta = MATERIAL_CATEGORIES.find(c => c.id === selectedCategory) || MATERIAL_CATEGORIES[0];

  // Resolve materials belonging to active category
  let materialsInCategory = TIMBER_MATERIALS;
  if (selectedCategory === 'timber') {
    materialsInCategory = TIMBER_MATERIALS;
  } else if (selectedCategory === 'stone') {
    materialsInCategory = COUNTERTOP_OPTIONS.map(c => ({
      ...c,
      species: c.type,
      finish: 'Architectural Stone Slab',
      grainColor: c.veinColor,
      highlightColor: c.goldVein || c.baseColor,
      grainType: 'wide-wave',
      code: `S / ${c.name.toUpperCase()}`
    }));
  } else if (selectedCategory === 'laminate') {
    materialsInCategory = LAMINATE_MATERIALS;
  } else if (selectedCategory === 'painted') {
    materialsInCategory = PAINTED_MATERIALS;
  } else if (selectedCategory === 'veneer') {
    materialsInCategory = VENEER_MATERIALS;
  }

  const handleSelectMaterial = (mat) => {
    onUpdateField('cabinetFinish', mat.id);
    onUpdateField('materialType', selectedCategory);
    if (selectedCategory === 'stone') {
      onUpdateField('benchtop', mat.id);
    }
  };

  return (
    <div style={{
      backgroundColor: '#F5F3EF',
      minHeight: '100vh',
      padding: '36px 32px 80px 32px'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* 10 — TOP HEADER & BREADCRUMB */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          gap: '20px'
        }}>
          <button
            onClick={onBackToMaterials}
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
              textTransform: 'uppercase',
              padding: '6px 0'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#EC202B'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#66615C'}
          >
            <ArrowLeft size={16} />
            <span>← BACK TO MATERIALS</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B', borderRadius: '50%' }} />
            <span className="label-tech" style={{ color: '#EC202B' }}>
              03 / DESIGN
            </span>
          </div>
        </div>

        {/* 10 — TITLE & MATERIAL STATUS BANNER */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '1px solid #D8D4CE',
          gap: '24px'
        }}>
          <div>
            <h1 className="headline-section" style={{ color: '#111111', marginBottom: '8px' }}>
              DESIGN YOUR CABINET.
            </h1>
            <p style={{ color: '#66615C', fontSize: '1rem', maxWidth: '640px', lineHeight: 1.6 }}>
              The left panel controls your material finish. The right panel customizes joinery components. The center canvas presents your live 3D cabinet on a pure white studio stage.
            </p>
          </div>

          {/* Selected Material Card with Left-Panel Hint */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              backgroundColor: selectedMaterial.baseColor,
              borderRadius: '2px',
              border: '1px solid #D8D4CE',
              flexShrink: 0,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)'
            }} />

            <div>
              <span style={{ fontSize: '0.62rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                SELECTED MATERIAL · {selectedMaterial.code || 'FINISH'}
              </span>
              <strong style={{ color: '#111111', fontSize: '1.02rem', display: 'block' }}>
                {selectedMaterial.name}
              </strong>
              <span style={{ fontSize: '0.7rem', color: '#EC202B', fontWeight: 600 }}>
                You can change the material from the panel on the left.
              </span>
            </div>
          </div>
        </div>

        {/* 02 — NEW THREE-COLUMN CONFIGURATION INTERFACE */}
        <div className="designer-three-column-grid" style={{
          display: 'grid',
          gridTemplateColumns: '290px minmax(0, 1.45fr) 330px',
          gap: '22px',
          alignItems: 'start',
          marginBottom: '44px'
        }}>
          <style>{`
            @media (max-width: 1280px) {
              .designer-three-column-grid {
                grid-template-columns: 270px minmax(0, 1.3fr) 310px !important;
                gap: 16px !important;
              }
            }
            @media (max-width: 1040px) {
              .designer-three-column-grid {
                grid-template-columns: 1fr !important;
              }
              .designer-col-left,
              .designer-col-center,
              .designer-col-right {
                height: auto !important;
                min-height: auto !important;
              }
              .designer-scroll-area {
                max-height: 440px !important;
              }
            }
          `}</style>

          {/* =========================================================================
              03, 04, 05 — LEFT COLUMN: MATERIALS PANEL (WHAT MATERIAL DO I WANT?)
             ========================================================================= */}
          <div className="designer-col-left" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '24px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            height: '660px'
          }}>
            {/* Panel Heading */}
            <div style={{ paddingBottom: '12px', borderBottom: '1px solid #EAE6DF', marginBottom: '14px' }}>
              <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.64rem' }}>
                SELECT YOUR MATERIAL
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#111111',
                marginTop: '2px'
              }}>
                MATERIALS
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#8E8A84' }}>
                Material Type & Architectural Finishes
              </span>
            </div>

            {/* Material Type Category Pills: TIMBER, STONE, LAMINATE, PAINTED, VENEER */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '14px',
              paddingBottom: '12px',
              borderBottom: '1px solid #EAE6DF'
            }}>
              {MATERIAL_CATEGORIES.map(cat => {
                const isCatActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      backgroundColor: isCatActive ? '#111111' : '#FFFFFF',
                      color: isCatActive ? '#FFFFFF' : '#66615C',
                      border: '1px solid',
                      borderColor: isCatActive ? '#111111' : '#D8D4CE',
                      borderRadius: '2px',
                      padding: '5px 9px',
                      fontSize: '0.66rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCatActive) {
                        e.currentTarget.style.borderColor = '#111111';
                        e.currentTarget.style.color = '#111111';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCatActive) {
                        e.currentTarget.style.borderColor = '#D8D4CE';
                        e.currentTarget.style.color = '#66615C';
                      }
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Active Category Tagline */}
            <div style={{
              fontSize: '0.7rem',
              color: '#66615C',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              {currentCategoryMeta?.description}
            </div>

            {/* Scrollable Material Swatches List */}
            <div className="designer-scroll-area" style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {materialsInCategory.map(mat => {
                const isSelected = plannerState.cabinetFinish === mat.id;
                return (
                  <div
                    key={mat.id}
                    onClick={() => handleSelectMaterial(mat)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                      border: '1px solid',
                      borderColor: isSelected ? '#EC202B' : '#EAE6DF',
                      borderRadius: '2px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#EAE6DF';
                    }}
                  >
                    {/* Small Visual Material Swatch */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: mat.baseColor,
                      borderRadius: '2px',
                      border: '1px solid #D8D4CE',
                      flexShrink: 0,
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)'
                    }} />

                    {/* Name & Code */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: isSelected ? '#EC202B' : '#111111',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {mat.name}
                      </div>
                      <span style={{
                        fontSize: '0.64rem',
                        color: '#8E8A84',
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        {mat.code || mat.finish?.split(' ')[0]}
                      </span>
                    </div>

                    {/* Sabra Red Checkmark Indicator */}
                    {isSelected && (
                      <div style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#EC202B',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              06, 07, 16 — CENTER COLUMN: THE ONLY CABINET VIEWPORT WITH [ 2D ] [ 3D ] SWITCH
             ========================================================================= */}
          <div className="designer-col-center" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '24px 20px 18px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '660px'
          }}>
            {/* Viewport Top Header Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              paddingBottom: '12px',
              borderBottom: '1px solid #EAE6DF',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B', borderRadius: '50%' }} />
                <span className="label-tech" style={{ color: '#111111', fontSize: '0.66rem' }}>
                  {viewMode === '3D' ? 'INTERACTIVE 3D CABINET' : 'ARCHITECTURAL 2D ELEVATION'} · PURE WHITE STUDIO CANVAS
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: '#66615C', letterSpacing: '0.04em' }}>
                  <strong style={{ color: '#111111' }}>{selectedMaterial.name}</strong> · {currentStyle.name} · {currentLayout.name}
                </div>

                {/* [ 2D ] [ 3D ] TOGGLE IN HEADER */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  backgroundColor: '#F5F3EF',
                  padding: '3px',
                  borderRadius: '2px',
                  border: '1px solid #D8D4CE'
                }}>
                  <button
                    onClick={() => setViewMode('2D')}
                    style={{
                      backgroundColor: viewMode === '2D' ? '#111111' : 'transparent',
                      color: viewMode === '2D' ? '#FFFFFF' : '#66615C',
                      border: 'none',
                      padding: '4px 10px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    2D
                  </button>
                  <button
                    onClick={() => setViewMode('3D')}
                    style={{
                      backgroundColor: viewMode === '3D' ? '#111111' : 'transparent',
                      color: viewMode === '3D' ? '#FFFFFF' : '#66615C',
                      border: 'none',
                      padding: '4px 10px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    3D
                  </button>
                </div>
              </div>
            </div>

            {/* THE ONLY CABINET VIEWPORT ON THE PAGE (Pure White Background #FFFFFF) */}
            <div style={{ flex: 1, position: 'relative', minHeight: 0, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
              {/* Floating 2D / 3D Switch Button directly next to the pure white canvas */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '16px',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #D8D4CE',
                borderRadius: '2px',
                padding: '3px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}>
                <button
                  onClick={() => setViewMode('2D')}
                  style={{
                    backgroundColor: viewMode === '2D' ? '#111111' : 'transparent',
                    color: viewMode === '2D' ? '#FFFFFF' : '#66615C',
                    border: 'none',
                    padding: '5px 12px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={13} />
                  <span>2D VIEW</span>
                </button>
                <button
                  onClick={() => setViewMode('3D')}
                  style={{
                    backgroundColor: viewMode === '3D' ? '#111111' : 'transparent',
                    color: viewMode === '3D' ? '#FFFFFF' : '#66615C',
                    border: 'none',
                    padding: '5px 12px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Box size={13} />
                  <span>3D VIEW</span>
                </button>
              </div>

              {viewMode === '3D' ? (
                <Interactive3DCabinet
                  timberId={plannerState.cabinetFinish || 'smoked-oak'}
                  styleId={plannerState.cabinetStyle || 'slatted'}
                  layoutId={plannerState.cabinetLayout || '3-door'}
                  hardwareId={plannerState.hardware || 'brushed-brass'}
                  benchtopId={plannerState.benchtop || 'calacatta'}
                  height="100%"
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  padding: '8px'
                }}>
                  <CabinetElevationRender
                    timber={selectedMaterial}
                    styleId={plannerState.cabinetStyle || 'slatted'}
                    layoutId={plannerState.cabinetLayout || '3-door'}
                    hardwareId={plannerState.hardware || 'brushed-brass'}
                    benchtopId={plannerState.benchtop || 'calacatta'}
                    scale={0.88}
                    showDimensions={false}
                  />
                </div>
              )}
            </div>

            {/* Viewport Under-Caption & Dynamic Specification Line */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid #EAE6DF',
              fontSize: '0.68rem',
              color: '#8E8A84',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              <span style={{ fontWeight: 600, color: '#111111' }}>
                {viewMode === '3D' ? 'DRAG TO ROTATE  ·  SCROLL TO ZOOM' : 'PRECISION ORTHOGRAPHIC 2D ELEVATION'}
              </span>
              <span style={{ letterSpacing: '0.08em' }}>
                {selectedMaterial.name.toUpperCase()} / {currentStyle.name.toUpperCase()} / {currentLayout.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* =========================================================================
              08 — RIGHT COLUMN: CABINET COMPONENTS PANEL (HOW DO I WANT IT BUILT?)
             ========================================================================= */}
          <div className="designer-col-right" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '24px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            height: '660px'
          }}>
            {/* Panel Heading */}
            <div style={{ paddingBottom: '12px', borderBottom: '1px solid #EAE6DF', marginBottom: '14px' }}>
              <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.64rem' }}>
                JOINERY SPECIFICATION
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#111111',
                marginTop: '2px'
              }}>
                COMPONENTS
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#8E8A84' }}>
                Instant Real-Time 3D Geometry Updates
              </span>
            </div>

            {/* Scrollable Component Options */}
            <div className="designer-scroll-area" style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* 1. CABINET STYLE */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="label-tech" style={{ color: '#111111', fontSize: '0.68rem' }}>
                    CABINET STYLE
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#EC202B', fontWeight: 600 }}>
                    {currentStyle.name}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {CABINET_STYLES.map(st => {
                    const isSelected = (plannerState.cabinetStyle || 'slatted') === st.id;
                    return (
                      <div
                        key={st.id}
                        onClick={() => onUpdateField('cabinetStyle', st.id)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                          border: '1px solid',
                          borderColor: isSelected ? '#EC202B' : '#EAE6DF',
                          borderRadius: '2px',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#EAE6DF';
                        }}
                      >
                        <ComponentVisualDiagram type="style" id={st.id} isSelected={isSelected} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? '#EC202B' : '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {st.name}
                          </div>
                          <span style={{ fontSize: '0.62rem', color: '#8E8A84', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {st.tagline}
                          </span>
                        </div>
                        {isSelected && <Check size={13} color="#EC202B" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. CABINET LAYOUT */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="label-tech" style={{ color: '#111111', fontSize: '0.68rem' }}>
                    LAYOUT
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#EC202B', fontWeight: 600 }}>
                    {currentLayout.name}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {CABINET_LAYOUTS.map(ly => {
                    const isSelected = (plannerState.cabinetLayout || '3-door') === ly.id;
                    return (
                      <div
                        key={ly.id}
                        onClick={() => onUpdateField('cabinetLayout', ly.id)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                          border: '1px solid',
                          borderColor: isSelected ? '#EC202B' : '#EAE6DF',
                          borderRadius: '2px',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#EAE6DF';
                        }}
                      >
                        <ComponentVisualDiagram type="layout" id={ly.id} isSelected={isSelected} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? '#EC202B' : '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ly.name}
                          </div>
                          <span style={{ fontSize: '0.62rem', color: '#8E8A84', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ly.tagline}
                          </span>
                        </div>
                        {isSelected && <Check size={13} color="#EC202B" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. HARDWARE */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="label-tech" style={{ color: '#111111', fontSize: '0.68rem' }}>
                    HARDWARE
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#EC202B', fontWeight: 600 }}>
                    {currentHardware.name}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {HARDWARE_OPTIONS.map(hw => {
                    const isSelected = (plannerState.hardware || 'brushed-brass') === hw.id;
                    return (
                      <div
                        key={hw.id}
                        onClick={() => onUpdateField('hardware', hw.id)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                          border: '1px solid',
                          borderColor: isSelected ? '#EC202B' : '#EAE6DF',
                          borderRadius: '2px',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#EAE6DF';
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          backgroundColor: hw.color,
                          borderRadius: '50%',
                          border: '1px solid #D8D4CE',
                          flexShrink: 0
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? '#EC202B' : '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {hw.name}
                          </div>
                          <span style={{ fontSize: '0.62rem', color: '#8E8A84', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {hw.finish.split(' ')[0]}
                          </span>
                        </div>
                        {isSelected && <Check size={13} color="#EC202B" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. BENCHTOP */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="label-tech" style={{ color: '#111111', fontSize: '0.68rem' }}>
                    BENCHTOP
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#EC202B', fontWeight: 600 }}>
                    {currentBenchtop.name}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {COUNTERTOP_OPTIONS.map(ct => {
                    const isSelected = (plannerState.benchtop || 'calacatta') === ct.id;
                    return (
                      <div
                        key={ct.id}
                        onClick={() => onUpdateField('benchtop', ct.id)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                          border: '1px solid',
                          borderColor: isSelected ? '#EC202B' : '#EAE6DF',
                          borderRadius: '2px',
                          padding: '8px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = '#EAE6DF';
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          backgroundColor: ct.baseColor,
                          borderRadius: '2px',
                          border: '1px solid #D8D4CE',
                          flexShrink: 0
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? '#EC202B' : '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ct.name}
                          </div>
                          <span style={{ fontSize: '0.62rem', color: '#8E8A84', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ct.type.split(' ')[0]}
                          </span>
                        </div>
                        {isSelected && <Check size={13} color="#EC202B" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            11 — COMPACT SPECIFICATION STRIP (NO LOWER RENDER)
           ========================================================================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '28px 36px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #EAE6DF'
          }}>
            <div>
              <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.64rem' }}>
                ARCHITECTURAL JOINERY SCHEDULE
              </span>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 600,
                color: '#111111',
                marginTop: '2px'
              }}>
                YOUR SPECIFICATION
              </h3>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8E8A84', letterSpacing: '0.06em' }}>
              SABRA PROJECTS · ARCHITECTURAL JOINERY
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <span style={{ fontSize: '0.66rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                MATERIAL
              </span>
              <strong style={{ fontSize: '0.94rem', color: '#111111', display: 'block' }}>
                {selectedMaterial.name}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#66615C' }}>
                {selectedMaterial.species || selectedMaterial.finish}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.66rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                STYLE
              </span>
              <strong style={{ fontSize: '0.94rem', color: '#111111', display: 'block' }}>
                {currentStyle.name}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#66615C' }}>
                {currentStyle.tagline}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.66rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                LAYOUT
              </span>
              <strong style={{ fontSize: '0.94rem', color: '#111111', display: 'block' }}>
                {currentLayout.name}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#66615C' }}>
                {currentLayout.tagline}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.66rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                HARDWARE
              </span>
              <strong style={{ fontSize: '0.94rem', color: '#111111', display: 'block' }}>
                {currentHardware.name}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#66615C' }}>
                {currentHardware.finish}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.66rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                BENCHTOP
              </span>
              <strong style={{ fontSize: '0.94rem', color: '#111111', display: 'block' }}>
                {currentBenchtop.name}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#66615C' }}>
                {currentBenchtop.type}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            14, 15, 24, 25 — 04 / INVESTMENT: DYNAMIC ESTIMATE & ITEMISED BREAKDOWN
           ========================================================================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '36px 44px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
          marginBottom: '32px'
        }}>
          {/* Section Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B', borderRadius: '50%' }} />
            <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.66rem' }}>
              04 / INVESTMENT
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '28px'
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.9rem',
                fontWeight: 400,
                color: '#111111',
                marginBottom: '6px'
              }}>
                INDICATIVE ESTIMATE
              </h2>
              <p style={{ color: '#66615C', fontSize: '0.95rem', maxWidth: '560px', lineHeight: 1.6 }}>
                Your selections shape the scope and investment of the project.
              </p>
            </div>

            {/* Calculated Range Display (Deterministic & Animated) */}
            <div style={{
              textAlign: 'right',
              backgroundColor: '#FAF9F6',
              border: '1px solid #EAE6DF',
              borderRadius: '2px',
              padding: '20px 28px'
            }}>
              <span style={{ fontSize: '0.64rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                INDICATIVE INVESTMENT
              </span>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.2rem',
                fontWeight: 600,
                color: '#111111',
                letterSpacing: '-0.02em',
                marginTop: '2px',
                lineHeight: 1.1,
                transition: 'all 0.3s ease'
              }}>
                {displayRange}
              </div>
              <p style={{
                fontSize: '0.72rem',
                color: '#8E8A84',
                marginTop: '6px',
                maxWidth: '280px',
                lineHeight: 1.4
              }}>
                Final pricing depends on design, materials, site conditions and project requirements.
              </p>
            </div>
          </div>

          {/* Quick Scope & Feature Adjusters (Provides instant responsiveness for size, finish level, and features) */}
          <div style={{
            backgroundColor: '#F5F3EF',
            border: '1px solid #EAE6DF',
            borderRadius: '2px',
            padding: '18px 22px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <span className="label-tech" style={{ color: '#111111', fontSize: '0.66rem' }}>
                SCOPE PARAMETERS & OPTIONAL ELEMENTS
              </span>
              <span style={{ fontSize: '0.7rem', color: '#66615C' }}>
                Selections dynamically recompute your indicative estimate
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {/* Size Buttons */}
              <div style={{ display: 'inline-flex', borderRadius: '2px', border: '1px solid #D8D4CE', backgroundColor: '#FFFFFF', padding: '2px' }}>
                {[
                  { id: 'compact', label: 'Compact ($22K)' },
                  { id: 'medium', label: 'Medium ($35K)' },
                  { id: 'large', label: 'Large ($50K)' }
                ].map(sz => {
                  const isSelected = (plannerState.size || 'medium') === sz.id;
                  return (
                    <button
                      key={sz.id}
                      onClick={() => onUpdateField('size', sz.id)}
                      style={{
                        backgroundColor: isSelected ? '#111111' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#66615C',
                        border: 'none',
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sz.label}
                    </button>
                  );
                })}
              </div>

              {/* Finish Level Buttons */}
              <div style={{ display: 'inline-flex', borderRadius: '2px', border: '1px solid #D8D4CE', backgroundColor: '#FFFFFF', padding: '2px' }}>
                {[
                  { id: 'refined', label: 'Standard ($0)' },
                  { id: 'premium', label: 'Premium (+$5K)' },
                  { id: 'luxury', label: 'Luxury (+$12K)' }
                ].map(fl => {
                  const isSelected = (plannerState.finishLevel || 'premium') === fl.id;
                  return (
                    <button
                      key={fl.id}
                      onClick={() => onUpdateField('finishLevel', fl.id)}
                      style={{
                        backgroundColor: isSelected ? '#111111' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#66615C',
                        border: 'none',
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {fl.label}
                    </button>
                  );
                })}
              </div>

              {/* Feature Toggles (Island, Appliances, Storage, Lighting) */}
              {[
                { id: 'island', label: '+ Island (+$5K)' },
                { id: 'integrated-appliances', label: '+ Appliances (+$7K)' },
                { id: 'custom-storage', label: '+ Storage (+$2.5K)' },
                { id: 'feature-lighting', label: '+ Lighting (+$1.8K)' }
              ].map(feat => {
                const features = plannerState.features || [];
                const isSelected = features.includes(feat.id);
                return (
                  <button
                    key={feat.id}
                    onClick={() => {
                      if (isSelected) {
                        onUpdateField('features', features.filter(f => f !== feat.id));
                      } else {
                        onUpdateField('features', [...features, feat.id]);
                      }
                    }}
                    style={{
                      backgroundColor: isSelected ? '#EC202B' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#111111',
                      border: '1px solid',
                      borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                      borderRadius: '2px',
                      padding: '6px 12px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                    <span>{feat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expandable Breakdown Toggle Button */}
          <div>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              style={{
                background: 'none',
                border: '1px solid #111111',
                color: '#111111',
                padding: '9px 18px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#111111';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#111111';
              }}
            >
              <span>{showBreakdown ? 'HIDE ESTIMATE BREAKDOWN —' : 'VIEW ESTIMATE BREAKDOWN +'}</span>
            </button>
          </div>

          {/* Compact Breakdown List */}
          {showBreakdown && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #EAE6DF'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                marginBottom: '18px'
              }}>
                {estimate.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#F5F3EF',
                      border: '1px solid #EAE6DF',
                      borderRadius: '2px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.64rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                        {item.label}
                      </span>
                      <strong style={{ fontSize: '0.84rem', color: '#111111' }}>
                        {item.detail || item.label}
                      </strong>
                    </div>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: item.isBase ? '#111111' : '#EC202B'
                    }}>
                      {item.formatted}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                borderRadius: '2px'
              }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  DETERMINISTIC MIDPOINT BENCHMARK
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                  ${estimate.midpoint.toLocaleString()} AUD
                </span>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            27 — CONSULTATION CTA: CARRY FORWARD ACTIVE CONFIGURATION
           ========================================================================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '36px 44px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.02)'
        }}>
          <div>
            <div className="label-tech" style={{ color: '#EC202B', marginBottom: '6px' }}>
              READY TO DISCUSS YOUR PROJECT?
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 400,
              color: '#111111',
              marginBottom: '6px'
            }}>
              YOUR CABINET CONFIGURATION IS READY.
            </h3>
            <p style={{
              color: '#66615C',
              fontSize: '0.95rem',
              maxWidth: '620px',
              lineHeight: 1.6
            }}>
              Your material selections, joinery style, layout, hardware, and benchtop have been compiled into your active project brief.
            </p>
          </div>

          <button
            onClick={onProceedToConsultation || onProceedToEstimator}
            className="btn-primary"
            style={{ padding: '15px 32px', fontSize: '0.84rem' }}
          >
            <span>DISCUSS MY PROJECT</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
