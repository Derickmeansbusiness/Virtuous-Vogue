import "server-only";

/**
 * Background removal abstraction. Providers are optional; when none is
 * configured the original image is used and the UI still works.
 *
 *  BG_REMOVAL_PROVIDER=remove_bg  REMOVE_BG_API_KEY=...
 *  BG_REMOVAL_PROVIDER=photoroom  PHOTOROOM_API_KEY=...
 */
export async function removeBackground(image: Buffer): Promise<Buffer | null> {
  const provider = process.env.BG_REMOVAL_PROVIDER;
  if (!provider || provider === "none") return null;
  if (provider === "remove_bg") {
    const key = process.env.REMOVE_BG_API_KEY;
    if (!key) return null;
    const form = new FormData();
    form.append("image_file", new Blob([new Uint8Array(image)], { type: "image/jpeg" }), "item.jpg");
    form.append("size", "preview");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", { method: "POST", headers: { "X-Api-Key": key }, body: form });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  }
  if (provider === "photoroom") {
    const key = process.env.PHOTOROOM_API_KEY;
    if (!key) return null;
    const form = new FormData();
    form.append("image_file", new Blob([new Uint8Array(image)], { type: "image/jpeg" }), "item.jpg");
    const res = await fetch("https://sdk.photoroom.com/v1/segment", { method: "POST", headers: { "x-api-key": key }, body: form });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  }
  return null;
}
