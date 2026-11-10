'use client';

import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Container className="py-24">
      <Heading as="h1">Что-то пошло не так</Heading>
      <p className="mt-4 text-text-muted">Обновите страницу. Если ошибка повторится, напишите организаторам.</p>
      <div className="mt-8">
        <Button onClick={reset}>Повторить</Button>
      </div>
    </Container>
  );
}
