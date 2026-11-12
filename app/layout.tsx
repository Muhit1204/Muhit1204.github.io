import type { Metadata, Viewport } from 'next';
import { Noto_Serif, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { PERSON, SITE_URL } from '@/lib/site';
import { publications } from '@/lib/publications';
import { serializeJsonLd } from '@/lib/json-ld';

// Noto Serif carries body copy. It keeps the `--font-sans` variable so the
// `font-sans` utility and every component using it stay as they are.
const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// JetBrains Mono carries the terminal voice: prompts, labels, metadata.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const DESCRIPTION =
  'Md Muntasir Hossain — Doctor of Engineering student and Graduate Research Assistant at Lamar University, researching AI-enabled cybersecurity for LEO satellite communications, Delay Tolerant Networking and maritime satellite reliability.';

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

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
      identifier: `https://doi.org/${publication.doi}`,
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
    <html lang="en" className={`${notoSerif.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // Built from the same data the page renders, so the two cannot drift.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(STRUCTURED_DATA) }}
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FTSNVMRKNX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FTSNVMRKNX');
        `}</Script>
      </head>
      <body className="font-sans text-body min-h-screen selection:bg-accent/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
