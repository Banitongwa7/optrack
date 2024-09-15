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
  description: "OpTrack application developed by David Banitongwa",
  keywords: "optrack, optrack application, nextjs",
  author: "David Banitongwa",
  charset: "utf-8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
