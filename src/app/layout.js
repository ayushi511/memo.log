import "./globals.css";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import AuthGate from "@/components/AuthGate";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "memo.log",
  description: "My second brain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-[#F7F3F9] text-[#3A2E42] font-body min-h-screen">
        <AuthGate>
          <main className="px-4 sm:px-8 py-4 sm:py-6 pb-24 max-w-[1400px] mx-auto">{children}</main>
          <Navbar />
        </AuthGate>
      </body>
    </html>
  );
}