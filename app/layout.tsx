import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NavWrapper } from "@/components/nav-wrapper";
import { Footer } from "@/components/footer";
import { ChatProvider } from "@/components/providers/chat-provider";
import { cn } from "@/lib/utils";
import { FeatureNavigationProvider } from "@/lib/contexts/feature-navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MNKY BLOG",
  description: "A Journal of Thought, Exploration, and Connection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background flex flex-col')}>
        <ThemeProvider
          defaultTheme="dark"
          storageKey="mood-mnky-theme"
        >
          <FeatureNavigationProvider>
            <NavWrapper />
            <main className="pt-24 flex-1">
              {children}
            </main>
            <div className="hidden [.page-root_&]:block">
              <Footer />
            </div>
            <ChatProvider />
            <Toaster />
          </FeatureNavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
