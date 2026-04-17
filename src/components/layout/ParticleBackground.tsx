import React, { useEffect, useRef } from 'react';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.02
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.x += star.dx;
        star.y += star.dy;
        
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        star.a += star.da;
        if (star.a < 0.1 || star.a > 1) star.da *= -1;

        const px = (mouseX - width / 2) * 0.0005 * star.r;
        const py = (mouseY - height / 2) * 0.0005 * star.r;

        ctx.beginPath();
        ctx.arc(star.x + px, star.y + py, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.a})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[-1]"
    />
  );
};
