import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mohammed Nibras | Co-Founder & Developer at Tapfolio",
  description: "Meet Mohammed Nibras, the Co-Founder and Lead Developer of Tapfolio. Discover his professional portfolio, experience, and projects.",
  keywords: [
    "Mohammed Nibras",
    "Nibras Tapfolio",
    "Co-Founder Tapfolio",
    "Developer Tapfolio",
    "Software Engineer",
    "NFC profile",
  ],
  openGraph: {
    title: "Mohammed Nibras | Co-Founder & Developer at Tapfolio",
    description: "Meet Mohammed Nibras, the Co-Founder and Lead Developer of Tapfolio.",
    type: "profile",
    url: "https://www.tapfolio.me/co-founder/nibras",
    siteName: "Tapfolio",
  },
};

export default function NibrasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
