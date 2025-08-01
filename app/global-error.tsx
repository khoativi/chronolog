'use client';

import * as Sentry from '@sentry/nextjs';
import { Ban } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error
}: Readonly<{
  error: Error;
}>) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { scope: 'global-error' } });
  }, [error]);

  return (
    <html lang="vi">
      <body>
        <div className="h-svh">
          <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
            <Ban size={80} />
            <span className="font-medium text-[2rem]">Lỗi hệ thống</span>
            <p className="text-muted-foreground text-center mb-4">
              Đã xảy ra sự cố ngoài ý muốn.
            </p>
            <Button onClick={() => (window.location.href = '/')}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
