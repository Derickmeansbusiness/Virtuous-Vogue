import { Text } from "@react-email/components";
import { EmailLayout, para } from "./layout";

export function WelcomeEmail({ locale }: { locale: string }) {
  const fr = locale === "fr";
  return (
    <EmailLayout
      locale={locale}
      preview={fr ? "Une note réfléchie sur le style et la garde-robe." : "A considered note on style and wardrobe."}
      title={fr ? "Bienvenue dans The Virtuous Edit." : "Welcome to The Virtuous Edit."}
    >
      <Text style={para}>
        {fr
          ? "Merci de nous lire. Quelques fois par mois, vous recevrez une courte lettre sur le style personnel, l'intelligence de garde-robe et une vie intentionnelle. Rien de bruyant, rien de pressant."
          : "Thank you for reading. A few times a month you'll receive a short letter on personal style, wardrobe intelligence and intentional living. Nothing noisy, nothing pushy."}
      </Text>
      <Text style={para}>
        {fr
          ? "En attendant, le Style Compass est une belle façon de commencer : deux à quatre minutes pour mettre des mots sur votre direction de style."
          : "In the meantime, the Style Compass is a lovely place to start: two to four minutes to put words to your style direction."}
      </Text>
    </EmailLayout>
  );
}
