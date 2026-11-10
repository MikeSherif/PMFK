import Link from 'next/link';
import { type ComponentProps } from 'react';

type AppLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/** Hash anchors and mailto fallbacks are not in the typed route union. */
export function AppLink({ href, ...props }: AppLinkProps) {
  return <Link href={href as ComponentProps<typeof Link>['href']} {...props} />;
}
