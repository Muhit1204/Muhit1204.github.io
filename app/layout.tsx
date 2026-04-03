import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Md Muntasir Hossain | Research Portfolio',
  description: 'Interactive research portfolio of Md Muntasir Hossain. MS in Computer Science at Lamar University.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FTSNVMRKNX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FTSNVMRKNX');
        `}</Script>
      </head>
      <body className="font-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-indigo-500/30 relative" suppressHydrationWarning>
        {/* Dynamic Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-100/40 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-100/40 blur-[120px]" />

        </div>

        <Navbar />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
