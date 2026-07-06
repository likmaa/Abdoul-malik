'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';

const Header = dynamic(() => import('@/frontend/components/Header').then(mod => ({ default: mod.Header })), {
  ssr: true,
});

const Footer = dynamic(() => import('@/frontend/components/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: false,
});

export function ConditionalHeader() {
  return (
    <ErrorBoundary>
      <Header />
    </ErrorBoundary>
  );
}

export function ConditionalFooter() {
  return (
    <ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}
