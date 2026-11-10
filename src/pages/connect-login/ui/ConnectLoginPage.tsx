import Link from 'next/link';
import { flags, routes } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import { Container } from '@/shared/ui/container';
import { Field, Input } from '@/shared/ui/field';
import { Heading } from '@/shared/ui/heading';
import { Logo } from '@/shared/ui/logo';

export function ConnectLoginPage() {
  return (
    <div className="min-h-dvh bg-mesh">
      <header className="flex items-center justify-between px-5 py-4">
        <Logo withWordmark />
        <span className="text-sm text-text-muted">CONNECT</span>
      </header>
      {flags.demoMode ? (
        <p className="bg-demo px-4 py-2 text-center text-xs text-demo-fg">
          ДЕМО-РЕЖИМ: тестовая среда, регистрация и доступы только для локальных испытаний. Здесь нет
          реальных участников.
        </p>
      ) : null}
      <Container className="max-w-xl py-16">
        <p className="text-xs tracking-[0.2em] text-peach uppercase">ПМФК CONNECT · вход</p>
        <Heading as="h1" className="mt-4" accent="Ещё до форума.">
          Найди своих.
        </Heading>
        <p className="mt-4 text-text-muted">
          Заполните короткий профиль, посмотрите реальные бизнес-запросы и найдите потенциальных
          партнёров.
        </p>
        <Card className="mt-8">
          <form className="flex flex-col gap-4">
            <Field id="email" label="Email для входа">
              <Input id="email" name="email" type="email" placeholder="you@company.ru" autoComplete="email" />
            </Field>
            <Checkbox
              name="consent"
              label="Даю отдельное согласие на обработку персональных данных для создания аккаунта и входа."
            />
            <Button type="submit" disabled>
              Получить код на email ↗
            </Button>
            <p className="text-xs text-text-muted">Пароль не нужен. Контакты не публикуются в карточках.</p>
          </form>
        </Card>
        <p className="mt-8 text-sm text-text-muted">
          <Link href={routes.home} className="text-accent hover:underline">
            На сайт форума ↗
          </Link>
        </p>
      </Container>
    </div>
  );
}
