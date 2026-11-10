import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TagGroup } from './TagGroup';

const tags = ['Кросс-промо', 'HoReCa', 'FMCG', 'Ритейл', 'ИТ'] as const;

const meta = {
  title: 'shared/TagGroup',
  component: TagGroup,
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: tags,
    value: ['HoReCa'],
    onChange: () => undefined,
  },
  render: function Render() {
    const [value, setValue] = useState<string[]>(['HoReCa']);
    return <TagGroup options={tags} value={value} onChange={setValue} max={3} />;
  },
};
