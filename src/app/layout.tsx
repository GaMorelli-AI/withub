import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import { StoreHydrator } from "@/components/StoreHydrator";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";

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
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <ThemeProvider>
          <I18nProvider>
            <ToastProvider>
              <StoreHydrator />
              <Navbar />
              <div className="flex flex-1 flex-col">{children}</div>
            </ToastProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
