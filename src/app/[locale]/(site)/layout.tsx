import { SiteFrame } from "@/components/layout/site-frame";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>;
}
