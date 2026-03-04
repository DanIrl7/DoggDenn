import { useEffect, useRef } from 'react';

export function useParallax(speed = 0.2, smoothing = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const target = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const parent = element.parentElement;
    if (!parent) return;

    // Detect if mobile and increase parallax speed on mobile for visibility
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const effectiveSpeed = isMobile ? speed * 3 : speed;

    // Calculate the section's natural center from page top once on mount,
    // before any transforms are applied. This avoids a feedback loop where
    // reading getBoundingClientRect() on the transformed element would
    // return an offset position each frame.
    const parentRect = parent.getBoundingClientRect();
    const sectionCenterFromTop = parentRect.top + window.scrollY + parentRect.height / 2;
    const scrollAtCenter = sectionCenterFromTop - window.innerHeight / 2;

    const handleScroll = () => {
      target.current = (window.scrollY - scrollAtCenter) * effectiveSpeed;
    };

    // Set correct initial target so there's no jump on first render
    handleScroll();

    let rafId: number;
    const animate = () => {
      current.current += (target.current - current.current) * smoothing;
      element.style.transform = `translateY(${current.current}px) scale(1.1)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed, smoothing]);

  return ref;
}
