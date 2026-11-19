import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../context/LenisContext';

/**
 * Resets scroll to top on every route change.
 * Calls the module-level scrollToTop() which hits both DOM scrollTop
 * and the Lenis singleton's internal position immediately.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  useLayoutEffect(() => {
    // Skip the very first render (page load — scroll should already be 0)
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    scrollToTop();
  }, [pathname]);

  return null;
}
