import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <FileX className="h-16 w-16 text-slate-400 mb-4" />
      <h1 className="text-4xl font-bold font-display mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-900 mb-4">ไม่พบหน้าที่คุณต้องการ</h2>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        ขออภัย หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือไม่มีอยู่ในระบบ
      </p>
      <Link href="/">
        <Button>กลับหน้าหลัก</Button>
      </Link>
    </div>
  );
}
