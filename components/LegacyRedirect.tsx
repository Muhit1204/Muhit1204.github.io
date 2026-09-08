'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LegacyRedirect({ destination, label }: { destination: string; label: string }) {
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <div className="max-w-xl mx-auto py-16 space-y-4">
      <p className="term-label">route moved</p>
      <h1 className="text-2xl font-bold text-body">Opening {label}</h1>
      <p className="text-muted">
        This content now lives on the portfolio homepage. If the redirect does not start,{' '}
        <Link href={destination}>continue to {label}</Link>.
      </p>
    </div>
  );
}