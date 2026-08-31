import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import BootSequence from '@/components/BootSequence';
import { PERSON, SITE_URL } from '@/lib/site';
import { publications } from '@/lib/publications';
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

const DESCRIPTION =
  'Md Muntasir Hossain — Doctor of Engineering student and Graduate Research Assistant at Lamar University, researching AI-enabled cybersecurity for LEO satellite communications, Delay Tolerant Networking and maritime satellite reliability.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Md Muntasir Hossain | Research Portfolio',
  description: DESCRIPTION,
  keywords: PERSON.knowsAbout,
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    siteName: 'Md Muntasir Hossain',
    title: 'Md Muntasir Hossain | Research Portfolio',
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${PERSON.name} — research portfolio` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Md Muntasir Hossain | Research Portfolio',
    description: DESCRIPTION,
    images: ['/og.png'],
  },
};

/*
 * Structured data. For an academic this is what lets a search engine connect
 * the person to the papers rather than treating the page as loose text.
 */
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON.name,
      url: SITE_URL,
      email: `mailto:${PERSON.email}`,
      jobTitle: PERSON.jobTitle,
      affiliation: { '@type': 'CollegeOrUniversity', name: PERSON.affiliation },
      knowsAbout: PERSON.knowsAbout,
      sameAs: PERSON.sameAs,
    },
    ...publications.map((publication) => ({
      '@type': 'ScholarlyArticle',
      headline: publication.title,
      name: publication.title,
      abstract: publication.abstract,
      url: publication.link,
      datePublished: publication.date.match(/\d{4}/)?.[0],
      keywords: publication.keywords,
      isPartOf: { '@type': 'PublicationEvent', name: publication.venue },
      author: publication.authors
        .split(',')
        .map((name) => ({ '@type': 'Person', name: name.trim() })),
    })),
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // Built from the same data the page renders, so the two cannot drift.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
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
          <span className="bg-accent text-bg px-1.5 py-0.5">CONNECTED — CDAIC/SATLINK</span>
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
