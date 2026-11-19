/**
 * Module-level Lenis singleton.
 * Lives outside React so it's always accessible immediately,
 * no context timing issues.
 */
import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let _lenis: Lenis | null = null;
let _rafId: number = 0;

/** Access the running Lenis instance from anywhere. */
export function getLenis(): Lenis | null {
  return _lenis;
}

/** Immediately snap scroll to top (DOM + Lenis internal). */
export function scrollToTop() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  if (_lenis) {
    _lenis.scrollTo(0, { immediate: true, force: true } as never);
  }
}

/** Mount once at the app root — starts the RAF loop. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    _lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      _lenis!.raf(time);
      ScrollTrigger.update();
      _rafId = requestAnimationFrame(raf);
    }
    _rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(_rafId);
      _lenis?.destroy();
      _lenis = null;
    };
  }, []);

  return <>{children}</>;
}
