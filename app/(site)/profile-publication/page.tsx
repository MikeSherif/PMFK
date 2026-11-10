import { LegalPage, publicationContent } from '@/pages/legal';

export default function PublicationRoute() {
  return <LegalPage title={publicationContent.title} body={publicationContent.body} />;
}
