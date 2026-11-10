import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatInput } from './ChatInput';

const meta = {
  title: 'shared/ChatInput',
  component: ChatInput,
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'message',
    label: 'Сообщение',
    placeholder: 'Напишите предложение…',
    sendLabel: 'Отправить ↗',
  },
};
