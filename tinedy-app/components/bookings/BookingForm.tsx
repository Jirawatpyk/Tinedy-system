'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { BookingFormData, bookingFormSchema } from '@/lib/validations/booking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { ServiceType, ServiceCategory } from '@/types/booking';

interface BookingFormProps {
  mode?: 'create' | 'edit';
  initialData?: Partial<BookingFormData>;
  onSubmit: (data: BookingFormData) => Promise<void>;
  isSubmitting?: boolean;
}

type FormValues = {
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  service: {
    type?: ServiceType;
    category?: ServiceCategory;
  };
  schedule: {
    date: string;
    startTime: string;
  };
  notes?: string;
};

export function BookingForm({
  mode = 'create',
  initialData,
  onSubmit,
  isSubmitting = false,
}: BookingFormProps) {
  const form = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      customer: {
        name: initialData?.customer?.name || '',
        phone: initialData?.customer?.phone || '',
        email: initialData?.customer?.email || '',
        address: initialData?.customer?.address || '',
      },
      service: {
        type: initialData?.service?.type || undefined,
        category: initialData?.service?.category || undefined,
      },
      schedule: {
        date: initialData?.schedule?.date || '',
        startTime: initialData?.schedule?.startTime || '',
      },
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Validate using Zod before submitting
      const validatedData = bookingFormSchema.parse(data);

      // Add duplicatedFrom if this is a duplicate
      const submitData: BookingFormData = {
        ...validatedData,
        ...(initialData?.duplicatedFrom && { duplicatedFrom: initialData.duplicatedFrom }),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Customer Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ข้อมูลลูกค้า</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ระบุชื่อ-นามสกุล" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="0812345678 (10 หลัก)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>เบอร์โทรศัพท์ 10 หลัก ขึ้นต้นด้วย 0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customer.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ที่อยู่ <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ระบุที่อยู่สำหรับให้บริการ"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Service Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ข้อมูลบริการ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="service.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ประเภทบริการ <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกประเภทบริการ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cleaning">ทำความสะอาด</SelectItem>
                        <SelectItem value="training">อบรม</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service.category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      หมวดหมู่บริการ <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกหมวดหมู่" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {form.watch('service.type') === 'cleaning' ? (
                          <>
                            <SelectItem value="deep">ทำความสะอาดแบบลึก</SelectItem>
                            <SelectItem value="regular">ทำความสะอาดทั่วไป</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="individual">อบรมรายบุคคล</SelectItem>
                            <SelectItem value="corporate">อบรมองค์กร</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">กำหนดการ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schedule.date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      วันที่ <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>เลือกวันที่ต้องการให้บริการ</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schedule.startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      เวลาเริ่มต้น <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>เวลาที่ต้องการให้เริ่มบริการ</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">รายละเอียดเพิ่มเติม</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หมายเหตุ / คำขอพิเศษ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ระบุรายละเอียดเพิ่มเติมหรือคำขอพิเศษ (ถ้ามี)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            ล้างข้อมูล
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'สร้างการจอง' : 'บันทึกการเปลี่ยนแปลง'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
