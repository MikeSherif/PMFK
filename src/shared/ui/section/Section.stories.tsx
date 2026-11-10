import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from '@/shared/ui/heading';
import { Section, SectionHeader } from './Section';

const meta = {
  title: 'shared/Section',
  component: Section,
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <SectionHeader kicker="01 / идея" />
        <Heading accent="Движения мало.">Партнёрских чатов много.</Heading>
      </>
    ),
  },
};
