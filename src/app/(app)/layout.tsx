import { QueryProvider } from "@/lib/api/query-provider";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = privateMetadata;
export const instant = false;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
