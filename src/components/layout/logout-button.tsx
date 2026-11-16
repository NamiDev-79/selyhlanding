"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks";

export function LogoutButton({ className = "" }: { className?: string }) {
  const logout = useLogout();
  return (
    <Button variant="ghost" size="sm" className={className} pending={logout.isPending} onClick={() => logout.mutate()}>
      Cerrar sesión
    </Button>
  );
}
