import { Text } from "@react-email/components";
import { EmailLayout, para } from "./layout";

export function LeadEmail(d: { name: string; email: string; phone?: string; topic: string; message: string }) {
  return (
    <EmailLayout locale="en" preview={`New message from ${d.name}`} title="New enquiry">
      <Text style={para}>{d.name} · {d.email}{d.phone ? ` · ${d.phone}` : ""}</Text>
      <Text style={para}>Topic: {d.topic}</Text>
      <Text style={para}>{d.message}</Text>
    </EmailLayout>
  );
}
