import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Offline", robots: { index: false } };

export default function OfflinePage() {
  return (
    <Section tone="ivory" className="pt-[calc(var(--vv-header-h)+3rem)]">
      <Container narrow>
        <Eyebrow>Offline</Eyebrow>
        <h1 className="display-lg mt-3">You&rsquo;re offline, and that&rsquo;s alright.</h1>
        <p className="mt-4 font-serif text-lg text-ink-soft">Saved stories and your Style Passport pages you&rsquo;ve opened before are still available. Booking and payments need a connection.</p>
        <div className="mt-8"><Button href="/account">Open my Style Passport</Button></div>
      </Container>
    </Section>
  );
}
