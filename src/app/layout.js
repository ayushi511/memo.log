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
  title: "memo.log: Your Digital Archive",
  description: "memo.log is a personal journaling and life-archiving app with AI-powered weekly, monthly and yearly reflections. Document your journal entries, creative work, recipes, books and movies — all in one private space.",
  keywords: ["personal journaling app", "AI journal", "digital diary", "life archive", "reflective journaling"],
  metadataBase: new URL("https://memo-log-lime.vercel.app"),
  openGraph: {
    title: "memo.log: Your Digital Archive",
    description: "Document your life with AI-powered reflection. Journal entries, creative work, recipes, books and movies — all in one private space.",
    url: "https://memo-log-lime.vercel.app",
    siteName: "memo.log",
    type: "website",
    images: [
      {
        url: "/og_image.png", 
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "memo.log: Your Digital Archive",
    description: "Document your life. Reminisce your archive.",
    images: ["/og_image.png"],
  },
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