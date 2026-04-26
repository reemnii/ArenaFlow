import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Shield,
  Star,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import {
  apiFetch,
  normalizeMatch,
  normalizePlayer,
  normalizeScore,
  normalizeTeam,
  normalizeTournament,
} from "../utils/api";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        const [teamData, playersData, tournamentsData, matchesData, scoresData, teamsData] =
          await Promise.all([
            apiFetch(`/api/teams/${id}`),
            apiFetch("/api/players"),
            apiFetch("/api/tournaments"),
            apiFetch("/api/matches"),
            apiFetch("/api/scores"),
            apiFetch("/api/teams"),
          ]);

        setTeam(normalizeTeam(teamData));
        setPlayers((playersData || []).map(normalizePlayer));
        setTournaments((tournamentsData || []).map(normalizeTournament));
        setMatches((matchesData || []).map(normalizeMatch));
        setScores((scoresData || []).map(normalizeScore));
        setTeams((teamsData || []).map(normalizeTeam));
      } catch (requestError) {
        setError(requestError.message || "Unable to load team details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  const roster = useMemo(() => {
    return players.filter((player) => String(player.teamId) === String(id));
  }, [id, players]);

  const teamTournaments = useMemo(() => {
    return tournaments.filter((tournament) =>
      (tournament.teamIds || []).some((teamId) => String(teamId) === String(id))
    );
  }, [id, tournaments]);

  const teamMatches = useMemo(() => {
    return matches.filter(
      (match) => String(match.teamA) === String(id) || String(match.teamB) === String(id)
    );
  }, [id, matches]);

  const summary = useMemo(() => {
    return teamMatches.reduce(
      (accumulator, match) => {
        const score = scores.find((item) => String(item.matchId) === String(match.id));
        if (!score) return accumulator;

        if (String(match.winner) === String(id)) accumulator.wins += 1;
        else if (match.winner) accumulator.losses += 1;

        accumulator.points +=
          String(match.teamA) === String(id)
            ? score.teamAScore || 0
            : score.teamBScore || 0;

        return accumulator;
      },
      { wins: 0, losses: 0, points: 0 }
    );
  }, [id, scores, teamMatches]);

  function getTeamName(teamId) {
    return teams.find((item) => String(item.id) === String(teamId))?.name || "Unknown Team";
  }

  function getTournamentName(tournamentId) {
    return tournaments.find((item) => String(item.id) === String(tournamentId))?.name || "Unknown Tournament";
  }

  if (isLoading) {
    return <section className="min-h-screen px-4 py-10">Loading team...</section>;
  }

  if (!team || error) {
    return (
      <section className="min-h-screen px-4 py-10 text-inherit sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <h1 className="mb-3 text-3xl font-bold">Team not found</h1>
          <p className="mb-6 text-[#913075B0]">{error || "The team you are looking for does not exist."}</p>
          <Link to="/participants" className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-gray-200 transition hover:bg-brand/90">
            <ArrowLeft size={18} />
            Back to Teams
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 py-8 text-inherit sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/participants" className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-xl transition hover:bg-white/10">
          <ArrowLeft size={16} />
          Back to Teams
        </Link>

        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-transparent" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Shield size={28} />
                </div>
                <div>
                  <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#91307580]">Team Profile</p>
                  <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{team.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 capitalize">{team.gender}</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                      <Users size={15} />
                      {roster.length} Players
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Users size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Team Roster</h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {roster.length > 0 ? (
                  roster.map((player) => (
                    <div key={player.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-lg font-semibold">{player.name}</p>
                        <span className="rounded-full bg-brand/20 px-2.5 py-1 text-xs font-semibold text-brand">
                          #{player.number ?? "N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-[#913075B0]">{player.position}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-brand/50 dark:text-gray-400">No roster data available.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Trophy size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Tournament Participation</h2>
                </div>
              </div>

              {teamTournaments.length === 0 ? (
                <p className="text-sm text-brand/50 dark:text-gray-400">This team is not currently assigned to any tournaments.</p>
              ) : (
                <div className="space-y-4">
                  {teamTournaments.map((tournament) => (
                    <div key={tournament.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{tournament.name}</h3>
                          <p className="mt-1 text-sm text-brand/50 dark:text-gray-400">
                            {tournament.location} - {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "TBA"}
                          </p>
                        </div>
                        <Link to={`/tournaments/${tournament.id}`} className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90">
                          View Tournament
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Star size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Standings Summary</h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-brand/50 dark:text-gray-400">Wins</p>
                  <p className="mt-1 font-bold">{summary.wins}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-brand/50 dark:text-gray-400">Losses</p>
                  <p className="mt-1 font-bold">{summary.losses}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-brand/50 dark:text-gray-400">Points</p>
                  <p className="mt-1 font-bold">{summary.points}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Swords size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Recent / Scheduled Matches</h2>
                </div>
              </div>

              <div className="space-y-4">
                {teamMatches.length === 0 ? (
                  <p className="text-sm text-brand/50 dark:text-gray-400">No match data available for this team.</p>
                ) : (
                  teamMatches.map((match) => (
                    <div key={match.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-brand/50 dark:text-gray-400">
                        <CalendarDays size={15} />
                        <span>{match.date ? new Date(match.date).toLocaleDateString() : "TBA"}</span>
                      </div>
                      <p className="font-semibold">
                        {getTeamName(match.teamA)} vs {getTeamName(match.teamB)}
                      </p>
                      <p className="mt-2 text-sm text-brand/50 dark:text-gray-400">
                        {getTournamentName(match.tournamentId)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
