import { siteMeta } from '@/shared/config';

export function EventJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: siteMeta.title,
    description: siteMeta.description,
    startDate: siteMeta.event.startDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: siteMeta.event.locationName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteMeta.event.city,
        addressCountry: 'RU',
      },
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
