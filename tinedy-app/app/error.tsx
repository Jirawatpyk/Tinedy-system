'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold font-display mb-2">เกิดข้อผิดพลาด</h1>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        ระบบเกิดข้อผิดพลาดขณะทำงาน
      </h2>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>ลองอีกครั้ง</Button>
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          กลับหน้าหลัก
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-slate-100 rounded-lg max-w-2xl">
          <p className="font-mono text-sm text-red-600">{error.message}</p>
        </div>
      )}
    </div>
  );
}
