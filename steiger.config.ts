import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ['**/__mocks__/**', '**/*.stories.tsx', '**/*.test.ts', '**/*.test.tsx'],
  },
  {
    rules: {
      // CONNECT features often live on a single screen and should not be merged into pages.
      'fsd/insignificant-slice': 'off',
    },
  },
]);
