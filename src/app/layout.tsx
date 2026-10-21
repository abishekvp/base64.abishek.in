import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Base64 Pro Studio — Encode, Decode, Files, Data URIs & Checksums | abishek.in',
  description: 'Professional fullscreen Base64 suite: encode & decode text (UTF-8, URL-Safe), convert files/images to Base64 & Data URIs, reverse Base64 to files with auto-detection, Hex conversion, and checksum verification.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 antialiased overflow-hidden">{children}</body>
    </html>
  );
}
