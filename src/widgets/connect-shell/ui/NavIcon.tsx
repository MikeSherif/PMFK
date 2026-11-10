import type { ConnectNavIcon } from '../model/content';

export function NavIcon({ name }: { name: ConnectNavIcon }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'feed':
      return (
        <svg {...common}>
          <path d="M12 3 4 8v11h6v-6h4v6h6V8z" />
        </svg>
      );
    case 'saved':
      return (
        <svg {...common}>
          <path d="M7 4h10v16l-5-3-5 3z" />
        </svg>
      );
    case 'matches':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />
        </svg>
      );
    case 'meetings':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      );
    case 'profile':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19a7 7 0 0 1 14 0" />
        </svg>
      );
    case 'ticket':
      return (
        <svg {...common}>
          <path d="M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" />
        </svg>
      );
  }
}
