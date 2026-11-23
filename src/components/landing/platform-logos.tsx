import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * Logos de plataforma para los botones de descarga: se reconocen sin leer.
 * Dibujos simplificados (uso nominativo, como en cualquier página de descargas), a 24 × 24.
 */
type P = { className?: string };
const base = (c?: string) => cn("size-6 shrink-0", c);

function VsCode({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={base(className)}>
      <path
        fill="#2F9BF0"
        d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
      />
    </svg>
  );
}

function Windows({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={base(className)}>
      <g fill="#3B9BFF">
        <rect x="2" y="2" width="9.5" height="9.5" rx="0.6" />
        <rect x="12.5" y="2" width="9.5" height="9.5" rx="0.6" />
        <rect x="2" y="12.5" width="9.5" height="9.5" rx="0.6" />
        <rect x="12.5" y="12.5" width="9.5" height="9.5" rx="0.6" />
      </g>
    </svg>
  );
}

function Apple({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={base(className)}>
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </svg>
  );
}

/** Tux simplificado: cabeza, cuerpo, barriga blanca y pico y patas amarillas. */
function Linux({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={base(className)}>
      <ellipse cx="12" cy="15" rx="6.2" ry="7" fill="#3a404d" />
      <ellipse cx="12" cy="7" rx="4.3" ry="4.8" fill="#3a404d" />
      <ellipse cx="12" cy="15.9" rx="4" ry="5.4" fill="#fff" />
      <ellipse cx="10.4" cy="6.3" rx="1.05" ry="1.35" fill="#fff" />
      <ellipse cx="13.6" cy="6.3" rx="1.05" ry="1.35" fill="#fff" />
      <circle cx="10.65" cy="6.6" r="0.5" fill="#0f1523" />
      <circle cx="13.35" cy="6.6" r="0.5" fill="#0f1523" />
      <path d="M9.9 8.7q2.1-1.3 4.2 0-2.1 2.2-4.2 0Z" fill="#F7B500" />
      <ellipse cx="8.3" cy="21.7" rx="3" ry="1.35" fill="#F7B500" />
      <ellipse cx="15.7" cy="21.7" rx="3" ry="1.35" fill="#F7B500" />
    </svg>
  );
}

/** Triángulo de Google Play en sus cuatro colores. */
function Play({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={base(className)}>
      <path d="M3.6 2.2 13.4 12 3.6 21.8a1.4 1.4 0 0 1-.6-1.2V3.4c0-.5.2-.9.6-1.2Z" fill="#4285F4" />
      <path d="M3.6 2.2c.4-.3 1-.3 1.5 0L16.7 8.7 13.4 12Z" fill="#34A853" />
      <path d="M3.6 21.8c.4.3 1 .3 1.5 0l11.6-6.5-3.3-3.3Z" fill="#EA4335" />
      <path d="m16.7 8.7 3.6 2c1.1.6 1.1 2 0 2.6l-3.6 2-3.3-3.3Z" fill="#FBBC04" />
    </svg>
  );
}

function Browser({ className }: P) {
  return <Globe aria-hidden strokeWidth={1.8} className={base(className)} />;
}

/** Robot Android en color verde oficial (#3DDC84). */
function Android({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={base(className)}>
      <line x1="7.5" y1="10" x2="5.2" y2="6.2" stroke="#3DDC84" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16.5" y1="10" x2="18.8" y2="6.2" stroke="#3DDC84" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 18h16c0-4.418-3.582-8-8-8s-8 3.582-8 8Z" fill="#3DDC84" />
      <circle cx="8.5" cy="14" r="1.1" fill="#fff" />
      <circle cx="15.5" cy="14" r="1.1" fill="#fff" />
    </svg>
  );
}

function Github({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={base(className)} fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export const platformLogo = {
  vscode: VsCode,
  windows: Windows,
  apple: Apple,
  linux: Linux,
  play: Play,
  android: Android,
  github: Github,
  browser: Browser,
} as const;
export type PlatformIcon = keyof typeof platformLogo;
