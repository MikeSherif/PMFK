import { LegalPage, consentContent } from '@/pages/legal';

export default function ConsentRoute() {
  return <LegalPage title={consentContent.title} body={consentContent.body} />;
}
