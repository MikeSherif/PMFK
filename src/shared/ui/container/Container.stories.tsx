import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';

const meta = {
  title: 'shared/Container',
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Контейнер лендинга и CONNECT.',
  },
};
