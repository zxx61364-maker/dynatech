import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dynatech Corporation — Business Solutions for the Modern Enterprise',
  description:
    'Since 1982, Dynatech Corporation has pioneered enterprise workflow solutions, leveraging cross-functional synergies to maximize stakeholder value across all vertical integration points.',
  openGraph: {
    title: 'Dynatech Corporation',
    description: 'Business Solutions for the Modern Enterprise. Est. 1982.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="h-full">
        {children}
      </body>
    </html>
  );
}
