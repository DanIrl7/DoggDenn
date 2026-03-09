'use client';

import type { ReactNode } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';

export default function ParallaxProviderClient({ children }: { children: ReactNode }) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}