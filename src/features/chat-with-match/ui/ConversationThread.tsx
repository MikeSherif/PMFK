'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { connectMessages, flags, routes } from '@/shared/config';
import { useOnlineStatus } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { ChatBubble } from '@/shared/ui/chat-bubble';
import { ChatInput } from '@/shared/ui/chat-input';
import { EmptyState } from '@/shared/ui/empty-state';
import { QueryError } from '@/shared/ui/query-error';
import { Skeleton } from '@/shared/ui/skeleton';
import { matchQuery } from '@/entities/match';
import { formatMessageTime, useConversation, useWsStatus } from '@/entities/message';
import { Can } from '@/entities/viewer';
import { chatCopy } from '../model/content';
import { messageSchema, type MessageFormValues } from '../model/schema';

type ConversationThreadProps = {
  matchId: string;
  emptyTitle: string;
};

export function ConversationThread({ matchId, emptyTitle }: ConversationThreadProps) {
  const router = useRouter();
  const matchQueryResult = useQuery(matchQuery(matchId));
  const conversation = useConversation(matchId);
  const online = useOnlineStatus();
  const wsStatus = useWsStatus();
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketNotice = !online
    ? chatCopy.offline
    : flags.connectChatEnabled && (wsStatus === 'connecting' || wsStatus === 'reconnecting')
      ? chatCopy.reconnecting
      : flags.connectChatEnabled && wsStatus === 'closed'
        ? chatCopy.disconnected
        : null;
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { text: '' },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [conversation.messages.length]);

  const peer = matchQueryResult.data?.peer;
  const latestInbound = [...conversation.messages].reverse().find((message) => !message.fromMe);

  return (
    <div className="flex flex-col gap-6">
      {matchQueryResult.isPending ? (
        <Skeleton className="h-5 w-64" />
      ) : matchQueryResult.isError ? (
        <QueryError
          title={connectMessages.loadError}
          retryLabel={connectMessages.retry}
          onRetry={() => void matchQueryResult.refetch()}
        />
      ) : peer ? (
        <p className="text-sm text-text-muted">
          {peer.fullName} · {peer.role} · {peer.company}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={routes.connect.matches}>{chatCopy.back}</Link>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => void conversation.refresh()}>
          {chatCopy.refresh}
        </Button>
        <Can ability="canBook" paywall>
          <Button variant="secondary" size="sm" onClick={() => router.push(routes.connect.meetings)}>
            {chatCopy.propose}
          </Button>
        </Can>
      </div>
      <div className="flex min-h-72 flex-col gap-3 rounded-lg border border-border p-4">
        {conversation.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : conversation.errorMessage && conversation.messages.length === 0 ? (
          <QueryError
            title={conversation.errorMessage}
            retryLabel={connectMessages.retry}
            onRetry={() => void conversation.refresh()}
          />
        ) : conversation.messages.length === 0 ? (
          <EmptyState title={emptyTitle} />
        ) : (
          conversation.messages.map((message) => (
            <ChatBubble
              key={message.id}
              fromMe={message.fromMe}
              text={message.text}
              meta={[
                formatMessageTime(message.createdAt),
                message.status === 'sending' ? chatCopy.sending : null,
                message.status === 'failed' ? chatCopy.failed : null,
              ]
                .filter((part): part is string => Boolean(part))
                .join(' · ')}
              {...(message.status === 'failed'
                ? {
                    action: (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => conversation.send(message.text, message.clientId)}
                      >
                        {chatCopy.retry}
                      </Button>
                    ),
                  }
                : {})}
            />
          ))
        )}
        <div ref={bottomRef} />
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {latestInbound?.text ?? ''}
        </p>
      </div>
      {socketNotice ? (
        <p className="text-sm text-peach" role="status" aria-live="polite">
          {socketNotice}
        </p>
      ) : null}
      {conversation.errorMessage ? (
        <p className="text-sm text-danger" role="alert">
          {conversation.errorMessage}
        </p>
      ) : null}
      <form
        onSubmit={form.handleSubmit((values) => {
          conversation.send(values.text);
          form.reset({ text: '' });
        })}
        noValidate
      >
        <ChatInput
          id="message"
          label={chatCopy.composerLabel}
          placeholder={chatCopy.placeholder}
          sendLabel={chatCopy.send}
          error={form.formState.errors.text?.message ?? ''}
          sending={conversation.sending}
          {...form.register('text')}
          disabled={!online}
        />
      </form>
    </div>
  );
}
