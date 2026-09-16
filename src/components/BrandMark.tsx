import { useId } from "react";
/** Vector reconstruction of docs/new/logo.jpeg; transparent, without a framing box. */
export function BrandMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`brand-mark ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={id}
          x1="24"
          y1="100"
          x2="180"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-start, #035d4d)" />
          <stop offset=".48" stopColor="var(--logo-middle, #3d7b72)" />
          <stop offset="1" stopColor="var(--logo-end, #023467)" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        <path d="M17 116A85 85 0 1 1 184 116L175 113A76 76 0 1 0 26 113Z" />
        <path d="M17 112C47 132 78 124 96 184C49 182 20 152 17 112ZM184 112C154 132 123 124 106 184C153 182 181 152 184 112Z" />
        <circle cx="101" cy="61" r="18" />
        <path d="M47 71C65 81 82 94 101 100C122 94 139 81 156 70C145 89 121 110 107 135L101 153L94 134C79 109 57 91 47 71Z" />
      </g>
    </svg>
  );
}
