import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';

const meta = {
  title: 'shared/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onValueChange: () => undefined,
    children: null,
  },
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <Select value={value} onValueChange={setValue} placeholder="Маркетинг и PR">
        <Select.Item value="Маркетинг и PR">Маркетинг и PR</Select.Item>
        <Select.Item value="ИТ">ИТ</Select.Item>
      </Select>
    );
  },
};
