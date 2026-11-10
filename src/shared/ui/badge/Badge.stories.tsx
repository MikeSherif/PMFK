import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'shared/Badge',
  component: Badge,
  args: { children: 'Планируется' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Muted: Story = {};
export const Accent: Story = { args: { tone: 'accent' } };
export const Peach: Story = { args: { tone: 'peach', children: 'До встречи' } };
