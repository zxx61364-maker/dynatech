export type SectionId =
  | 'boot'
  | 'hero'
  | 'filmstrip'
  | 'office'
  | 'paper'
  | 'client-wall'
  | 'cta'
  | 'finale';

export interface SectionConfig {
  id: SectionId;
  start: number;
  end: number;
  label: string;
}

export interface ProjectFrame {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  color: string;
}

export interface ScrollState {
  lenis: unknown;
  bootPhase: 'idle' | 'booting' | 'complete';
  globalProgress: number;
  globalVelocity: number;
  currentSection: SectionId;
  sectionProgress: Record<SectionId, number>;
  isLocked: boolean;
}

export type PostProcessingPreset = {
  bloom: number;
  grain: number;
  vignette: number;
  rgbShift: number;
  scanlines: number;
  fogDensity: number;
};

export const POST_PRESETS: Record<Exclude<SectionId, 'boot'>, PostProcessingPreset> = {
  hero:      { bloom: 0.3, grain: 0.15, vignette: 0.5, rgbShift: 0.002, scanlines: 0.3, fogDensity: 0.02 },
  filmstrip: { bloom: 0.0, grain: 0.25, vignette: 0.4, rgbShift: 0.0,   scanlines: 0.0, fogDensity: 0.04 },
  office:    { bloom: 0.2, grain: 0.1,  vignette: 0.3, rgbShift: 0.0,   scanlines: 0.0, fogDensity: 0.03 },
  paper:     { bloom: 0.0, grain: 0.08, vignette: 0.0, rgbShift: 0.0,   scanlines: 0.0, fogDensity: 0.0  },
  'client-wall': { bloom: 0.0, grain: 0.08, vignette: 0.0, rgbShift: 0.0, scanlines: 0.0, fogDensity: 0.0 },
  cta:       { bloom: 0.0, grain: 0.12, vignette: 0.3, rgbShift: 0.0,   scanlines: 0.0, fogDensity: 0.0 },
  finale:    { bloom: 0.6, grain: 0.0,  vignette: 0.7, rgbShift: 0.0,   scanlines: 0.0, fogDensity: 0.06 },
};

export const SECTION_CONFIGS: SectionConfig[] = [
  { id: 'hero',        start: 0,    end: 0.15, label: 'Hero' },
  { id: 'filmstrip',   start: 0.15, end: 0.32, label: 'Selected Work' },
  { id: 'office',      start: 0.32, end: 0.48, label: 'About Dynatech' },
  { id: 'paper',       start: 0.48, end: 0.65, label: 'Corporate Manifesto' },
  { id: 'client-wall', start: 0.65, end: 0.78, label: 'Valued Partners' },
  { id: 'cta',         start: 0.78, end: 0.92, label: 'Contact' },
  { id: 'finale',      start: 0.92, end: 1.0,  label: 'Dynatech' },
];
