import "./globals.css";
import { Geist, Geist_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import "boxicons/css/boxicons.min.css";


// 🔹 ฟอนต์ IBM Plex Sans Thai
const ibmPlexThai = IBM_Plex_Sans_Thai({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["thai"],
  variable: "--font-ibm-plex-thai",
});

// 🔹 ฟอนต์ของ Next.js เอง (Geist + Geist Mono)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TJC Corporation",
  description: "เว็บไซต์บริษัท TJC Corporation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${ibmPlexThai.className} ${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}
