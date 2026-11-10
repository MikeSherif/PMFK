import { z } from 'zod';

const matchPeerSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  company: z.string(),
  role: z.string(),
});

const matchSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  peer: matchPeerSchema,
});

const messageSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  text: z.string(),
  createdAt: z.string(),
  fromMe: z.boolean(),
  clientId: z.string(),
});

const accessSchema = z.object({
  abilities: z.object({
    canSendInterest: z.boolean(),
    canChat: z.boolean(),
    canBook: z.boolean(),
  }),
  ticket: z.object({
    status: z.enum(['none', 'pending', 'active']),
    label: z.string(),
  }),
});

export const wsEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('message.created'), payload: messageSchema }),
  z.object({ type: z.literal('match.created'), payload: matchSchema }),
  z.object({ type: z.literal('access.updated'), payload: accessSchema }),
]);

export type WsEvent = z.infer<typeof wsEventSchema>;

export function parseWsEvent(raw: unknown): WsEvent | null {
  const parsed = wsEventSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}
