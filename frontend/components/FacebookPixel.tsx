'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initFacebookPixel, trackPageView } from '@/lib/facebook-pixel';

/**
 * Facebook Pixel Component
 *
 * Add this component to your root layout to automatically track page views
 * and initialize Facebook Pixel
 */
export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Facebook Pixel on mount
    initFacebookPixel();
  }, []);

  useEffect(() => {
    // Track page view on route change
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}
