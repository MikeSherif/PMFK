import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'shared/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Card.Header>
          <p className="font-display text-2xl font-bold text-accent">01</p>
        </Card.Header>
        <Card.Body>
          <p className="font-display text-lg font-bold uppercase text-text">Ваш запрос</p>
          <p className="mt-2">Опишите задачу: аудитория, продукт, новый рынок.</p>
        </Card.Body>
      </>
    ),
  },
};
