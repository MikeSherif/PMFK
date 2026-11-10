import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Modal } from './Modal';

const meta = {
  title: 'shared/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Продолжите знакомство на ПМФК.', children: null },
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть</Button>
        <Modal open={open} onOpenChange={setOpen} title="Продолжите знакомство на ПМФК.">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Вернуться к карточкам
          </Button>
        </Modal>
      </>
    );
  },
};
