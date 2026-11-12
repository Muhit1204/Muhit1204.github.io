import type { Metadata } from 'next';
import DesktopShell from '@/components/desktop/DesktopShell';

export const metadata: Metadata = { alternates: { canonical: '/desktop' } };

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return <DesktopShell>{children}</DesktopShell>;
}
