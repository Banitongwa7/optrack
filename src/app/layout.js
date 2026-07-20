import localFont from "next/font/local";
import "./../styles/globals.css";
import NavBar from "@/components/navbar/NavBar";

const geistSans = localFont({
  src: "./../assets/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./../assets/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: "OpTrack",
    template: "%s | OpTrack",
  },
  description:
    "OpTrack centralizes internship, job, apprenticeship and freelance opportunities across countries. Explore them via an interactive map, analytics dashboards, or a searchable table.",
  keywords: [
    "optrack",
    "internship tracker",
    "job opportunities",
    "apprenticeship",
    "freelance",
    "world map",
    "analytics",
    "nextjs",
  ],
  authors: [{ name: "David Banitongwa" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "OpTrack",
    description:
      "Centralize and explore internship, job, apprenticeship and freelance opportunities across the world.",
    type: "website",
    siteName: "OpTrack",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpTrack",
    description:
      "Centralize and explore internship, job, apprenticeship and freelance opportunities across the world.",
    creator: "@Banitongwa7",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          <NavBar />
          <main className="flex-1 min-w-0 min-h-screen bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  );
}
