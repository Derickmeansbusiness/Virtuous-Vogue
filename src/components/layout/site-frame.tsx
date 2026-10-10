import { Header } from "./header";
import { Footer } from "./footer";
import { MobileNav } from "./mobile-nav";
import { Cursor } from "./cursor";
import { getSessionUser } from "@/lib/auth/session";
import { FEATURE_FLAGS } from "@/lib/site";
import { cn } from "@/lib/utils/cn";

/**
 * Public site shell: header, footer and the bottom-docked navigation on
 * phones and tablets. Used by every marketing, studio and magazine route.
 */
export async function SiteFrame({
  children,
  headerTone = "auto",
  withFooter = true,
  className,
}: {
  children: React.ReactNode;
  headerTone?: "auto" | "light" | "dark";
  withFooter?: boolean;
  className?: string;
}) {
  const user = await getSessionUser();
  return (
    <>
      <Header signedIn={Boolean(user)} isAdmin={user?.role === "admin"} tone={headerTone} />
      <main id="main" className={cn("flex-1", headerTone === "auto" ? "" : "pt-[var(--vv-header-h)]", !withFooter && "pb-safe-nav lg:pb-0", className)}>
        {children}
      </main>
      {withFooter ? <Footer /> : null}
      <MobileNav signedIn={Boolean(user)} />
      {FEATURE_FLAGS.customCursor ? <Cursor /> : null}
    </>
  );
}
