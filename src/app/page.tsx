'use client';

import dynamic from 'next/dynamic';
import { ScrollContainer } from '@/components/dom/ScrollContainer';
import { BootOverlay } from '@/components/canvas/scenes/BootOverlay';
import { TransitionOverlay } from '@/components/dom/TransitionOverlay';

const CanvasRoot = dynamic(
  () => import('@/components/canvas/CanvasRoot').then((m) => ({ default: m.CanvasRoot })),
  { ssr: false },
);

export default function Home() {
  return (
    <>
      {/* Boot screen overlay — DOM-rendered, auto-dismisses */}
      <BootOverlay />

      {/* 3D Canvas layer — z-40, fixed */}
      <CanvasRoot />

      {/* DOM scroll layer — z-50, fixed */}
      <ScrollContainer />

      {/* Chapter transition overlay — z-46 */}
      <TransitionOverlay />
    </>
  );
}
