import { redirect } from 'next/navigation';
import { routes } from '@/shared/config';

export default function ConnectIndexPage() {
  redirect(routes.connect.feed);
}
