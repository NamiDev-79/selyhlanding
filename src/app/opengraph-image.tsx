import { ImageResponse } from "next/og";

import { LOGO_LETTERS, LOGO_SHORT, LOGO_TALL, LOGO_VIEWBOX } from "@/components/brand/logo-geometry";

export const alt = "Selyh: prevenir también es parte del trabajo. Salud mental para desarrolladores.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen para redes, como el banner de la marca: azul tinta, logotipo negativo y las barras cortadas por el borde. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0F1523", color: "#FFFFFF", padding: "68px 68px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", maxWidth: 760 }}>
          <svg width={240} height={83} viewBox={LOGO_VIEWBOX}>
            <g fill="#FFFFFF" transform="scale(1 -1)">
              {LOGO_LETTERS.map(([x, d]) => (
                <path key={x} transform={`translate(${x} 0)`} d={d} />
              ))}
            </g>
            <rect x={LOGO_TALL[0]} y={-LOGO_TALL[1]} width={LOGO_TALL[2]} height={LOGO_TALL[1]} rx={LOGO_TALL[2] / 2} fill="#6363F1" />
            <rect x={LOGO_SHORT[0]} y={-LOGO_SHORT[1]} width={LOGO_SHORT[2]} height={LOGO_SHORT[1]} rx={LOGO_SHORT[2] / 2} fill="#A2A2FA" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>
              Prevenir también es&nbsp;<span style={{ color: "#A2A2FA", fontStyle: "italic", fontWeight: 400 }}>parte del trabajo.</span>
            </div>
            <div style={{ fontSize: 28, color: "#9CA3AF" }}>Salud mental para desarrolladores, sin salir de tu flujo de trabajo.</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 90, bottom: -120, display: "flex", alignItems: "flex-end", gap: 34 }}>
          <div style={{ width: 90, height: 460, borderRadius: 45, background: "#6363F1" }} />
          <div style={{ width: 90, height: 284, borderRadius: 45, background: "#A2A2FA" }} />
        </div>
      </div>
    ),
    size,
  );
}
