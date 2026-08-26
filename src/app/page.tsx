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
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Sports Game Hub</h1>
        <p className="mt-3 text-white/60">
          A growing collection of sports trivia and connection games. Pick one to start.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={game.available ? `/games/${game.slug}` : "#"}
            className={`group rounded-2xl border border-white/10 bg-white/5 p-6 transition ${
              game.available ? "hover:border-emerald-400 hover:bg-white/10" : "opacity-50"
            }`}
          >
            <h2 className="text-xl font-semibold">{game.name}</h2>
            <p className="mt-2 text-sm text-white/60">{game.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-emerald-400">
              {game.available ? "Play →" : "Coming soon"}
            </span>
          </Link>
        ))}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 p-6 text-center text-white/40">
          More games coming soon
        </div>
      </div>
    </div>
  );
}
