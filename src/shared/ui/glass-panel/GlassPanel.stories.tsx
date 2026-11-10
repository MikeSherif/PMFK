import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassPanel } from './GlassPanel';

const meta = {
  title: 'shared/GlassPanel',
  component: GlassPanel,
} satisfies Meta<typeof GlassPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: 'p-8', children: 'Стеклянная панель' },
};
