import Link from "next/link";

const games = [
  {
    slug: "connections",
    name: "Player Connections",
    description:
      "Name a player, then link to the next one through a shared college, team, or jersey number. Keep the chain alive as long as you can.",
    available: true,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-gold bg-gradient-to-br from-navy to-navy-deep px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="font-eyebrow text-sm font-semibold tracking-[0.2em] text-gold uppercase">
            Est. today &middot; A growing lineup
          </p>
          <h1 className="mt-1 font-display text-5xl font-black italic sm:text-6xl">
            Sports Game Hub
          </h1>
          <p className="mt-3 max-w-xl font-eyebrow text-lg text-[#cfd6e4]">
            A collection of sports trivia and connection games. Pick one to start.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={game.available ? `/games/${game.slug}` : "#"}
              className={`group relative border-2 border-ink bg-paper-2 p-6 transition ${
                game.available ? "hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--navy)]" : "opacity-50"
              }`}
            >
              <span className="absolute top-[-2px] left-[-2px] right-[-2px] h-[5px] bg-red" />
              <h2 className="font-display text-2xl font-bold">{game.name}</h2>
              <p className="mt-2 font-body text-sm text-ink-dim">{game.description}</p>
              <span className="mt-4 inline-block font-eyebrow text-sm font-bold tracking-wide text-navy uppercase">
                {game.available ? "Play →" : "Coming soon"}
              </span>
            </Link>
          ))}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-ink-faint p-6 text-center font-eyebrow text-sm text-ink-faint uppercase tracking-wide">
            More games coming soon
          </div>
        </div>
      </main>
    </div>
  );
}
