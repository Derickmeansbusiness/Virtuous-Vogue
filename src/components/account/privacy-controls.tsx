"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { exportMyData, deleteMyImages, deleteMyAccount } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input, Notice } from "@/components/ui/form";

export function PrivacyControls() {
  const t = useTranslations("account.privacy");
  const router = useRouter();
  const [msg, setMsg] = React.useState<string | null>(null);
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);

  const download = async () => {
    setBusy("export");
    const data = await exportMyData();
    setBusy(null);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "virtuous-vogue-my-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="max-w-xl space-y-10">
      <section className="border-t border-line pt-6">
        <h2 className="display-sm">{t("exportTitle")}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t("exportBody")}</p>
        <Button className="mt-4" variant="secondary" onClick={download} loading={busy === "export"} disabled={Boolean(busy)}>{t("export")}</Button>
      </section>
      <section className="border-t border-line pt-6">
        <h2 className="display-sm">{t("imagesTitle")}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t("imagesBody")}</p>
        <Button className="mt-4" variant="secondary" onClick={async () => { setBusy("images"); const r = await deleteMyImages(); setBusy(null); if (r.ok) setMsg(t("imagesDone", { count: r.count })); }} loading={busy === "images"} disabled={Boolean(busy)}>{t("deleteImages")}</Button>
      </section>
      <section className="border-t border-line pt-6">
        <h2 className="display-sm text-danger">{t("deleteTitle")}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t("deleteBody")}</p>
        <Input className="mt-4 max-w-xs" aria-label={t("typeDelete")} placeholder={t("typeDelete")} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <Button className="mt-4 border-danger bg-danger text-porcelain hover:bg-danger/90" onClick={async () => { setBusy("delete"); const r = await deleteMyAccount(confirm); setBusy(null); if (r.ok) router.push("/"); }} disabled={confirm !== "DELETE" || Boolean(busy)} loading={busy === "delete"}>{t("deleteAccount")}</Button>
      </section>
      {msg ? <Notice tone="success">{msg}</Notice> : null}
      <p className="text-xs text-ink-muted">{t("training")}</p>
    </div>
  );
}
