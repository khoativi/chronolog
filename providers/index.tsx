'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { useState } from 'react';

import { Toaster } from '@/components/ui/sonner';

import { ThemeProvider } from './theme-provider';

export function Providers({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader />
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
