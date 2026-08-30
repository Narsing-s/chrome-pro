import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chrome Pro',
  description: 'Fast, private and intelligent browser workspace',
  manifest: '/manifest.webmanifest',
  themeColor: '#2563eb',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
