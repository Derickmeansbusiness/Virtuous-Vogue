import generated from "./manifest.generated.json";

export type AssetImage = {
  id: string;
  section: string;
  width: number;
  height: number;
  aspect: number;
  widths: number[];
  base: string;
  blurDataURL: string;
  alt: string;
  usage: string;
  dominant: string;
};

export type AssetVideo = {
  id: string;
  section: string;
  width: number;
  height: number;
  outputs: { suffix: string; width: number; mp4: string; webm: string }[];
  poster: AssetImage;
  alt: string;
  usage: string;
};

type Generated = { images: Record<string, AssetImage>; videos: Record<string, AssetVideo>; builtAt: string };
const data = generated as unknown as Generated;

export function getImage(id: string): AssetImage | null {
  return data.images[id] ?? null;
}

export function getVideo(id: string): AssetVideo | null {
  return data.videos[id] ?? null;
}

/** Fallback used until the asset pipeline has produced a given id. */
export const placeholderImage = (id: string, aspect = 1.5): AssetImage => ({
  id,
  section: "placeholder",
  width: 1600,
  height: Math.round(1600 / aspect),
  aspect,
  widths: [],
  base: "",
  blurDataURL: "",
  alt: "",
  usage: "placeholder",
  dominant: "#C5AE96",
});

export const assetsBuiltAt = data.builtAt;
