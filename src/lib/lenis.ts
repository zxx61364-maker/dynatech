import Lenis from 'lenis';
import { useScrollStore } from '@/hooks/useScrollStore';
import { PAGE_HEIGHT } from '@/lib/constants';

let lenisInstance: Lenis | null = null;

export function createLenis(): Lenis {
  const wrapper = document.getElementById('scroll-container');
  if (!wrapper) throw new Error('Scroll container not found');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = new (Lenis as any)({
    wrapper,
    content: wrapper.querySelector('.scroll-content') as HTMLElement || wrapper,
    lerp: 0.08,
    duration: 1.2,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
    normalizeWheel: true,
    autoRaf: false,
  });

  lenisInstance = lenis;

  // Bridge: Lenis scroll events → Zustand store
  lenis.on('scroll', ({ scroll, velocity }: { scroll: number; velocity: number }) => {
    const maxScroll = wrapper.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const progress = Math.max(0, Math.min(1, scroll / maxScroll));
    useScrollStore.getState().setGlobalProgress(progress);
    useScrollStore.getState().setGlobalVelocity(Math.abs(velocity));
  });

  // Set scroll height based on page count
  document.documentElement.style.setProperty('--page-height', String(PAGE_HEIGHT));

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
