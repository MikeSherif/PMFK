import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'PMFK';
const basePath = isGithubPages ? `/${repositoryName}` : '';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://mc.yandex.ru",
  "font-src 'self'",
  "connect-src 'self' https://mc.yandex.ru wss: ws:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  trailingSlash: isGithubPages,
  images: {
    unoptimized: isGithubPages,
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_GITHUB_PAGES: isGithubPages ? 'true' : '',
  },
};

if (basePath) {
  nextConfig.basePath = basePath;
}

if (!isGithubPages) {
  nextConfig.headers = async () => [
    {
      source: '/:path*',
      headers: [...securityHeaders, { key: 'Content-Security-Policy', value: csp }],
    },
  ];
}

export default nextConfig;
