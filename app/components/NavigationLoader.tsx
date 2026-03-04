'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNavigationStore } from '@/app/store/navigationStore';

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

function getAnchorFromTarget(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest('a');
}

function isInternalNavigation(anchor: HTMLAnchorElement) {
  const hrefAttr = anchor.getAttribute('href');
  if (!hrefAttr) return false;

  // Ignore same-page anchors
  if (hrefAttr.startsWith('#')) return false;

  // Ignore special protocols
  if (hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:') || hrefAttr.startsWith('sms:')) return false;

  // Ignore downloads or non-self targets
  if (anchor.hasAttribute('download')) return false;
  const target = anchor.getAttribute('target');
  if (target && target !== '_self') return false;

  try {
    const url = new URL(hrefAttr, window.location.href);
    if (url.origin !== window.location.origin) return false;

    const current = new URL(window.location.href);
    if (url.pathname === current.pathname && url.search === current.search && url.hash === current.hash) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigating = useNavigationStore((s) => s.isNavigating);
  const start = useNavigationStore((s) => s.start);
  const stop = useNavigationStore((s) => s.stop);

  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start immediately on any internal link click (global capture).
  useEffect(() => {
    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (isModifiedClick(event)) return;

      const anchor = getAnchorFromTarget(event.target);
      if (!anchor) return;
      if (!isInternalNavigation(anchor)) return;

      start();
    };

    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, [start]);

  // Stop when the route actually changes.
  useEffect(() => {
    stop({ minDurationMs: 350 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Animate in/out (can't animate if we unmount immediately).
  useEffect(() => {
    const exitDurationMs = 200;

    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    if (isNavigating) {
      setIsRendered(true);
      // Next tick so the browser can apply the initial classes before transitioning.
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);
    exitTimerRef.current = setTimeout(() => {
      setIsRendered(false);
    }, exitDurationMs);
  }, [isNavigating]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  if (!isRendered) return null;

  return (
    <div
      className={
        `pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center px-6 ` +
        `transition-opacity duration-200 ease-out ` +
           (isVisible ? 'opacity-100 bg-background/60' : 'opacity-0 bg-background/0')
      }
    >
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading"
        className={
          `flex flex-col items-center gap-4 rounded-lg bg-card px-10 py-8 text-center ` +
          `transition-all duration-200 ease-out origin-center will-change-transform ` +
             (isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0')
        }
      >
        <div className="flex items-end gap-2 text-primary">
          <span className="inline-block text-8xl animate-bounce" style={{ animationDelay: '0ms' }}>
            🐾
          </span>
          <span className="inline-block text-8xl animate-bounce" style={{ animationDelay: '150ms' }}>
            🐾
          </span>
          <span className="inline-block text-8xl animate-bounce" style={{ animationDelay: '300ms' }}>
            🐾
          </span>
        </div>
        <p
          className="text-2xl font-extrabold tracking-wide"
          style={{
            color: '#fff',
            WebkitTextStroke: '1px #000',
            textShadow: '0 2px 0 rgba(0,0,0,0.35)',
          }}
        >
          Loading…
        </p>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
