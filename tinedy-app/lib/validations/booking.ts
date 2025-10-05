import { z } from 'zod';

export const bookingFormSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อลูกค้า'),
    phone: z.string().regex(/^0\d{9}$/, 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0'),
    email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
    address: z.string().min(1, 'กรุณากรอกที่อยู่'),
  }),
  service: z.object({
    type: z.union([z.literal('cleaning'), z.literal('training')]),
    category: z.union([
      z.literal('deep'),
      z.literal('regular'),
      z.literal('individual'),
      z.literal('corporate'),
    ]),
  }),
  schedule: z.object({
    date: z.string().refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      'วันที่ต้องเป็นวันในอนาคตเท่านั้น'
    ),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'รูปแบบเวลาไม่ถูกต้อง'),
  }),
  notes: z.string().optional(),
  duplicatedFrom: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
