import { useId } from "react";

/**
 * Símbolo de Agentic Wellness AI: esfera del agente con órbita, inspirada en el
 * avatar de la app. Fondo transparente e identificadores de degradado únicos
 * por instancia (varias marcas en la misma página no colisionan).
 */
export function BrandMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`brand-mark ${className}`}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-core`} cx="38%" cy="32%" r="72%">
          <stop offset="0" stopColor="#f5f3ff" />
          <stop offset=".32" stopColor="#a78bfa" />
          <stop offset=".62" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#1e1b4b" />
        </radialGradient>
        <linearGradient id={`${id}-ring`} x1="6" y1="40" x2="58" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d946ef" />
          <stop offset=".5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="31" r="19" fill={`url(#${id}-core)`} />
      <path
        d="M24.5 31.5c1.2-2 3.6-2 4.8 0M34.7 31.5c1.2-2 3.6-2 4.8 0"
        stroke="#ecfeff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <ellipse
        cx="32"
        cy="36"
        rx="28"
        ry="8.5"
        transform="rotate(-14 32 36)"
        stroke={`url(#${id}-ring)`}
        strokeWidth="3.2"
        strokeDasharray="120 26"
        strokeLinecap="round"
      />
    </svg>
  );
}
