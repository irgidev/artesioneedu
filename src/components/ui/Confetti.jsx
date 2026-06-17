import { useEffect, useRef } from 'react';

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Confetti({ duration = 2500, particleCount = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#6C63FF', '#4ECDC4', '#06D6A0', '#FFD166', '#EF476F', '#F97316'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: randomRange(-8, 8),
        vy: randomRange(-12, -4),
        size: randomRange(4, 8),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: randomRange(0, Math.PI * 2),
        rotationSpeed: randomRange(-0.2, 0.2),
        gravity: randomRange(0.2, 0.4),
        drag: 0.98,
        life: 1,
        decay: randomRange(0.005, 0.015),
      });
    }

    const startTime = Date.now();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      particles = particles.filter((p) => p.life > 0);

      if (particles.length > 0 && Date.now() - startTime < duration) {
        animationId = requestAnimationFrame(render);
      }
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [duration, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      aria-hidden="true"
    />
  );
}
