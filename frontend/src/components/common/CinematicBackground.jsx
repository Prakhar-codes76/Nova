import React, { useEffect, useRef } from 'react';

export const CinematicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = Math.min(40, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      color: Math.random() > 0.4 ? 'rgba(124, 92, 255, ' : 'rgba(34, 211, 238, ',
      alpha: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render glowing floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="cinematic-bg-root" aria-hidden="true">
      {/* Radial ambient gradient light sources */}
      <div className="bg-light-orb bg-orb-1" />
      <div className="bg-light-orb bg-orb-2" />
      <div className="bg-light-orb bg-orb-3" />

      {/* Futuristic Mesh Overlay */}
      <div className="bg-gradient-mesh" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="bg-particle-canvas" />

      {/* Subtle Vignette */}
      <div className="bg-vignette-overlay" />
    </div>
  );
};

export default CinematicBackground;
