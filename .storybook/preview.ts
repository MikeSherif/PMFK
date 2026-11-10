import type { Preview } from '@storybook/react-vite';
import '../src/app/styles/globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'pmfk',
      values: [{ name: 'pmfk', value: '#100018' }],
    },
    a11y: { test: 'todo' },
  },
};

export default preview;
