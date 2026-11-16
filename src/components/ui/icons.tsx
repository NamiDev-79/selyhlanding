import type { SVGProps } from "react";

/** Iconos de trazo (24×24, heredan el color del texto). Decorativos: llevan aria-hidden. */
const paths = {
  pulse: "M3 12h4l2.5-6 5 12 2.5-6H21",
  chart: "M4 19V5M4 19h16M8 15l3.5-4 3 2.5L20 7",
  sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2",
  loop: "M4 12a8 8 0 0 1 13.7-5.7L20 8.6M20 4v4.6h-4.6M20 12a8 8 0 0 1-13.7 5.7L4 15.4M4 20v-4.6h4.6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 18l-6-6 6-6",
  toggle: "M8 7h8a5 5 0 0 1 0 10H8A5 5 0 0 1 8 7ZM16 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  hash: "M9 4 7 20M17 4l-2 16M4 9h16M3 15h16",
  download: "M12 4v11M7 10.5l5 5 5-5M5 20h14",
  users: "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.15a3.5 3.5 0 0 1 0 6.7",
  code: "m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14",
  monitor: "M3 5h18v11H3zM8 20h8M12 16v4",
  phone: "M7 3h10v18H7zM11 18h2",
  layout: "M3 4h18v16H3zM3 9h18M9 9v11",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5",
  shield: "M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z",
  eyeOff: "M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4 9.5 6a12.7 12.7 0 0 1-2.6 3.4M6.6 6.6C4.6 7.9 3.2 10 2.5 12c1 2 4.5 6 9.5 6 1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  plus: "M12 5v14M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  wind: "M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className} {...rest}>
      <path d={paths[name]} />
    </svg>
  );
}
