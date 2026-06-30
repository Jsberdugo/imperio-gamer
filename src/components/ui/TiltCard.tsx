import { useCallback, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────
   TILT CARD
────────────────────────────────────────────────────────────── */
export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -10,
      y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 10,
    });
    setGlow({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }, []);
  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective: "700px" }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 });
        setHovered(false);
      }}>
      <div
        className="h-full transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}>
        {hovered && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(212,168,67,0.6) 0%, rgba(24,165,84,0.2) 40%, transparent 65%)`,
              padding: "1.5px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        )}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: "1px solid rgba(212,168,67,0.2)",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        />
        {children}
      </div>
    </div>
  );
}
