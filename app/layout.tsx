import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import BootSequence from '@/components/BootSequence';

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
      <body className="font-sans bg-bg text-body min-h-screen flex flex-col selection:bg-accent/30 relative" suppressHydrationWarning>
        {/* Faint grid — reads as terminal chrome without competing with content. */}
        <div
          className="fixed inset-0 z-[-1] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            opacity: 0.35,
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 75%)',
          }}
        />

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
