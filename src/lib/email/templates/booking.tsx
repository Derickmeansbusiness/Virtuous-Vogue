import { Button, Text } from "@react-email/components";
import { EmailLayout, brand, para } from "./layout";
import { formatInTimeZone } from "date-fns-tz";

export function BookingEmail({ kind, locale, name, service, startsAt, timeZone, format, manageUrl, icsUrl, forStylist }: { kind: string; locale: string; name: string; service: string; startsAt: string; timeZone: string; format: string; manageUrl: string; icsUrl: string; forStylist?: boolean }) {
  const fr = locale === "fr";
  const when = formatInTimeZone(new Date(startsAt), timeZone, fr ? "EEEE d MMMM yyyy, HH:mm" : "EEEE d MMMM yyyy, HH:mm");
  const titles: Record<string, [string, string]> = {
    confirmed: ["Your consultation is confirmed.", "Votre consultation est confirmée."],
    pending_confirmation: ["We received your request.", "Nous avons reçu votre demande."],
    reminder_24h: ["See you tomorrow.", "À demain."],
    reminder_2h: ["See you in two hours.", "À dans deux heures."],
    cancelled: ["Your consultation was cancelled.", "Votre consultation a été annulée."],
    rescheduled: ["Your consultation has a new time.", "Votre consultation a un nouvel horaire."],
  };
  const title = (titles[kind] ?? titles.confirmed)[fr ? 1 : 0];
  return (
    <EmailLayout locale={locale} preview={`${service} · ${when}`} title={title}>
      <Text style={para}>{forStylist ? `Client: ${name}` : fr ? `Bonjour ${name},` : `Hello ${name},`}</Text>
      <Text style={para}>
        <strong>{service}</strong>
        <br />
        {when} ({timeZone})
        <br />
        {format === "in_person" ? (fr ? "En personne · Douala" : "In person · Douala") : format === "virtual" ? (fr ? "En ligne (visio)" : "Virtual (video)") : fr ? "Séance de groupe" : "Group session"}
      </Text>
      {kind === "pending_confirmation" ? <Text style={para}>{fr ? "La styliste confirmera le créneau et le tarif sous peu. Rien n'a été débité." : "The stylist will confirm the time and pricing shortly. Nothing has been charged."}</Text> : null}
      {!forStylist ? (
        <>
          <Button href={icsUrl} style={{ backgroundColor: brand.mulberry, color: "#FBF9F5", padding: "12px 20px", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
            {fr ? "Ajouter au calendrier" : "Add to calendar"}
          </Button>
          <Text style={{ ...para, marginTop: 20 }}>
            {fr ? "Reporter ou annuler (jusqu'à 24 h avant) : " : "Reschedule or cancel (up to 24h before): "}
            <a href={manageUrl} style={{ color: brand.mulberry }}>
              {manageUrl}
            </a>
          </Text>
        </>
      ) : (
        <Text style={para}>
          <a href={manageUrl} style={{ color: brand.mulberry }}>
            Open in the cockpit
          </a>
        </Text>
      )}
    </EmailLayout>
  );
}
