import { ConnectChatPage } from '@/pages/connect-matches';

export default async function Page({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  return <ConnectChatPage matchId={matchId} />;
}
