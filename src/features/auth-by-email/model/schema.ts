import { z } from 'zod';

export const emailStepSchema = z.object({
  email: z.email('Укажите рабочий email'),
  consentPdn: z
    .boolean()
    .refine((value) => value === true, 'Нужно согласие на обработку персональных данных'),
});

export const otpStepSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Введите 6 цифр'),
});

export type EmailStepValues = z.infer<typeof emailStepSchema>;
export type OtpStepValues = z.infer<typeof otpStepSchema>;
