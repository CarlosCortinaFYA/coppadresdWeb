import type { CSSProperties } from "react";

const paths: Record<string, string> = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  diagonal: "M6 18 18 6M6 6h12v12",
  chevron: "m6 9 6 6 6-6",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  moon: "M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5 8.5 8.5 0 1 0 20.5 13.2Z",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z",
  heart:
    "M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8ZM3 12h5l2-4 3 7 2-3h6",
  bowl: "M3 11h18c0 6-4 9-9 9s-9-3-9-9Zm3 10h12M8 3v4m4-5v5m4-4v4",
  leaf: "M20 3C8 1 2 9 6 15c6 9 15-1 14-12ZM4 21l12-13M7 17l-1-6m5 2 6 1",
  shirt: "m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z",
  sprout:
    "M12 22V11M12 15C3 15 3 9 3 6c6 0 9 3 9 9Zm0-4c0-7 4-9 9-9 0 6-2 9-9 9",
  sparkles:
    "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4M3 18v4m-2-2h4",
  play: "M21 7v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3ZM10 8l6 4-6 4Z",
  capsule: "m9 4-5 5a6.4 6.4 0 0 0 9 9l5-5a6.4 6.4 0 0 0-9-9ZM7 7l10 10",
  snow: "M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 3l3 3 3-3M9 21l3-3 3 3M3 10l4-1-1-4M18 19l-1-4 4-1M3 14l4 1-1 4M18 5l-1 4 4 1",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  sunrise: "M3 19h18M5 15a7 7 0 0 1 14 0M12 2v3M3 6l2 2m14 0 2-2M2 14h2m16 0h2",
  academy: "m2 8 10-5 10 5-10 5L2 8Zm4 3v6c4 4 8 4 12 0v-6m4-3v9",
  brain:
    "M12 4c-3-4-7 0-6 3-4 0-5 6-2 8-2 5 5 9 8 4V4Zm0 0c3-4 7 0 6 3 4 0 5 6 2 8 2 5-5 9-8 4M8 8l4 3m4-3-4 3M6 15l3-2m9 2-3-2",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6",
  building: "M4 22V3h12v19M16 9h5v13M8 7h4M8 11h4M8 15h4M9 22v-3h2v3M2 22h21",
  shield: "m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6",
  chip: "M7 7h10v10H7ZM3 8h4M3 16h4M17 8h4m-4 8h4M8 3v4m8-4v4M8 17v4m8-4v4M10 10h4v4h-4Z",
  video: "M15 8l7-4v16l-7-4M2 5h13v14H2Z",
  chart: "M4 3v18h18M8 16v-4m5 4V6m5 10V9",
  person:
    "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2",
  pulse: "M2 12h5l3-8 4 16 3-8h5",
  link: "m10 13 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0",
  download: "M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6",
};
export function Icon({
  name,
  size = 24,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={paths[name] ?? paths.sparkles} />
    </svg>
  );
}
export function DnaMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 64"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.8">
        <path d="M12 3c0 27 24 31 24 58M36 3c0 27-24 31-24 58" />
        {[9, 17, 25, 33, 41, 49, 57].map((y, i) => (
          <path
            key={y}
            d={`M${12 + Math.sin((i / 6) * Math.PI) * 10} ${y}H${36 - Math.sin((i / 6) * Math.PI) * 10}`}
          />
        ))}
      </g>
    </svg>
  );
}
