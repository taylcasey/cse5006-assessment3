import { Spectral, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteProvider from "@/context/SiteProvider";
import type { Metadata } from "next";


const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RSS Feed for LMS",
  description: "A frontend interface for an RSS Server feeding into an LMS.",
};

// Root Layout: wraps every page with fonts, global styles, SiteProvider and shared components - 
// Header/NavBar/Breadcrumbs/Footer, plus a skip-to-content link for keyboard users
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spectral.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded-br-lg">
          Skip to main content
        </a>
        <SiteProvider>
          <Header />
          <NavBar />
          <Breadcrumbs />
          <div id="main-content" className="flex-1">
            {children}
          </div>
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}