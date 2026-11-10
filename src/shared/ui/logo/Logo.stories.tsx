import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

const meta = {
  title: 'shared/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = {};
export const Wordmark: Story = { args: { withWordmark: true } };
export const Large: Story = { args: { size: 'lg', withWordmark: true } };
