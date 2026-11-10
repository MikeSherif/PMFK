import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';
import { EventJsonLd } from './EventJsonLd';
import { StickyCta } from './StickyCta';
import {
  AfterpartySection,
  AudienceSection,
  ConceptSection,
  ConnectPromoSection,
  ContactsSection,
  FaqSection,
  FormatsSection,
  HeroSection,
  IdeaSection,
  MediaSection,
  NetworkingSection,
  OrganizersSection,
  PartnersSection,
  ProgramSection,
  SpeakersSection,
  TicketsSection,
  VenueSection,
} from './LandingSections';

export function LandingPage() {
  return (
    <>
      <EventJsonLd />
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:z-100 focus:bg-accent focus:px-4 focus:py-2"
      >
        К содержанию
      </a>
      <SiteHeader />
      <main>
        <HeroSection />
        <IdeaSection />
        <ConceptSection />
        <AudienceSection />
        <ConnectPromoSection />
        <SpeakersSection />
        <FormatsSection />
        <ProgramSection />
        <NetworkingSection />
        <VenueSection />
        <AfterpartySection />
        <OrganizersSection />
        <PartnersSection />
        <MediaSection />
        <TicketsSection />
        <FaqSection />
        <ContactsSection />
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
