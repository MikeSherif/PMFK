import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatBubble } from './ChatBubble';

const meta = {
  title: 'shared/ChatBubble',
  component: ChatBubble,
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Theirs: Story = {
  args: {
    fromMe: false,
    text: 'Здравствуйте! Готовы обсудить коллаборацию на форуме.',
    meta: '10.11.2026, 20:44:51',
  },
};

export const Mine: Story = {
  args: {
    fromMe: true,
    text: 'Да, давайте обсудим формат коллаборации на форуме.',
    meta: '10.11.2026, 20:46:42',
  },
};
