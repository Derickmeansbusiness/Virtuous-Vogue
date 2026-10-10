import { redirect } from "next/navigation";
import { checkPayment } from "@/lib/actions/booking";

/** Return URL from hosted payment pages: verifies server-side, then lands on the manage page. */
export default async function ConfirmReturn({ params, searchParams }: { params: Promise<{ token: string; locale: string }>; searchParams: Promise<{ payment?: string }> }) {
  const { token, locale } = await params;
  const { payment } = await searchParams;
  if (payment) await checkPayment(payment).catch(() => null);
  redirect(`${locale === "fr" ? "/fr" : ""}/book/manage/${token}`);
}
