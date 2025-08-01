import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Providers } from '@/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: {
    default: 'ChronoLog: Nhật ký dự án & Quản lý sự kiện theo Timeline',
    template: '%s | ChronoLog'
  },
  description:
    'ChronoLog là nền tảng quản lý dự án trực quan, giúp ghi lại và theo dõi mọi sự kiện quan trọng của dự án (từ cột mốc, báo cáo test k6 đến fix bug) dưới dạng timeline sinh động.',
  openGraph: {
    title: 'ChronoLog: Nhật ký dự án & Quản lý sự kiện theo Timeline',
    description:
      'ChronoLog là nền tảng quản lý dự án trực quan, giúp ghi lại và theo dõi mọi sự kiện quan trọng của dự án (từ cột mốc, báo cáo test k6 đến fix bug) dưới dạng timeline sinh động.'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
