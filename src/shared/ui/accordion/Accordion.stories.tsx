import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const meta = {
  title: 'shared/Accordion',
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'single',
    defaultValue: 'a',
    collapsible: true,
    children: (
      <AccordionItem value="a">
        <AccordionTrigger>Где и когда пройдёт форум?</AccordionTrigger>
        <AccordionContent>10 декабря 2026 года, Москва, арт-центр Linda de La.</AccordionContent>
      </AccordionItem>
    ),
  },
};
