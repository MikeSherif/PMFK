import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { legalStub } from '../content';

type LegalPageProps = {
  title: string;
  body: string;
};

export function LegalPage({ title, body }: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="py-16">
        <Container className="max-w-3xl">
          <Heading as="h1">{title}</Heading>
          <p className="mt-4 text-sm text-peach">{legalStub.notice}</p>
          <p className="mt-6 text-pretty text-text-muted">{body}</p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
