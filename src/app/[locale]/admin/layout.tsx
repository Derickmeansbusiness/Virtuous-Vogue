import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { Header } from "@/components/layout/header";
import { AdminNav } from "@/components/admin/admin-nav";
import { storeMode } from "@/lib/data/store";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireAdmin();
  return (
    <>
      <Header signedIn isAdmin tone="light" />
      <main id="main" className="flex-1 bg-porcelain pt-[var(--vv-header-h)]">
        <div className="container-vv grid gap-8 py-8 lg:grid-cols-12 lg:py-12">
          <aside className="lg:col-span-2">
            <p className="eyebrow text-mulberry">Cockpit</p>
            <p className="mt-1 text-sm text-ink-soft">{user.name ?? user.email}</p>
            {storeMode !== "supabase" ? <p className="mt-2 inline-block border border-warning/40 px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.14em] text-warning">{storeMode === "local" ? "Local store" : "Supabase not configured"}</p> : null}
            <AdminNav className="mt-6" />
          </aside>
          <div className="lg:col-span-10">{children}</div>
        </div>
      </main>
    </>
  );
}
