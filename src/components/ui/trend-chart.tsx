/**
 * Línea de tendencia contra la línea base personal (z-score). SVG puro, sin librerías.
 * La banda menta es el rango habitual (|z| < 0.5); nunca se usan colores de alarma.
 */
type Marker = { at: number; label: string };

type Props = {
  values: (number | null)[];
  labels?: [string, string];
  marker?: Marker;
  bandLabel?: string;
  ariaLabel: string;
  animate?: boolean;
  height?: number;
};

const W = 640;
const PAD = { top: 18, right: 16, bottom: 30, left: 16 };
const Z_MAX = 1.6;

export function TrendChart({ values, labels, marker, bandLabel, ariaLabel, animate = false, height = 240 }: Props) {
  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = Math.max(values.length, 2);
  const x = (i: number) => PAD.left + (i / (n - 1)) * innerW;
  const y = (z: number) => PAD.top + ((Z_MAX - Math.max(-Z_MAX, Math.min(Z_MAX, z))) / (2 * Z_MAX)) * innerH;

  // Segmentos continuos (los días sin dato cortan la línea en vez de inventar un valor).
  const segments: string[] = [];
  let current = "";
  let lastStart = 0;
  values.forEach((v, i) => {
    if (v == null) {
      if (current) segments.push(current);
      current = "";
      return;
    }
    if (!current) lastStart = i;
    current += `${current ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
  });
  if (current) segments.push(current);

  const lastIndex = values.findLastIndex((v) => v != null);
  const last = lastIndex >= 0 ? values[lastIndex]! : null;
  const markerValue = marker ? values[marker.at] : null;
  // Área bajo el último segmento: da cuerpo a la línea sin inventar datos.
  const area = segments.length
    ? `${segments[segments.length - 1]}L${x(lastIndex).toFixed(1)},${H - PAD.bottom}L${x(lastStart).toFixed(1)},${H - PAD.bottom}Z`
    : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trend-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a2a2fa" />
          <stop offset="100%" stopColor="#6363f1" />
        </linearGradient>
      </defs>
      <rect x={PAD.left} y={y(0.5)} width={innerW} height={y(-0.5) - y(0.5)} rx={6} className="fill-mint-wash" />
      {bandLabel ? (
        <text x={PAD.left} y={y(-0.5) + 15} className="fill-ink-faint font-mono text-[11px] uppercase tracking-wider">
          {bandLabel}
        </text>
      ) : null}
      <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} className="stroke-line-strong" strokeDasharray="2 5" />

      {marker && markerValue != null ? (
        <g>
          <line x1={x(marker.at)} x2={x(marker.at)} y1={PAD.top - 6} y2={H - PAD.bottom} className="stroke-warm" strokeWidth={1.5} strokeDasharray="3 4" />
          <circle cx={x(marker.at)} cy={y(markerValue)} r={6} className="fill-warm stroke-paper" strokeWidth={2.5} />
        </g>
      ) : null}

      {area ? <path d={area} fill="url(#trend-area)" /> : null}
      {segments.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="url(#trend-line)"
          className={animate ? "draw" : ""}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={animate ? ({ "--len": 1400 } as React.CSSProperties) : undefined}
        />
      ))}
      {last != null ? <circle cx={x(lastIndex)} cy={y(last)} r={4} className="fill-paper stroke-accent" strokeWidth={2.4} /> : null}

      {labels ? (
        <g className="fill-ink-faint font-mono text-[11px]">
          <text x={PAD.left} y={H - 8}>
            {labels[0]}
          </text>
          <text x={W - PAD.right} y={H - 8} textAnchor="end">
            {labels[1]}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
