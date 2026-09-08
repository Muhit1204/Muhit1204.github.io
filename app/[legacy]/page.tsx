import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegacyRedirect from '@/components/LegacyRedirect';
import { LEGACY_ROUTES, legacyDestination, type LegacyRoute } from '@/lib/legacy-routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEGACY_ROUTES).map((legacy) => ({ legacy }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legacy: string }>;
}): Promise<Metadata> {
  const { legacy } = await params;
  if (!(legacy in LEGACY_ROUTES)) return {};
  const route = legacy as LegacyRoute;
  const label = LEGACY_ROUTES[route];
  return {
    title: label[0].toUpperCase() + label.slice(1) + ' | Md Muntasir Hossain',
    alternates: { canonical: legacyDestination(route) },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyPage({ params }: { params: Promise<{ legacy: string }> }) {
  const { legacy } = await params;
  if (!(legacy in LEGACY_ROUTES)) notFound();

  const route = legacy as LegacyRoute;
  const label = LEGACY_ROUTES[route];
  return <LegacyRedirect destination={legacyDestination(route)} label={label} />;
}