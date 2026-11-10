import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { OtpInput } from './OtpInput';

const meta = {
  title: 'shared/OtpInput',
  component: OtpInput,
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: () => undefined,
  },
  render: function Render() {
    const [value, setValue] = useState('');
    return <OtpInput value={value} onChange={setValue} />;
  },
};

export const Invalid: Story = {
  args: {
    value: '000000',
    onChange: () => undefined,
    invalid: true,
  },
};
