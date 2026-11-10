import Link from 'next/link';
import { routes } from '@/shared/config/routes';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';

export default function NotFound() {
  return (
    <Container className="py-24">
      <Heading as="h1">Страница не найдена</Heading>
      <p className="mt-4 text-text-muted">Проверьте адрес или вернитесь на сайт форума.</p>
      <div className="mt-8">
        <Button asChild>
          <Link href={routes.home}>На главную</Link>
        </Button>
      </div>
    </Container>
  );
}
