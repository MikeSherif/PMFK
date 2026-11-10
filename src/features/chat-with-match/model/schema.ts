import { z } from 'zod';

export const messageSchema = z.object({
  text: z.string().trim().min(1, 'Введите текст сообщения').max(2000),
});

export type MessageFormValues = z.infer<typeof messageSchema>;
