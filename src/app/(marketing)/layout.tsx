import { MotionProvider } from "@/components/landing/motion-provider";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

/**
 * Web pública con el sistema de diseño Selyh. Claro por defecto; el botón de la barra cambia a oscuro
 * (la clase .dark en <html> la pone el script del layout raíz antes del primer pintado).
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="selyh min-h-dvh font-sans">
      <MotionProvider>
        <SiteNav />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </MotionProvider>
    </div>
  );
}
