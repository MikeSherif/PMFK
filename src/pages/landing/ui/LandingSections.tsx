import Image from 'next/image';
import { AppLink } from '@/shared/lib';
import { flags } from '@/shared/config';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import { Logo } from '@/shared/ui/logo';
import { Section, SectionHeader } from '@/shared/ui/section';
import { heroContent } from '../content/hero';
import {
  afterpartyContent,
  audienceContent,
  conceptContent,
  connectPromoContent,
  contactsContent,
  faqContent,
  formatsContent,
  ideaContent,
  mediaContent,
  networkingContent,
  organizersContent,
  partnersContent,
  programContent,
  speakersContent,
  ticketsContent,
  venueContent,
} from '../content/sections';
import { FaqAccordion } from './FaqAccordion';
import { HeroOrbit } from './HeroOrbit';

function CtaLink({
  href,
  label,
  variant = 'primary',
}: {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'link';
}) {
  const external = href.startsWith('mailto:') || href.startsWith('http');
  const suffix = variant === 'link' || href.includes('mailto') ? ' ↗' : href.includes('#') ? '' : ' →';
  if (external) {
    return (
      <Button asChild variant={variant} fullWidth className="sm:w-auto">
        <a href={href} rel="noopener noreferrer">
          {label}
          {suffix}
        </a>
      </Button>
    );
  }
  return (
    <Button asChild variant={variant} fullWidth className="sm:w-auto">
      <AppLink href={href}>
        {label}
        {variant === 'primary' ? ' ↗' : ' →'}
      </AppLink>
    </Button>
  );
}

export function HeroSection() {
  return (
    <Section id="hero" aria-labelledby="hero-title" className="bg-mesh relative overflow-hidden pt-10 pb-28 md:pb-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-6 flex items-center gap-2 text-xs tracking-[0.2em] text-peach uppercase">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
            {heroContent.eyebrow}
          </p>
          <div className="mb-6 flex items-center gap-4">
            <Logo size="lg" />
            <h1 id="hero-title" className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] font-bold uppercase">
              {heroContent.title}
            </h1>
          </div>
          <p className="font-display text-[clamp(1.25rem,3vw,2rem)] leading-tight font-bold uppercase">
            {heroContent.titleLine}
            <br />
            <span className="text-accent">{heroContent.titleAccent}</span>
          </p>
          <p className="mt-6 max-w-xl text-lg text-pretty text-text-muted">{heroContent.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {heroContent.chips.map((chip) => (
              <Badge key={chip.label}>{chip.label}</Badge>
            ))}
          </div>
          <div className="mt-8 hidden gap-3 sm:flex">
            <CtaLink href={heroContent.primaryCta.href} label={heroContent.primaryCta.label} />
            <CtaLink href={heroContent.secondaryCta.href} label={heroContent.secondaryCta.label} variant="secondary" />
          </div>
          <p className="mt-4 mb-24 text-sm text-text-muted md:mb-0">{heroContent.footnote}</p>
          <nav className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6 text-xs tracking-[0.16em] uppercase md:hidden">
            {heroContent.mobileAnchors.map((item) => (
              <AppLink key={item.href} href={item.href} className="text-text-muted hover:text-text">
                {item.label}
              </AppLink>
            ))}
          </nav>
        </div>
        <HeroOrbit />
      </div>
    </Section>
  );
}

