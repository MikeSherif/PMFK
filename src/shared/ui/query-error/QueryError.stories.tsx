import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryError } from './QueryError';

const meta = {
  title: 'shared/QueryError',
  component: QueryError,
} satisfies Meta<typeof QueryError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Не удалось загрузить данные.',
    retryLabel: 'Повторить',
    onRetry: () => undefined,
  },
};
