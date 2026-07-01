import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

export function AppShell({
  children,
  userEmail,
  notificationCount = 0,
}: {
  children: ReactNode;
  userEmail?: string | null;
  notificationCount?: number;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar userEmail={userEmail} notificationCount={notificationCount} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="w-full max-w-[1400px] flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
