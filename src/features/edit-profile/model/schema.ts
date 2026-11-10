import { z } from 'zod';
import { isHttpUrl, normalizeHttpUrl } from '@/shared/lib';
import { INDUSTRIES, INTEREST_TAGS } from '@/entities/profile';

const industrySet = new Set<string>(INDUSTRIES);
const tagSet = new Set<string>(INTEREST_TAGS);

export const profileFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Укажите имя и фамилию'),
  company: z.string().trim().min(2, 'Укажите компанию или проект'),
  role: z.string().trim().min(2, 'Укажите должность'),
  industry: z.string().refine((value) => industrySet.has(value), 'Выберите отрасль'),
  city: z.string(),
  website: z
    .string()
    .transform((value) => normalizeHttpUrl(value))
    .refine((value) => isHttpUrl(value), 'Укажите ссылку http(s)'),
  lookingFor: z.string().trim().min(8, 'Опишите, что ищете'),
  offering: z.string().trim().min(8, 'Опишите, что можете предложить'),
  tags: z
    .array(z.string().refine((value) => tagSet.has(value)))
    .min(1, 'Выберите хотя бы один тег')
    .max(8, 'Можно выбрать не больше 8 тегов'),
  catalogConsent: z.boolean(),
  publishConsent: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const emptyProfileForm: ProfileFormValues = {
  fullName: '',
  company: '',
  role: '',
  industry: '',
  city: '',
  website: '',
  lookingFor: '',
  offering: '',
  tags: [],
  catalogConsent: false,
  publishConsent: false,
};
