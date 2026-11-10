import { LegalPage, privacyContent } from '@/pages/legal';

export default function PrivacyRoute() {
  return <LegalPage title={privacyContent.title} body={privacyContent.body} />;
}
