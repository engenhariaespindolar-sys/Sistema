import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count } = await supabase
    .from("notificacoes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("lida", false);

  return (
    <AppShell userEmail={user.email} notificationCount={count ?? 0}>
      {children}
    </AppShell>
  );
}
