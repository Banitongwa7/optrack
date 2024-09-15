import localFont from "next/font/local";
import Head from "next/head";


export default function CustomLayout({ children }) {
  return (
    <html lang="en">
       <Head>
        <title>OpTrack</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="OpTrack application developed by David Banitongwa" />
        <meta name="author" content="David Banitongwa" />
        <meta charSet="utf-8" />
        <meta name="keywords" content="optrack, optrack application, nextjs" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
