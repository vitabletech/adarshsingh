import type { Metadata } from "next";
import "./styles.css";

const siteUrl = "https://msrajawat298.github.io/modeling-portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: "Adarsh Singh Kushwah — Male Model Portfolio",
  description:
    "Fashion, commercial and editorial portfolio of Indian male model Adarsh Singh Kushwah. View selected looks and enquire about bookings.",
  keywords: [
    "Adarsh Singh Kushwah",
    "Indian male model",
    "male model portfolio India",
    "fashion model",
    "commercial model",
    "editorial model",
  ],
  alternates: { canonical: "./" },
  openGraph: {
    title: "Adarsh Singh Kushwah — Male Model Portfolio",
    description:
      "Selected fashion, commercial and editorial looks. Enquire about a project or booking.",
    url: `${siteUrl}/`,
    siteName: "Adarsh Singh Kushwah",
    type: "profile",
    images: [{ url: `${siteUrl}/images/1.webp`, width: 560, height: 840, alt: "Adarsh Singh Kushwah fashion portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adarsh Singh Kushwah — Male Model Portfolio",
    images: [`${siteUrl}/images/1.webp`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
