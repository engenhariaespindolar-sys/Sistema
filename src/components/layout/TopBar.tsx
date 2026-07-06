"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

export function TopBar({
  userEmail,
  notificationCount = 0,
}: {
  userEmail?: string | null;
  notificationCount?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border-subtle bg-surface px-4">
      <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
        <Logo className="h-7" />
      </Link>

      <div className="relative mx-auto w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-secondary" />
        <input
          placeholder="Buscar operação, endereço, código..."
          className="w-full rounded-full border border-border-subtle bg-black/[0.02] py-1.5 pl-9 pr-3 text-sm outline-none focus:border-brand-primary focus:bg-surface"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          className="relative rounded-full p-2 hover:bg-black/[0.04]"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 text-foreground-secondary" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary"
          >
            <User className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 w-52 rounded-lg border border-border-subtle bg-surface py-1 shadow-lg">
              <div className="border-b border-border-subtle px-3 py-2 text-xs text-foreground-secondary">
                {userEmail ?? "Usuário"}
              </div>
              <Link
                href="/perfil"
                className="block px-3 py-2 text-sm hover:bg-black/[0.04]"
              >
                Perfil
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-black/[0.04]"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
