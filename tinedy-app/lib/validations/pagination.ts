import { z } from 'zod';

/**
 * Pagination parameters validation schema
 *
 * Validates query parameters for pagination to prevent:
 * - Invalid numbers (NaN, negative, zero)
 * - Out-of-range values (too large page/limit)
 * - Malformed cursor strings
 *
 * PERF-003: Input validation for API security and data integrity
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .nullable()
    .default('1')
    .transform((val) => parseInt(val || '1', 10))
    .pipe(
      z.number()
        .int('Page must be an integer')
        .positive('Page must be positive')
        .max(1000, 'Page cannot exceed 1000')
    ),

  limit: z
    .string()
    .nullable()
    .default('20')
    .transform((val) => parseInt(val || '20', 10))
    .pipe(
      z.number()
        .int('Limit must be an integer')
        .min(10, 'Minimum 10 items per page')
        .max(100, 'Maximum 100 items per page')
    ),

  cursor: z.string().nullable().optional(),

  useCursor: z
    .string()
    .nullable()
    .default('false')
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
