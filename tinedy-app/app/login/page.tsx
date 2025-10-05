'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Maps Firebase authentication error codes to user-friendly Thai messages
 *
 * Uses generic messages for auth/user-not-found and auth/wrong-password
 * to prevent user enumeration attacks.
 *
 * @param errorCode - Firebase error code (e.g., 'auth/invalid-email')
 * @returns Thai error message for display to user
 */
const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'อีเมลไม่ถูกต้อง',
    'auth/user-disabled': 'บัญชีนี้ถูกระงับการใช้งาน',
    'auth/user-not-found': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/wrong-password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/too-many-requests': 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่อีกครั้งในภายหลัง',
    'auth/network-request-failed': 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ต',
  };
  return errorMessages[errorCode] || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

      // Get ID token for session cookie
      const idToken = await userCredential.user.getIdToken();

      // Create session cookie via API
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      // Show success toast
      toast.success('เข้าสู่ระบบสำเร็จ');

      // Wait briefly for toast to show, then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    } catch (error) {
      console.error('Login error:', error);
      // Type guard for Firebase error
      const firebaseError = error as { code?: string };
      const errorMessage = firebaseError.code
        ? getFirebaseErrorMessage(firebaseError.code)
        : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
      setAuthError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#f5f3ee]">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-lg">
        {/* Logo placeholder - will be added when logo is available */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-[#2e4057] rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">T</span>
          </div>
          <h1 className="text-3xl font-semibold font-['Raleway'] text-slate-900 mb-2">
            เข้าสู่ระบบ
          </h1>
          <p className="text-sm text-slate-600">
            เข้าสู่ระบบด้วยบัญชีของคุณ
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} role="form" aria-label="แบบฟอร์มเข้าสู่ระบบ">
          {/* Email Field */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="email" className="text-sm font-medium text-slate-900">
              อีเมล <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className={`h-11 ${errors.email ? 'border-red-500 ring-2 ring-red-200' : ''}`}
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2 mb-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-900">
              รหัสผ่าน <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`h-11 pr-10 ${errors.password ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Authentication Error */}
          {authError && (
            <Alert variant="destructive" className="mb-6 mt-4">
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2">
                <p className="text-sm">{authError}</p>
              </div>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-slate-800 text-white hover:bg-slate-700 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </Button>

          {/* Forgot Password Link - Placeholder for future */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => toast.info('ฟีเจอร์นี้จะเปิดให้ใช้งานในอนาคต')}
            >
              ลืมรหัสผ่าน?
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
