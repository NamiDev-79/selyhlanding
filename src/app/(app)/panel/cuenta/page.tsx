"use client";

import { PageHeader } from "@/components/layout/app-shell";
import { Loading } from "@/components/ui/feedback";
import { AccountCenter } from "@/features/account/account";
import { useMe } from "@/features/auth/hooks";

export default function AccountPage() {
  const me = useMe();
  return (
    <>
      <PageHeader title="Cuenta" />
      {me.data ? <AccountCenter me={me.data} /> : <Loading />}
    </>
  );
}
