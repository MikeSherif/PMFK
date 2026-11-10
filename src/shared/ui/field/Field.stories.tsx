import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Input } from './Field';

const meta = {
  title: 'shared/Field',
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'email',
    label: 'Email для входа',
    children: <Input id="email" placeholder="you@company.ru" />,
  },
};

export const Error: Story = {
  args: {
    id: 'email-err',
    label: 'Email для входа',
    error: 'Укажите рабочий email',
    children: <Input id="email-err" invalid placeholder="you@company.ru" />,
  },
};