export function IdeaSection() {
  return (
    <Section id="idea" aria-labelledby="idea-title">
      <SectionHeader kicker={ideaContent.kicker} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Heading id="idea-title" accent={ideaContent.accent}>
            {ideaContent.title}
          </Heading>
          <p className="mt-6 max-w-xl text-pretty text-text-muted">{ideaContent.body}</p>
          <AppLink href={ideaContent.link.href} className="mt-6 inline-flex text-accent hover:underline">
            {ideaContent.link.label} →
          </AppLink>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="p-6">
            <p className="mb-4 flex items-center gap-2 text-sm text-text-muted">
              <span className="h-2 w-2 rounded-full bg-online" />
              {ideaContent.chat.title}
            </p>
            <ul className="space-y-3">
              {ideaContent.chat.messages.map((msg) => (
                <li
                  key={msg.text}
                  className={
                    msg.from === 'me'
                      ? 'ml-8 rounded-pill bg-accent px-4 py-2 text-sm text-bg'
                      : 'mr-8 rounded-pill bg-surface px-4 py-2 text-sm'
                  }
                >
                  {msg.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-accent-gradient p-6">
            <p className="text-xs tracking-[0.16em] uppercase opacity-80">{ideaContent.chat.punchKicker}</p>
            <p className="font-display mt-1 text-2xl font-bold uppercase">{ideaContent.chat.punchTitle}</p>
          </div>
        </Card>
      </div>
    </Section>
  );
}

export function ConceptSection() {
  return (
    <Section id="concept" aria-labelledby="concept-title">
      <SectionHeader kicker={conceptContent.kicker} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Heading id="concept-title" accent={conceptContent.accent}>
          {conceptContent.title}
        </Heading>
        <p className="text-pretty text-text-muted">{conceptContent.body}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {conceptContent.steps.map((step) => (
          <Card key={step.n}>
            <p className="font-display text-3xl font-bold text-accent">{step.n}</p>
            <p className="font-display mt-4 text-lg font-bold uppercase">{step.title}</p>
            <p className="mt-2 text-sm text-text-muted">{step.text}</p>
          </Card>
        ))}
      </div>
      <p className="font-display mt-10 text-xl font-bold uppercase md:text-3xl">
        {conceptContent.punch} <span className="text-accent">↗</span>
      </p>
    </Section>
  );
}

export function AudienceSection() {
  return (
    <Section id="audience" aria-labelledby="audience-title">
      <SectionHeader kicker={audienceContent.kicker} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Heading id="audience-title" accent={audienceContent.accent}>
          {audienceContent.title}
        </Heading>
        <p className="text-pretty text-text-muted">{audienceContent.body}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {audienceContent.roles.map((role) => (
          <Card key={role.title}>
            <p className="font-display text-lg font-bold uppercase">{role.title}</p>
            <p className="mt-3 text-sm text-text-muted">{role.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function ConnectPromoSection() {
  return (
    <Section id="connect" aria-labelledby="connect-title">
      <SectionHeader kicker={connectPromoContent.kicker} />
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <Heading id="connect-title" accent={connectPromoContent.accent}>
            {connectPromoContent.title}
          </Heading>
          <p className="mt-6 text-pretty text-text-muted">{connectPromoContent.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={connectPromoContent.primaryCta.href} label={connectPromoContent.primaryCta.label} />
            <CtaLink
              href={connectPromoContent.secondaryCta.href}
              label={connectPromoContent.secondaryCta.label}
              variant="secondary"
            />
          </div>
          <p className="mt-4 text-xs text-text-muted">{connectPromoContent.footnote}</p>
        </div>
        <Card>
          <div className="mb-4 flex justify-end">
            <Badge tone="peach">{connectPromoContent.badge}</Badge>
          </div>
          <ol className="space-y-3">
            {connectPromoContent.steps.map((step) => (
              <li key={step.n} className="flex gap-4 rounded-md bg-surface p-4">
                <span className="font-display font-bold text-accent">{step.n}</span>
                <span>
                  <span className="block font-semibold uppercase">{step.title}</span>
                  <span className="text-sm text-text-muted">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </Section>
  );
}

export function SpeakersSection() {
  return (
    <Section id="speakers" aria-labelledby="speakers-title">
      <SectionHeader kicker={speakersContent.kicker} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Heading id="speakers-title" accent={speakersContent.accent}>
          {speakersContent.title}
        </Heading>
        <p className="text-pretty text-text-muted">{speakersContent.body}</p>
      </div>
      {!flags.speakersPublished ? (
        <div className="mt-10 rounded-lg border border-dashed border-border-strong px-6 py-16 text-center">
          <p className="font-display text-xl font-bold uppercase">{speakersContent.emptyTitle}</p>
          <p className="mt-2 text-text-muted">{speakersContent.emptyText}</p>
        </div>
      ) : null}
      <div className="mt-6">
        <CtaLink href={speakersContent.cta.href} label={speakersContent.cta.label} variant="link" />
      </div>
    </Section>
  );
}

export function FormatsSection() {
  return (
    <Section id="formats" aria-labelledby="formats-title">
      <SectionHeader kicker={formatsContent.kicker} />
      <Heading id="formats-title" accent={formatsContent.accent}>
        {formatsContent.title}
      </Heading>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {formatsContent.items.map((item) => (
          <Card key={item.n} className="min-h-48">
            <p className="text-xs tracking-[0.16em] text-peach uppercase">{item.n}</p>
            <p className="font-display mt-8 text-xl font-bold uppercase">{item.title}</p>
            <p className="mt-3 text-sm text-text-muted">{item.text}</p>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <CtaLink href={formatsContent.cta.href} label={formatsContent.cta.label} />
      </div>
    </Section>
  );
}

export function ProgramSection() {
  return (
    <Section id="program" aria-labelledby="program-title">
      <SectionHeader kicker={programContent.kicker} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Heading id="program-title" accent={programContent.accent}>
          {programContent.title}
        </Heading>
        <p className="text-pretty text-text-muted">{programContent.body}</p>
      </div>
      <Card className="mt-10 p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <p className="font-display font-bold uppercase">{programContent.day}</p>
          <Badge tone="peach">{programContent.scheduleBadge}</Badge>
        </div>
        <ul>
          {programContent.items.map((item) => (
            <li key={item.title} className="grid gap-2 border-b border-border px-6 py-5 last:border-0 md:grid-cols-[10rem_1fr]">
              <p className="text-sm text-accent">{programContent.timePlaceholder}</p>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-text-muted">{item.text}</p>
                <Badge className="mt-3">{programContent.status}</Badge>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-text-muted">{programContent.note}</p>
          <CtaLink href={programContent.cta.href} label={programContent.cta.label} />
        </div>
      </Card>
    </Section>
  );
}

export function NetworkingSection() {
  return (
    <Section id="networking" aria-labelledby="networking-title">
      <SectionHeader kicker={networkingContent.kicker} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Heading id="networking-title" accent={networkingContent.accent}>
          {networkingContent.title}
        </Heading>
        <p className="text-pretty text-text-muted">{networkingContent.body}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {networkingContent.steps.map((step) => (
          <Card key={step.n}>
            <p className="font-display text-3xl font-bold text-accent">{step.n}</p>
            <p className="font-display mt-4 font-bold uppercase">{step.title}</p>
            <p className="mt-2 text-sm text-text-muted">{step.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function VenueSection() {
  return (
    <Section id="venue" aria-labelledby="venue-title">
      <SectionHeader kicker={venueContent.kicker} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Heading id="venue-title" accent={venueContent.accent}>
          {venueContent.title}
        </Heading>
        <p className="text-pretty text-text-muted">{venueContent.body}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {venueContent.photos.map((photo) => (
          <div key={photo.src} className="relative aspect-16/10 overflow-hidden rounded-lg">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs tracking-[0.16em] text-peach uppercase">{venueContent.placeKicker}</p>
          <p className="mt-1 font-semibold">{venueContent.placeTitle}</p>
          <p className="text-sm text-text-muted">{venueContent.placeNote}</p>
        </div>
        <Button disabled variant="secondary">
          {venueContent.routeDisabled} ↗
        </Button>
      </div>
    </Section>
  );
}

export function AfterpartySection() {
  return (
    <Section id="afterparty" aria-labelledby="afterparty-title">
      <SectionHeader kicker={afterpartyContent.kicker} />
      <Heading id="afterparty-title" accent={afterpartyContent.accent}>
        {afterpartyContent.title}
      </Heading>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {afterpartyContent.cards.map((card) => (
          <Card key={card.n}>
            <p className="font-display text-3xl font-bold text-accent">{card.n}</p>
            <p className="font-display mt-4 text-lg font-bold uppercase">{card.title}</p>
            <p className="mt-3 text-sm text-text-muted">{card.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function OrganizersSection() {
  return (
    <Section id="organizers" aria-labelledby="organizers-title">
      <SectionHeader kicker={organizersContent.kicker} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Heading id="organizers-title" accent={organizersContent.accent}>
          {organizersContent.title}
        </Heading>
        <p className="text-pretty text-text-muted">{organizersContent.body}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {organizersContent.cards.map((card) => (
          <Card key={card.n}>
            <p className="font-display text-3xl font-bold text-accent">{card.n}</p>
            <p className="font-display mt-4 text-lg font-bold uppercase">{card.title}</p>
            <p className="mt-3 text-sm text-text-muted">{card.text}</p>
            {'link' in card && card.link ? (
              <div className="mt-4">
                <CtaLink href={card.link.href} label={card.link.label} variant="link" />
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function PartnersSection() {
  return (
    <Section id="partners" aria-labelledby="partners-title">
      <SectionHeader kicker={partnersContent.kicker} />
      <Heading id="partners-title" accent={partnersContent.accent}>
        {partnersContent.title}
      </Heading>
      {!flags.partnersPublished ? (
        <div className="mt-10 rounded-lg border border-dashed border-border-strong px-6 py-12 text-center">
          <p className="font-display text-xl font-bold uppercase">{partnersContent.emptyTitle}</p>
          <p className="mt-2 text-text-muted">{partnersContent.emptyText}</p>
        </div>
      ) : null}
      <Card className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-bold uppercase">{partnersContent.ctaTitle}</p>
          <p className="mt-2 text-sm text-text-muted">{partnersContent.ctaText}</p>
        </div>
        <CtaLink href={partnersContent.cta.href} label={partnersContent.cta.label} />
      </Card>
    </Section>
  );
}

export function MediaSection() {
  return (
    <Section id="media" aria-labelledby="media-title">
      <SectionHeader kicker={mediaContent.kicker} />
      <Heading id="media-title" className="max-w-3xl" accent={mediaContent.accent}>
        {mediaContent.title}
      </Heading>
      {!flags.mediaPartnersPublished ? (
        <p className="mt-6 text-text-muted">{mediaContent.emptyText}</p>
      ) : null}
      <Card className="mt-8 max-w-xl">
        <p className="font-display text-lg font-bold uppercase">{mediaContent.ctaTitle}</p>
        <p className="mt-2 text-sm text-text-muted">{mediaContent.ctaText}</p>
        <div className="mt-4">
          <CtaLink href={mediaContent.cta.href} label={mediaContent.cta.label} variant="secondary" />
        </div>
      </Card>
    </Section>
  );
}

export function TicketsSection() {
  return (
    <Section id="tickets" aria-labelledby="tickets-title">
      <Card className="bg-accent-gradient grid items-center gap-8 border-0 p-8 md:grid-cols-2 md:p-12">
        <div>
          <SectionHeader kicker={ticketsContent.kicker} />
          <Heading id="tickets-title" accent={ticketsContent.accent}>
            {ticketsContent.title}
          </Heading>
          <p className="mt-4 text-pretty text-text/90">{ticketsContent.body}</p>
          {!flags.ticketSalesOpen ? (
            <p className="mt-4 text-sm tracking-wide text-peach uppercase">{ticketsContent.salesClosed}</p>
          ) : null}
          <div className="mt-6">
            <CtaLink href={ticketsContent.cta.href} label={ticketsContent.cta.label} />
          </div>
        </div>
        <div className="hidden justify-center md:flex">
          <div className="w-64 rotate-6 rounded-xl bg-accent-gradient p-6 shadow-lg">
            <p className="text-xs tracking-[0.14em] uppercase opacity-80">{ticketsContent.card.kicker}</p>
            <p className="font-display mt-6 text-5xl font-bold">{ticketsContent.card.title}</p>
            <p className="mt-8 border-t border-white/30 pt-4 text-sm">{ticketsContent.card.date}</p>
            <p className="text-xs tracking-[0.12em] uppercase opacity-80">{ticketsContent.card.place}</p>
          </div>
        </div>
      </Card>
    </Section>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" aria-labelledby="faq-title">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader kicker={faqContent.kicker} />
          <Heading id="faq-title" accent={faqContent.accent}>
            {faqContent.title}
          </Heading>
          <p className="mt-4 text-text-muted">{faqContent.body}</p>
        </div>
        <FaqAccordion />
      </div>
    </Section>
  );
}

export function ContactsSection() {
  return (
    <Section id="contacts" aria-labelledby="contacts-title">
      <Card className="bg-accent-gradient border-0 p-8 md:p-12">
        <SectionHeader kicker={contactsContent.kicker} />
        <Heading id="contacts-title" accent={contactsContent.accent}>
          {contactsContent.title}
        </Heading>
        <p className="mt-4 max-w-2xl text-pretty text-text/90">{contactsContent.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaLink href={contactsContent.primaryCta.href} label={contactsContent.primaryCta.label} />
          <CtaLink
            href={contactsContent.secondaryCta.href}
            label={contactsContent.secondaryCta.label}
            variant="secondary"
          />
        </div>
      </Card>
    </Section>
  );
}
