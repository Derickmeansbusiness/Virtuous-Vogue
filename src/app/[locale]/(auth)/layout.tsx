import { Link } from "@/i18n/navigation";
import { HeaderLockup } from "@/components/ui/brand";
import { EditorialImage } from "@/components/media/editorial-image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <Link href="/" aria-label="Virtuous Vogue home">
          <HeaderLockup height={30} />
        </Link>
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md py-16">{children}</div>
        </div>
        <p className="font-display text-sm italic text-ink-muted">Virtue Never Goes Out of Style.</p>
      </div>
      <div className="relative hidden lg:block">
        <EditorialImage id="hero-03-intentional-elegance-portrait" className="absolute inset-0 h-full w-full" sizes="50vw" priority />
      </div>
    </main>
  );
}
