import { Text } from "@react-email/components";
import { EmailLayout, para } from "./layout";
import type { Outfit } from "@/lib/studio/remix-engine";

export function AskVvEmail({ question, email, outfit, locale }: { question: string; email: string; outfit?: Outfit; locale: string }) {
  return (
    <EmailLayout locale={locale} preview="A client asked about a Closet Remix look." title="Ask Virtuous Vogue">
      <Text style={para}>From: {email}</Text>
      <Text style={para}>“{question}”</Text>
      {outfit ? (
        <Text style={para}>
          Look: {outfit.items.map((p) => `${p.slot}: ${p.item.name ?? p.item.subcategory ?? p.item.category}${p.item.colour ? ` (${p.item.colour})` : ""}`).join(" · ")}
        </Text>
      ) : null}
      <Text style={para}>The full context is attached to the lead in the cockpit.</Text>
    </EmailLayout>
  );
}
