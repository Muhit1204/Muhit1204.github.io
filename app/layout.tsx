import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import BootSequence from '@/components/BootSequence';
import GlyphField from '@/components/GlyphField';
import StatusTicker from '@/components/StatusTicker';

// Inter carries body copy — the long research prose stays readable.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// JetBrains Mono carries the terminal voice: headings, nav, labels, metadata.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Md Muntasir Hossain | Research Portfolio',
  description: 'Interactive research portfolio of Md Muntasir Hossain. Doctor of Engineering student in Electrical & Computer Engineering at Lamar University, researching deep space and LEO satellite communication.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FTSNVMRKNX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FTSNVMRKNX');
        `}</Script>
      </head>
      <body className="font-mono bg-bg text-body min-h-screen flex flex-col selection:bg-accent/30 relative" suppressHydrationWarning>
        {/* Scroll reveal starts hidden and is un-hidden by script. Without
            script there is nothing to un-hide it, so show everything. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>

        {/* Ambient layers. All decorative, all hidden from assistive tech. */}
        <GlyphField />
        <div className="scanlines" aria-hidden="true" />

        {/* HUD corners */}
        <div
          aria-hidden="true"
          className="hidden xl:block fixed left-4 top-3 z-30 pointer-events-none text-[0.62rem] tracking-widest"
        >
          <span className="bg-accent text-bg px-1.5 py-0.5">CONNECTED — CDAC/SATLINK</span>
        </div>
        <div
          aria-hidden="true"
          className="hidden xl:block fixed right-24 bottom-7 z-30 pointer-events-none text-[0.62rem] tracking-widest text-muted"
        >
          <span className="text-accent">30.08N 94.13W</span> · PORT OF BEAUMONT
        </div>

        <StatusTicker />

        {/*
          Decorative overlay only. The page below renders from first paint so
          the boot animation never delays LCP or hides content from a reader.
        */}
        <BootSequence />

        <Navbar />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
