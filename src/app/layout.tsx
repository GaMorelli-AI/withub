import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import { StoreHydrator } from "@/components/StoreHydrator";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WitHub — Knowledge has value",
  description:
    "Ask people who actually know. Connect with experts, ask questions and get answers from people with real experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <ToastProvider>
          <StoreHydrator />
          <Navbar />
          <div className="flex flex-1 flex-col">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
