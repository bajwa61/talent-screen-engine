import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentScreen AI | Candidate Review & Dossier Normalizer",
  description: "Production recruiting engine with criteria evidence scoring, anti-hallucination quote grounding, and ATS integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
