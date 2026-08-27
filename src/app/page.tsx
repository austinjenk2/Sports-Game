import Link from "next/link";

const games = [
  {
    slug: "connections",
    name: "The Sports Game",
    description:
      "Name a player, then link to the next one through a shared college, team, or jersey number. Keep the chain alive as long as you can.",
    available: true,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 pt-14 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="font-eyebrow text-sm font-semibold tracking-[0.2em] text-sky uppercase">
            Est. today &middot; A growing lineup
          </p>
          <h1 className="mt-2 font-display text-5xl text-cream uppercase sm:text-6xl">
            Sports Game Hub
          </h1>
          <p className="mt-3 max-w-xl font-body text-lg text-cream-dim">
            A collection of sports trivia and connection games. Pick one to start.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={game.available ? `/games/${game.slug}` : "#"}
              className={`foil-border relative bg-navy p-6 transition ${
                game.available ? "hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(91,194,232,0.18)]" : "opacity-50"
              }`}
            >
              <span className="mb-3 inline-block rounded bg-crimson px-2.5 py-1 font-eyebrow text-[10.5px] font-bold tracking-[0.14em] text-cream uppercase">
                Connections
              </span>
              <h2 className="font-display text-2xl text-cream uppercase">{game.name}</h2>
              <p className="mt-2 font-body text-sm text-cream-dim">{game.description}</p>
              <span className="mt-4 inline-block font-eyebrow text-sm font-bold tracking-wide text-sky uppercase">
                {game.available ? "Play →" : "Coming soon"}
              </span>
            </Link>
          ))}
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky/25 p-6 text-center font-eyebrow text-sm text-cream-faint uppercase tracking-wide">
            More games coming soon
          </div>
        </div>
      </main>
    </div>
  );
}
