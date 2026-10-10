import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Virtuous Vogue",
    short_name: "Virtuous Vogue",
    description: "Personal styling, wardrobe intelligence and curated fashion for women who dress with intention.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4EFE7",
    theme_color: "#672F40",
    lang: "en",
    categories: ["lifestyle", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Style Studio", url: "/studio", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Book a Consultation", url: "/book" },
      { name: "Magazine", url: "/magazine" },
    ],
  };
}
