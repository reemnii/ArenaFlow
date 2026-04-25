import { useEffect, useState } from "react";
import { getTeams } from "../services/api";

const glassCard =
  "rounded-[1.4rem] sm:rounded-[1.6rem] border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(18,10,35,0.12)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]";

const pageTitle =
  "text-3xl font-black text-slate-900 dark:text-white md:text-4xl";

const smallLabel =
  "text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300";

const errorBox =
  "mb-6 rounded-[1.1rem] border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 backdrop-blur-md dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await getTeams();
        setTeams(Array.isArray(data) ? data : []);
      } catch (err) {
        setErrorMessage(err.message || "Failed to load teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-700 dark:text-white">Loading teams...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10"
      aria-labelledby="manage-teams-title"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className={smallLabel}>Team Management</p>

          <h1 id="manage-teams-title" className={`mt-2 ${pageTitle}`}>
            Manage Teams
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base">
            View registered teams, coaches, tournament links, and player
            rosters directly from the database.
          </p>
        </header>

        {errorMessage && (
          <p role="alert" aria-live="assertive" className={errorBox}>
            {errorMessage}
          </p>
        )}

        {teams.length === 0 ? (
          <section className={`${glassCard} p-6`}>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              No teams found
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-white/68">
              There are no teams saved in the database yet. Add seed data or
              create teams through the backend.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {teams.map((team) => (
              <article key={team._id || team.id} className={`${glassCard} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand dark:text-fuchsia-300">
                      Team
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                      {team.name}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#6B124B]/10 px-3 py-1 text-xs font-bold text-[#6B124B] dark:bg-fuchsia-300/15 dark:text-fuchsia-200">
                    {team.players?.length || 0} Players
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-slate-600 dark:text-white/68">
                  {team.coach && (
                    <p>
                      <span className="font-bold text-slate-800 dark:text-white">
                        Coach:
                      </span>{" "}
                      {team.coach}
                    </p>
                  )}

                  {team.tournamentId && (
                    <p>
                      <span className="font-bold text-slate-800 dark:text-white">
                        Tournament:
                      </span>{" "}
                      {typeof team.tournamentId === "object"
                        ? team.tournamentId.name
                        : team.tournamentId}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 dark:text-white/80">
                    Players
                  </h3>

                  {team.players && team.players.length > 0 ? (
                    <ul className="space-y-2">
                      {team.players.map((player, index) => (
                        <li
                          key={`${player.name}-${index}`}
                          className="rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/75"
                        >
                          <span className="font-bold text-slate-900 dark:text-white">
                            {player.name}
                          </span>

                          {player.number ? (
                            <span> #{player.number}</span>
                          ) : null}

                          {player.position ? (
                            <span> — {player.position}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-black/20 dark:text-white/55">
                      No players added yet.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
