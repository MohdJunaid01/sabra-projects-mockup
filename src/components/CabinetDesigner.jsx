import React, { useState } from 'react';
import {
  TIMBER_MATERIALS,
  CABINET_STYLES,
  CABINET_LAYOUTS,
  HARDWARE_OPTIONS,
  COUNTERTOP_OPTIONS
} from '../data/materials';
import { Check, ArrowRight, Sparkles, SlidersHorizontal, Layers, ShieldCheck } from 'lucide-react';

// Architectural 2D Front-Elevation Vector Cabinet Renderer
function ArchitecturalCabinetElevation({
  timber,
  styleId,
  layoutId,
  hardwareId,
  benchtopId
}) {
  const currentStyle = CABINET_STYLES.find(s => s.id === styleId) || CABINET_STYLES[0];
  const currentLayout = CABINET_LAYOUTS.find(l => l.id === layoutId) || CABINET_LAYOUTS[1];
  const currentHardware = HARDWARE_OPTIONS.find(h => h.id === hardwareId) || HARDWARE_OPTIONS[0];
  const currentBenchtop = COUNTERTOP_OPTIONS.find(b => b.id === benchtopId) || COUNTERTOP_OPTIONS[0];

  const doorCount = currentLayout.doorCount || 3;
  const hasDrawers = currentLayout.hasDrawers;

  // ViewBox geometry
  const width = 800;
  const height = 520;
  const benchtopHeight = 28;
  const shadowGap = 12;
  const carcassTop = 70;
  const carcassHeight = 360;
  const plinthHeight = 46;
  const plinthY = carcassTop + carcassHeight;
  const plinthIndent = 30;

  // Door span calculations
  const doorMargin = 12;
  const activeWidth = width - (doorMargin * 2);
  const gapWidth = 4;
  const totalGaps = (doorCount - 1) * gapWidth;
  const doorWidth = (activeWidth - totalGaps) / doorCount;

  // Drawer heights if drawer-door layout
  const drawerHeight = 90;
  const lowerDoorHeight = carcassHeight - drawerHeight - gapWidth;

  return (
    <div style={{
      width: '100%',
      maxWidth: '860px',
      margin: '0 auto',
      backgroundColor: '#FFFFFF',
      border: '1px solid #D8D4CE',
      borderRadius: '2px',
      padding: '36px 28px 24px 28px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.03)',
      position: 'relative'
    }}>
      {/* Dimension & Elevation Metadata Badges */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid #EAE6DF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B', borderRadius: '50%' }} />
          <span className="label-tech" style={{ color: '#111111', fontSize: '0.66rem' }}>
            ARCHITECTURAL FRONT ELEVATION · SCALE 1:20
          </span>
        </div>

        <div style={{ fontSize: '0.7rem', color: '#8E8A84', letterSpacing: '0.04em' }}>
          {timber.name} · {currentStyle.name} · {currentLayout.name}
        </div>
      </div>

      {/* SVG Canvas for precision vector joinery rendering */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Subtle wood shadow for cabinet depth */}
          <filter id="cabinet-shadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#111111" floodOpacity="0.08" />
          </filter>

          <filter id="handle-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          {/* Procedural wood grain pattern for doors */}
          <pattern id="door-grain" width="50" height="400" patternUnits="userSpaceOnUse">
            <line x1="10" y1="0" x2="12" y2="400" stroke={timber.grainColor} strokeWidth="1" strokeOpacity="0.35" />
            <line x1="22" y1="0" x2="20" y2="400" stroke={timber.grainColor} strokeWidth="1.4" strokeOpacity="0.28" />
            <line x1="34" y1="0" x2="36" y2="400" stroke={timber.highlightColor} strokeWidth="0.8" strokeOpacity="0.45" />
            <line x1="44" y1="0" x2="42" y2="400" stroke={timber.grainColor} strokeWidth="1" strokeOpacity="0.3" />
          </pattern>

          {/* Slatted wood batten pattern */}
          <pattern id="slat-pattern" width="18" height="400" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="14" height="400" fill={timber.baseColor} />
            <rect x="14" y="0" width="4" height="400" fill="#1C1814" opacity="0.6" />
            <line x1="2" y1="0" x2="2" y2="400" stroke={timber.highlightColor} strokeWidth="0.8" opacity="0.4" />
            <line x1="7" y1="0" x2="7" y2="400" stroke={timber.grainColor} strokeWidth="1" opacity="0.3" />
          </pattern>

          {/* Benchtop stone gradient & veining */}
          <linearGradient id="benchtop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentBenchtop.baseColor} />
            <stop offset="60%" stopColor={currentBenchtop.baseColor} />
            <stop offset="100%" stopColor={currentBenchtop.veinColor} stopOpacity="0.3" />
          </linearGradient>

          {/* Hardware metallic gradient */}
          <linearGradient id="hardware-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentHardware.color} />
            <stop offset="40%" stopColor={currentHardware.highlight} />
            <stop offset="100%" stopColor={currentHardware.color} />
          </linearGradient>
        </defs>

        {/* 1. Recessed Plinth / Kickboard */}
        <rect
          x={plinthIndent}
          y={plinthY}
          width={width - (plinthIndent * 2)}
          height={plinthHeight}
          fill="#1C1B19"
        />
        {/* Plinth shadowline gap */}
        <line
          x1={plinthIndent}
          y1={plinthY}
          x2={width - plinthIndent}
          y2={plinthY}
          stroke="#0F0E0D"
          strokeWidth="3"
        />

        {/* 2. Main Cabinet Carcass */}
        <rect
          x="10"
          y={carcassTop}
          width={width - 20}
          height={carcassHeight}
          fill={timber.baseColor}
          filter="url(#cabinet-shadow)"
        />
        {/* Carcass wood grain */}
        <rect
          x="10"
          y={carcassTop}
          width={width - 20}
          height={carcassHeight}
          fill="url(#door-grain)"
          opacity="0.7"
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
                    fill={styleId === 'slatted' ? 'url(#slat-pattern)' : timber.baseColor}
                    stroke="#1C1814"
                    strokeWidth="0.8"
                  />
                  {styleId !== 'slatted' && (
                    <rect
                      x={xPos}
                      y={carcassTop + 6}
                      width={doorWidth}
                      height={drawerHeight}
                      fill="url(#door-grain)"
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
                      x={xPos + (doorWidth / 2) - 24}
                      y={carcassTop + (drawerHeight / 2) - 3}
                      width="48"
                      height="6"
                      rx="2"
                      fill="url(#hardware-grad)"
                      filter="url(#handle-shadow)"
                    />
                  )}
                  {hardwareId === 'handleless' && (
                    <line
                      x1={xPos + 8}
                      y1={carcassTop + 12}
                      x2={xPos + doorWidth - 8}
                      y2={carcassTop + 12}
                      stroke="#141210"
                      strokeWidth="3"
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
                    fill={styleId === 'slatted' ? 'url(#slat-pattern)' : timber.baseColor}
                    stroke="#1C1814"
                    strokeWidth="0.8"
                  />
                  {styleId !== 'slatted' && (
                    <rect
                      x={xPos}
                      y={carcassTop + drawerHeight + gapWidth + 6}
                      width={doorWidth}
                      height={lowerDoorHeight - 12}
                      fill="url(#door-grain)"
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
                      x={i % 2 === 0 ? (xPos + doorWidth - 18) : (xPos + 12)}
                      y={carcassTop + drawerHeight + gapWidth + 30}
                      width="6"
                      height="60"
                      rx="2"
                      fill="url(#hardware-grad)"
                      filter="url(#handle-shadow)"
                    />
                  )}
                  {hardwareId === 'handleless' && (
                    <line
                      x1={xPos + 8}
                      y1={carcassTop + drawerHeight + gapWidth + 12}
                      x2={xPos + doorWidth - 8}
                      y2={carcassTop + drawerHeight + gapWidth + 12}
                      stroke="#141210"
                      strokeWidth="3"
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
                fill={styleId === 'slatted' ? 'url(#slat-pattern)' : timber.baseColor}
                stroke="#1C1814"
                strokeWidth="0.8"
              />
              {styleId !== 'slatted' && (
                <rect
                  x={xPos}
                  y={carcassTop + 6}
                  width={doorWidth}
                  height={carcassHeight - 12}
                  fill="url(#door-grain)"
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
                    fill="url(#door-grain)"
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
                  x={i % 2 === 0 ? (xPos + doorWidth - 18) : (xPos + 12)}
                  y={carcassTop + (carcassHeight / 2) - 40}
                  width="6"
                  height="80"
                  rx="2"
                  fill="url(#hardware-grad)"
                  filter="url(#handle-shadow)"
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

        {/* 4. Countertop Slab on Top */}
        <g filter="url(#cabinet-shadow)">
          {/* Overhang Countertop Slab */}
          <rect
            x="4"
            y={carcassTop - benchtopHeight}
            width={width - 8}
            height={benchtopHeight}
            fill="url(#benchtop-grad)"
            stroke={currentBenchtop.veinColor}
            strokeWidth="0.8"
          />

          {/* Realistic Stone Veining on Slab Face */}
          {benchtopId === 'calacatta' && (
            <g stroke={currentBenchtop.veinColor} strokeWidth="1.5" fill="none" opacity="0.45">
              <path d="M 40,46 Q 160,56 240,64 T 420,52" />
              <path d="M 380,48 Q 480,62 620,54 T 760,66" stroke={currentBenchtop.goldVein} strokeWidth="1" />
            </g>
          )}

          {benchtopId === 'travertine' && (
            <g stroke={currentBenchtop.goldVein} strokeWidth="1" fill="none" opacity="0.5">
              <line x1="8" y1="50" x2="792" y2="50" strokeDasharray="16,8,24,6" />
              <line x1="8" y1="58" x2="792" y2="58" strokeDasharray="30,12,18,10" />
            </g>
          )}

          {/* Shadow beneath countertop onto carcass */}
          <rect
            x="8"
            y={carcassTop}
            width={width - 16}
            height="4"
            fill="#0E0D0B"
            opacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
}

export default function CabinetDesigner({
  plannerState,
  onUpdateField,
  onProceedToEstimator
}) {
  const selectedTimber = TIMBER_MATERIALS.find(t => t.id === plannerState.cabinetFinish) || TIMBER_MATERIALS[0];
  const currentStyle = CABINET_STYLES.find(s => s.id === (plannerState.cabinetStyle || 'flat-panel')) || CABINET_STYLES[0];
  const currentLayout = CABINET_LAYOUTS.find(l => l.id === (plannerState.cabinetLayout || '3-door')) || CABINET_LAYOUTS[1];
  const currentHardware = HARDWARE_OPTIONS.find(h => h.id === (plannerState.hardware || 'brushed-brass')) || HARDWARE_OPTIONS[0];
  const currentBenchtop = COUNTERTOP_OPTIONS.find(b => b.id === (plannerState.benchtop || 'calacatta')) || COUNTERTOP_OPTIONS[0];

  return (
    <section id="cabinet-designer" style={{
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
          marginBottom: '48px',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#EC202B' }} />
              <span className="label-tech" style={{ color: '#EC202B' }}>
                03 / DESIGN
              </span>
            </div>

            <h2 className="headline-section" style={{ color: '#111111' }}>
              DESIGN YOUR CABINET.
            </h2>

            <p style={{ color: '#66615C', fontSize: '1.02rem', maxWidth: '540px', marginTop: '8px', lineHeight: 1.6 }}>
              Use your selected <strong style={{ color: '#111111' }}>{selectedTimber.name}</strong> finish as the foundation to configure profile style, layout, hardware, and stone benchtops.
            </p>
          </div>

          {/* Selected Wood Reminder Chip */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: selectedTimber.baseColor,
              borderRadius: '2px',
              border: '1px solid #D8D4CE'
            }} />
            <div>
              <span style={{ fontSize: '0.64rem', color: '#8E8A84', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                SELECTED FOUNDATION FINISH
              </span>
              <span style={{ fontWeight: 600, color: '#111111', fontSize: '0.88rem' }}>
                {selectedTimber.name} ({selectedTimber.code})
              </span>
            </div>
          </div>
        </div>

        {/* Main Interactive Stage: Live Cabinet Elevation */}
        <div style={{ marginBottom: '48px' }}>
          <ArchitecturalCabinetElevation
            timber={selectedTimber}
            styleId={plannerState.cabinetStyle || 'flat-panel'}
            layoutId={plannerState.cabinetLayout || '3-door'}
            hardwareId={plannerState.hardware || 'brushed-brass'}
            benchtopId={plannerState.benchtop || 'calacatta'}
          />
        </div>

        {/* Configuration Controls & Specification Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: '36px',
          alignItems: 'start'
        }} className="cabinet-config-grid">
          <style>{`
            @media (max-width: 980px) {
              .cabinet-config-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Left: 4 Interactive Configuration Groups */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '36px 40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            {/* 1. CABINET STYLE */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="label-tech" style={{ color: '#111111', fontSize: '0.72rem' }}>
                  1. CABINET PROFILE STYLE
                </span>
                <span style={{ fontSize: '0.72rem', color: '#EC202B', fontWeight: 600 }}>
                  Active: {currentStyle.name}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {CABINET_STYLES.map(st => {
                  const isSelected = (plannerState.cabinetStyle || 'flat-panel') === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => onUpdateField('cabinetStyle', st.id)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '14px 16px',
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.86rem', color: isSelected ? '#EC202B' : '#111111' }}>
                          {st.name}
                        </strong>
                        {isSelected && <Check size={14} color="#EC202B" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#66615C', lineHeight: 1.35, display: 'block' }}>
                        {st.tagline}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CABINET LAYOUT */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="label-tech" style={{ color: '#111111', fontSize: '0.72rem' }}>
                  2. CABINET LAYOUT
                </span>
                <span style={{ fontSize: '0.72rem', color: '#EC202B', fontWeight: 600 }}>
                  Active: {currentLayout.name}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {CABINET_LAYOUTS.map(lay => {
                  const isSelected = (plannerState.cabinetLayout || '3-door') === lay.id;
                  return (
                    <div
                      key={lay.id}
                      onClick={() => onUpdateField('cabinetLayout', lay.id)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '14px 16px',
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.86rem', color: isSelected ? '#EC202B' : '#111111' }}>
                          {lay.name}
                        </strong>
                        {isSelected && <Check size={14} color="#EC202B" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#66615C', lineHeight: 1.35, display: 'block' }}>
                        {lay.tagline}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. HANDLE HARDWARE */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="label-tech" style={{ color: '#111111', fontSize: '0.72rem' }}>
                  3. HANDLE & HARDWARE FITTING
                </span>
                <span style={{ fontSize: '0.72rem', color: '#EC202B', fontWeight: 600 }}>
                  Active: {currentHardware.name}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {HARDWARE_OPTIONS.map(hw => {
                  const isSelected = (plannerState.hardware || 'brushed-brass') === hw.id;
                  return (
                    <div
                      key={hw.id}
                      onClick={() => onUpdateField('hardware', hw.id)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#D8D4CE';
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: hw.color,
                        borderRadius: '50%',
                        border: '1px solid #D8D4CE',
                        flexShrink: 0
                      }} />

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: isSelected ? '#EC202B' : '#111111' }}>
                          {hw.name}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#8E8A84' }}>
                          {hw.finish.split(' ')[0]}
                        </span>
                      </div>
                      {isSelected && <Check size={14} color="#EC202B" strokeWidth={3} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. COUNTERTOP */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="label-tech" style={{ color: '#111111', fontSize: '0.72rem' }}>
                  4. COUNTERTOP STONE SLAB
                </span>
                <span style={{ fontSize: '0.72rem', color: '#EC202B', fontWeight: 600 }}>
                  Active: {currentBenchtop.name}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {COUNTERTOP_OPTIONS.map(ct => {
                  const isSelected = (plannerState.benchtop || 'calacatta') === ct.id;
                  return (
                    <div
                      key={ct.id}
                      onClick={() => onUpdateField('benchtop', ct.id)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(236, 32, 43, 0.04)' : '#FFFFFF',
                        border: '1px solid',
                        borderColor: isSelected ? '#EC202B' : '#D8D4CE',
                        borderRadius: '2px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#111111';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#D8D4CE';
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: ct.baseColor,
                        borderRadius: '2px',
                        border: '1px solid #D8D4CE',
                        flexShrink: 0
                      }} />

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: isSelected ? '#EC202B' : '#111111' }}>
                          {ct.name}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#8E8A84' }}>
                          {ct.type.split(' ')[0]}
                        </span>
                      </div>
                      {isSelected && <Check size={14} color="#EC202B" strokeWidth={3} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Architectural Material Specification Summary Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8D4CE',
            borderRadius: '2px',
            padding: '36px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid #EAE6DF',
                marginBottom: '24px'
              }}>
                <div>
                  <span className="label-tech" style={{ color: '#EC202B', fontSize: '0.64rem' }}>
                    SPECIFICATION BRIEF
                  </span>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    fontWeight: 600,
                    color: '#111111',
                    marginTop: '2px'
                  }}>
                    YOUR MATERIAL SPECIFICATION
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F5F3EF' }}>
                  <span style={{ color: '#66615C' }}>CABINET FINISH</span>
                  <strong style={{ color: '#111111' }}>{selectedTimber.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F5F3EF' }}>
                  <span style={{ color: '#66615C' }}>CABINET STYLE</span>
                  <strong style={{ color: '#111111' }}>{currentStyle.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F5F3EF' }}>
                  <span style={{ color: '#66615C' }}>CABINET LAYOUT</span>
                  <strong style={{ color: '#111111' }}>{currentLayout.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F5F3EF' }}>
                  <span style={{ color: '#66615C' }}>HARDWARE</span>
                  <strong style={{ color: '#111111' }}>{currentHardware.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #F5F3EF' }}>
                  <span style={{ color: '#66615C' }}>BENCHTOP</span>
                  <strong style={{ color: '#111111' }}>{currentBenchtop.name}</strong>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid #EAE6DF',
              fontSize: '0.74rem',
              color: '#8E8A84',
              lineHeight: 1.5
            }}>
              Customised joinery manufactured locally in Sydney to millimetric architectural tolerances.
            </div>
          </div>
        </div>

        {/* 13 — ESTIMATOR ENTRY CALLOUT & REVEAL CTA */}
        <div style={{
          marginTop: '56px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8D4CE',
          borderRadius: '2px',
          padding: '36px 44px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)'
        }}>
          <div>
            <div className="label-tech" style={{ color: '#EC202B', marginBottom: '6px' }}>
              NEXT STAGE · INVESTMENT PLANNING
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 400,
              color: '#111111',
              marginBottom: '6px'
            }}>
              YOUR CABINET IS TAKING SHAPE.
            </h3>
            <p style={{
              color: '#66615C',
              fontSize: '0.94rem',
              maxWidth: '580px',
              lineHeight: 1.55
            }}>
              Review your selections before exploring the indicative investment for your project.
            </p>
          </div>

          <button
            onClick={onProceedToEstimator}
            className="btn-primary"
            style={{ padding: '16px 36px', fontSize: '0.86rem' }}
          >
            <span>SEE INDICATIVE INVESTMENT</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
