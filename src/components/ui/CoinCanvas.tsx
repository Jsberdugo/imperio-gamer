import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────
   COIN CANVAS
────────────────────────────────────────────────────────────── */
export function CoinCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    interface Coin {
      x: number;
      y: number;
      r: number;
      speed: number;
      opacity: number;
      rot: number;
      rotSpeed: number;
      wobble: number;
      wobbleSpeed: number;
    }
    const count = window.innerWidth < 640 ? 22 : 55;
    const coins: Coin[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 2 - window.innerHeight,
      r: 5 + Math.random() * 11,
      speed: 0.6 + Math.random() * 1.4,
      opacity: 0.12 + Math.random() * 0.28,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.06,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.012 + Math.random() * 0.018,
    }));
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      coins.forEach((c) => {
        c.y += c.speed;
        c.rot += c.rotSpeed;
        c.wobble += c.wobbleSpeed;
        c.x += Math.sin(c.wobble) * 0.5;
        if (c.y - c.r > canvas.height) {
          c.y = -c.r * 2;
          c.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.globalAlpha = c.opacity;
        ctx.scale(1, Math.abs(Math.cos(c.rot)) * 0.4 + 0.6);
        const g = ctx.createRadialGradient(
          -c.r * 0.3,
          -c.r * 0.3,
          0,
          0,
          0,
          c.r,
        );
        g.addColorStop(0, "#ffe57a");
        g.addColorStop(0.5, "#d4a843");
        g.addColorStop(1, "#7a5800");
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-c.r * 0.25, -c.r * 0.25, c.r * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,240,120,0.35)";
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
