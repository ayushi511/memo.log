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
  title: "Ayushi OS",
  description: "My second brain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-[#F7F3F9] text-[#3A2E42] font-body min-h-screen">
        <AuthGate>
          <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 px-10 py-10">{children}</main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}