import { getTier } from "../../utils/getTier";

export interface TierIconProps {
  tier: ReturnType<typeof getTier>;
  size?: number;
}

export default function TierIcon({ tier, size = 18 }: TierIconProps) {
  const s = size;
  const c = tier.color;

  if (tier.name === "Bronce") {
    const points = Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 72 - 90) * (Math.PI / 180);

      return `${s / 2 + s * 0.42 * Math.cos(angle)},${
        s / 2 + s * 0.42 * Math.sin(angle)
      }`;
    }).join(" ");

    const inner = Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 72 - 90) * (Math.PI / 180);

      return `${s / 2 + s * 0.22 * Math.cos(angle)},${
        s / 2 + s * 0.22 * Math.sin(angle)
      }`;
    }).join(" ");

    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <polygon points={points} fill={`${c}28`} stroke={c} strokeWidth="1.5" />

        <polygon points={inner} fill={c} opacity="0.7" />
      </svg>
    );
  }

  if (tier.name === "Plata") {
    const points = Array.from({ length: 6 }, (_, i) => {
      const angle = (i * 60 - 90) * (Math.PI / 180);

      return `${s / 2 + s * 0.43 * Math.cos(angle)},${
        s / 2 + s * 0.43 * Math.sin(angle)
      }`;
    }).join(" ");

    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <polygon points={points} fill={`${c}22`} stroke={c} strokeWidth="1.5" />

        <line
          x1={s * 0.3}
          y1={s / 2}
          x2={s * 0.7}
          y2={s / 2}
          stroke={c}
          strokeWidth="1.5"
          opacity="0.8"
        />

        <line
          x1={s / 2}
          y1={s * 0.3}
          x2={s / 2}
          y2={s * 0.7}
          stroke={c}
          strokeWidth="1.5"
          opacity="0.8"
        />
      </svg>
    );
  }

  if (tier.name === "Oro") {
    const outer = s * 0.44;
    const inner = s * 0.22;
    const cx = s / 2;
    const cy = s / 2;

    const points = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);

      const radius = i % 2 === 0 ? outer : inner;

      return `${cx + radius * Math.cos(angle)},${
        cy + radius * Math.sin(angle)
      }`;
    }).join(" ");

    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
        <polygon points={points} fill={c} opacity="0.85" />
      </svg>
    );
  }

  const cx = s / 2;
  const cy = s / 2;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <polygon
        points={`
          ${cx},${cy - s * 0.44}
          ${cx + s * 0.32},${cy}
          ${cx},${cy + s * 0.44}
          ${cx - s * 0.32},${cy}
        `}
        fill={`${c}28`}
        stroke={c}
        strokeWidth="1.5"
      />

      <polygon
        points={`
          ${cx},${cy - s * 0.22}
          ${cx + s * 0.16},${cy}
          ${cx},${cy + s * 0.22}
          ${cx - s * 0.16},${cy}
        `}
        fill={c}
        opacity="0.9"
      />

      <circle
        cx={cx + s * 0.44}
        cy={cy - s * 0.3}
        r="1.2"
        fill={c}
        opacity="0.7"
      />
    </svg>
  );
}
