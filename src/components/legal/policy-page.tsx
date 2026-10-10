import { Container, Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/typography";

export function PolicyPage({ eyebrow, title, updated, sections }: { eyebrow: string; title: string; updated: string; sections: { title: string; body: string[] }[] }) {
  return (
    <Section tone="porcelain" className="pt-[calc(var(--vv-header-h)+2.5rem)]">
      <Container narrow>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display-lg mt-3">{title}</h1>
        <p className="mt-3 text-xs text-ink-muted">{updated}</p>
        <div className="prose-editorial mt-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.body.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
