import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";

export const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bodoni",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-serif",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const fontVariables = `${bodoni.variable} ${manrope.variable} ${sourceSerif.variable}`;
