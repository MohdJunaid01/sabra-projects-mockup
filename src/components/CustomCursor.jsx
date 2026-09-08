import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable for desktop mice
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive-card') ||
        target.closest('input') ||
        target.closest('select')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      // Check if hovering 3D canvas
      if (target.closest('canvas') || target.closest('.interactive-viewport')) {
        setIsOrbiting(true);
      } else {
        setIsOrbiting(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp damping for trailing ring
  useEffect(() => {
    let frameId;
    const update = () => {
      setPos(prev => ({
        x: prev.x + (targetPos.x - prev.x) * 0.22,
        y: prev.y + (targetPos.y - prev.y) * 0.22
      }));
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [targetPos]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        style={{
          position: 'fixed',
          top: targetPos.y,
          left: targetPos.x,
          width: '5px',
          height: '5px',
          backgroundColor: isHovering || isOrbiting ? '#EC202B' : '#111111',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'background-color 0.15s ease'
        }}
      />

      {/* Trailing Architectural Ring */}
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: isOrbiting ? '52px' : (isHovering ? '36px' : '22px'),
          height: isOrbiting ? '52px' : (isHovering ? '36px' : '22px'),
          borderRadius: '50%',
          border: '1px solid',
          borderColor: isOrbiting ? '#EC202B' : (isHovering ? '#EC202B' : 'rgba(17, 17, 17, 0.3)'),
          backgroundColor: isOrbiting ? 'rgba(236, 32, 43, 0.04)' : (isHovering ? 'rgba(236, 32, 43, 0.05)' : 'transparent'),
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOrbiting && (
          <span style={{
            fontSize: '0.52rem',
            letterSpacing: '0.1em',
            fontWeight: 700,
            color: '#EC202B',
            textTransform: 'uppercase'
          }}>
            ORBIT
          </span>
        )}
      </div>
    </>
  );
}
