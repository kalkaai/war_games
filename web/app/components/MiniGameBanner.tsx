import Link from "next/link";
import { getGameManifestBySlug } from "@gamides/minigames/manifest";

interface MiniGameBannerProps {
  heading?: string;
  subtitle?: string;
  featuredSlugs: string[];
}

export function MiniGameBanner({
  heading = "🕹️ Waiting on an Upgrade or Event Reset? Play a 60-Second Survival Mini-Game",
  subtitle = "Challenge your alliance mates and share your high score directly to Discord:",
  featuredSlugs,
}: MiniGameBannerProps) {
  const games = featuredSlugs
    .map((slug) => getGameManifestBySlug(slug))
    .filter((g): g is NonNullable<typeof g> => g !== null);

  if (games.length === 0) return null;

  return (
    <section
      aria-label="GAMIDES Survival Mini-Games"
      className="my-10 rounded-2xl border border-purple-700/60 bg-purple-900/40 p-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{heading}</h2>
          <p className="text-xs sm:text-sm text-purple-200/80">{subtitle}</p>
        </div>
        <Link
          href="/play"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-500"
        >
          Browse All 100 Games →
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.slug}
            href={`/play/${game.slug}`}
            className="group flex flex-col justify-between rounded-xl border border-purple-800/60 bg-purple-950/75 p-4 transition-all hover:border-purple-500 hover:bg-purple-900/70"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-purple-300/80">
                <span>#{game.id} • {game.category}</span>
                <span>Goal: {game.targetScore}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  {game.iconEmoji}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-200">
                  {game.title}
                </h3>
              </div>
              <p className="mt-1.5 text-xs text-purple-200/80 line-clamp-2">
                {game.shortDescription}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-purple-800/40 pt-2 text-[11px] font-semibold text-purple-300 group-hover:text-white">
              <span>{game.templateName}</span>
              <span>Play Free →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
