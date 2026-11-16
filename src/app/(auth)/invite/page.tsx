import { Suspense } from "react";

import { InviteAccept } from "@/features/auth/token-pages";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata = { ...privateMetadata, title: "Invitación" };

export default function InvitePage() {
  return (
    <Suspense>
      <InviteAccept />
    </Suspense>
  );
}
