import { heroContent } from '../content/hero';

export function HeroOrbit() {
  const [idea, contact, project] = heroContent.orbitCards;
  if (!idea || !contact || !project) {
    return null;
  }
  return (
    <div className="relative mx-auto hidden h-[28rem] w-full max-w-lg lg:block">
      <div className="absolute inset-8 rounded-full border border-white/10" />
      <div className="absolute inset-16 rounded-full border border-white/5" />
      <p className="absolute top-1/2 left-1/2 max-w-32 -translate-x-1/2 -translate-y-1/2 text-center text-[11px] tracking-[0.18em] text-text-muted uppercase">
        {heroContent.orbitCaption}
      </p>
      <article className="glass absolute top-6 right-4 w-52 -rotate-6 rounded-lg p-4">
        <p className="text-[10px] tracking-[0.16em] text-peach uppercase">{idea.kicker}</p>
        <p className="mt-2 rounded-pill bg-accent px-3 py-2 text-sm font-medium">{idea.title}</p>
      </article>
      <article className="glass absolute top-1/2 left-0 w-52 -translate-y-1/2 -rotate-3 rounded-lg p-4">
        <p className="text-[10px] tracking-[0.16em] text-peach uppercase">{contact.kicker}</p>
        <p className="mt-2 rounded-pill bg-accent px-3 py-2 text-sm font-medium">{contact.title}</p>
      </article>
      <article className="glass absolute right-2 bottom-4 w-56 rotate-6 rounded-lg p-4">
        <p className="text-[10px] tracking-[0.16em] text-peach uppercase">{project.kicker}</p>
        <p className="mt-2 font-display text-xl font-bold uppercase">{project.title}</p>
      </article>
    </div>
  );
}
