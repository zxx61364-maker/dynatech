export const COLORS = {
  BLACK_VOID: '#050508',
  CRT_GLOW_BLUE: '#1a1a4e',
  CRT_GLOW_AMBER: '#ffb000',
  TEXT_WARM_WHITE: '#f8f4e6',
  TEXT_INK_BLACK: '#1a1a1a',
  CREAM_PAPER: '#f4efe0',
  FLUORESCENT: '#e8f0e0',
  OFFICE_BEIGE: '#d4c8a8',
  GOLDEN_ACCENT: '#c9a84c',
  RED_ACCENT: '#cc3333',
  GREEN_PHOSPHOR: '#33ff33',
  FILM_SAFELIGHT: '#330800',
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

export const PAGE_HEIGHT = 8;
export const BOOT_DURATION_MS = 2200;

export const PROJECTS: {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}[] = [
  { id: 'p1', title: 'Industrial Automation', subtitle: 'Assembly Line Control Systems', color: '#4a6741' },
  { id: 'p2', title: 'Enterprise Data Mgmt', subtitle: 'Mainframe Database Solutions', color: '#2a4a6b' },
  { id: 'p3', title: 'Office Productivity Suite', subtitle: 'Word Processing & Filing', color: '#6b4a3a' },
  { id: 'p4', title: 'Telecom Network', subtitle: 'PBX Switchboard Integration', color: '#4a3a6b' },
  { id: 'p5', title: 'Executive Dashboard', subtitle: 'Real-Time CRT Data Display', color: '#3a6b4a' },
  { id: 'p6', title: 'Global Distribution', subtitle: 'Logistics & Supply Chain', color: '#6b3a4a' },
];

export const CLIENTS: {
  id: string;
  name: string;
  color: string;
}[] = [
  { id: 'c1', name: 'AmeriCore Industries', color: '#2a4a6b' },
  { id: 'c2', name: 'TransGlobal Shipping', color: '#4a6741' },
  { id: 'c3', name: 'Midwest Financial Group', color: '#6b4a3a' },
  { id: 'c4', name: 'Peterson & Hayes Legal', color: '#3a3a5a' },
  { id: 'c5', name: 'NorthStar Manufacturing', color: '#5a3a4a' },
  { id: 'c6', name: 'Consolidated Retail Corp', color: '#4a5a3a' },
  { id: 'c7', name: 'First Regional Bank', color: '#3a4a5a' },
  { id: 'c8', name: 'Drexel Office Systems', color: '#5a4a3a' },
];

export const CORPORATE_MANIFESTO = {
  heading: 'MAKING BUSINESS MORE BUSINESS-LIKE',
  subheading: 'A Statement of Corporate Philosophy from the Office of the President',
  paragraphs: [
    'Dynatech Corporation has been at the forefront of enterprise solutions since 1982. Our proprietary methodologies leverage cross-functional synergies to maximize stakeholder value across all vertical integration points. We don\'t just think outside the box — we redefine the box as a dynamic paradigm-shifting container for next-generation business ideation.',
    'Our team of dedicated professionals brings over four decades of combined experience in leveraging state-of-the-art technology to give your brand a decisive competitive advantage. Whether disrupting the market with paradigm-shifting office solutions or streamlining operations with cutting-edge digital systems, we provide turnkey solutions that scale.',
    'In today\'s fast-paced corporate landscape, you need a partner who understands the bottom line. At Dynatech, we engineer success through strategic alliances and mutual profitability. Our team is ready to synergize with your organization, unlock new verticals, and maximize your digital ROI. We don\'t just close deals — we deliver results that compound.',
    'We take your business seriously. So seriously, in fact, that we have developed a proprietary 12-point Corporate Excellence Matrix that ensures every decision, every memo, and every fax transmission is optimized for maximum executive impact. Our commitment to quality is rivaled only by our commitment to using the word "quality" in as many sentences as possible.',
  ],
};
