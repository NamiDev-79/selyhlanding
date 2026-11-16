import Link from "next/link";

import { Logo } from "@/components/brand/logo";

/** Logotipo oficial (en trazos) enlazado al inicio. Las letras toman el color del texto: tinta o blanco. */
export function Wordmark({ href = "/", className = "" }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center text-ink ${className}`} aria-label="Selyh, inicio">
      <Logo className="h-[1.55rem]" title="Selyh" />
    </Link>
  );
}
