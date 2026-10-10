import { Body, Container, Head, Heading, Html, Hr, Preview, Section, Text, Link } from "@react-email/components";

export const brand = {
  ivory: "#F4EFE7",
  ink: "#191816",
  mulberry: "#672F40",
  satin: "#C5AE96",
  muted: "#6F6A63",
};

export function EmailLayout({ preview, title, children, locale = "en" }: { preview: string; title: string; children: React.ReactNode; locale?: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: brand.ivory, fontFamily: "Georgia, 'Times New Roman', serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: "#FBF9F5", maxWidth: 560, margin: "0 auto", padding: "40px 40px 32px" }}>
          <Text style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: brand.mulberry, margin: 0 }}>Virtuous Vogue</Text>
          <Heading as="h1" style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.15, color: brand.ink, margin: "16px 0 24px" }}>
            {title}
          </Heading>
          <Section>{children}</Section>
          <Hr style={{ borderColor: "#DDD4C7", margin: "32px 0 16px" }} />
          <Text style={{ fontSize: 12, color: brand.muted, fontStyle: "italic", margin: 0 }}>Virtue Never Goes Out of Style.</Text>
          <Text style={{ fontSize: 11, color: brand.muted, margin: "8px 0 0" }}>
            <Link href={site} style={{ color: brand.muted }}>
              {site.replace(/^https?:\/\//, "")}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const para = { fontSize: 16, lineHeight: 1.7, color: "#3A3733", margin: "0 0 16px" } as const;
