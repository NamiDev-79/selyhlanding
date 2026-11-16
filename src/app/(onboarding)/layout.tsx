import { LogoutButton } from "@/components/layout/logout-button";
import { Wordmark } from "@/components/layout/wordmark";
import { QueryProvider } from "@/lib/api/query-provider";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = privateMetadata;

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <header className="border-b border-line">
        <div className="wrap flex h-16 items-center justify-between">
          <Wordmark />
          <LogoutButton />
        </div>
      </header>
      <main id="contenido" className="wrap max-w-6xl py-[clamp(2.5rem,2rem+3vw,5rem)]">
        {children}
      </main>
    </QueryProvider>
  );
}
