import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

rmSync('app/api', { recursive: true, force: true });
rmSync('middleware.ts', { force: true });

const init = spawnSync('pnpm', ['exec', 'msw', 'init', 'public', '--no-save'], {
  stdio: 'inherit',
});

if (init.status !== 0) {
  process.exit(init.status ?? 1);
}
