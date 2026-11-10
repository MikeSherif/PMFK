import Link from 'next/link';
import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-text-muted">ПМФК 2026 · цифровой бизнес-дейтинг</p>
        <nav className="flex flex-wrap gap-4 text-sm text-text-muted" aria-label="Юридическая информация">
          <Link href={routes.privacy} className="hover:text-text">
            Политика ПДн
          </Link>
          <Link href={routes.consent} className="hover:text-text">
            Согласие
          </Link>
          <Link href={routes.profilePublication} className="hover:text-text">
            Публикация профиля
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
