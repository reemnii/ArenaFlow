import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Users,
  Venus,
  Mars,
  Trophy,
  CalendarDays,
  Shield,
  Star,
  Swords,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { teams } from "../data/teams";
import { men_players } from "../data/men_players";
import { women_players } from "../data/women_players";
import { tournaments } from "../data/tournaments";
import { standings } from "../data/standings";
import { matches } from "../data/matches";

export default function TeamDetails() {
  const { id } = useParams();
  const teamId = Number(id);

  const [showRoster, setShowRoster] = useState(true);
  const [showMatches, setShowMatches] = useState(true);

  const team = teams.find((item) => item.id === teamId);

  if (!team) {
    return (
      <section className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 text-inherit">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <h1 className="mb-3 text-3xl font-bold">Team not found</h1>
          <p className="mb-6 text-white/70">
            The team you are looking for does not exist.
          </p>
          <Link
            to="/participants"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand/90"
          >
            <ArrowLeft size={18} />
            Back to Tournament Details
          </Link>
        </div>
      </section>
    );
  }

  const roster =
    team.gender === "male"
      ? men_players.filter((player) => player.teamId === teamId)
      : women_players.filter((player) => player.teamId === teamId);

  const teamTournaments = tournaments.filter((tournament) => {
    if (Array.isArray(tournament.teamIds)) {
      return tournament.teamIds.includes(teamId);
    }
    return tournament.team1Id === teamId || tournament.team2Id === teamId;
  });

  const teamStandings = standings.filter((entry) => entry.teamId === teamId);

  const teamMatches = matches.filter(
    (match) => match.teamA === teamId || match.teamB === teamId
  );

  const totalWins = teamStandings.reduce((sum, entry) => sum + entry.wins, 0);
  const totalLosses = teamStandings.reduce(
    (sum, entry) => sum + entry.losses,
    0
  );
  const totalPoints = teamStandings.reduce((sum, entry) => sum + entry.points, 0);

  const getTournamentName = (tournamentId) =>
    tournaments.find((t) => t.id === tournamentId)?.name || "Unknown Tournament";

  const getTeamName = (searchedTeamId) =>
    teams.find((t) => t.id === searchedTeamId)?.name || "Unknown Team";

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 text-inherit">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/participants"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-xl transition hover:bg-white/10"
        >
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
                  <p className="mb-2 text-sm uppercase tracking-[0.25em] text-white/60">
                    Team Profile
                  </p>
                  <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
                    {team.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                      {team.gender === "male" ? (
                        <>
                          <Mars size={15} />
                          Men’s Team
                        </>
                      ) : (
                        <>
                          <Venus size={15} />
                          Women’s Team
                        </>
                      )}
                    </span>

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
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                    <Users size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Team Roster</h2>
                    <p className="text-sm text-white/60">
                      Full list of players and positions
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRoster((prev) => !prev)}
                  aria-expanded={showRoster}
                  aria-controls="team-roster"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
                >
                  {showRoster ? "Hide" : "Show"}
                  {showRoster ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {showRoster && (
                <div id="team-roster" className="grid gap-4 sm:grid-cols-2">
                  {roster.map((player, index) => (
                    <div
                      key={player.id}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-lg font-semibold">{player.name}</p>
                        <span className="rounded-full bg-brand/20 px-2.5 py-1 text-xs font-semibold text-brand">
                          #{index + 1}
                        </span>
                      </div>

                      <p className="text-sm text-white/70">{player.position}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Trophy size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Tournament Participation</h2>
                  <p className="text-sm text-white/60">
                    Events this team is connected to
                  </p>
                </div>
              </div>

              {teamTournaments.length === 0 ? (
                <p className="text-sm text-white/65">
                  This team is not currently assigned to any tournaments.
                </p>
              ) : (
                <div className="space-y-4">
                  {teamTournaments.map((tournament) => (
                    <div
                      key={tournament.id}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{tournament.name}</h3>
                          <p className="mt-1 text-sm text-white/65">
                            {tournament.location} • {tournament.date}
                          </p>
                        </div>

                        <Link
                          to={`/tournaments/${tournament.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                        >
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
                  <p className="text-sm text-white/60">
                    Performance across tournaments
                  </p>
                </div>
              </div>

              {teamStandings.length === 0 ? (
                <p className="text-sm text-white/65">
                  No standings data available for this team yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {teamStandings.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4"
                    >
                      <p className="mb-3 font-semibold">
                        {getTournamentName(entry.tournamentId)}
                      </p>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-xl bg-white/10 p-3">
                          <p className="text-xs text-white/60">Wins</p>
                          <p className="mt-1 font-bold">{entry.wins}</p>
                        </div>

                        <div className="rounded-xl bg-white/10 p-3">
                          <p className="text-xs text-white/60">Losses</p>
                          <p className="mt-1 font-bold">{entry.losses}</p>
                        </div>

                        <div className="rounded-xl bg-white/10 p-3">
                          <p className="text-xs text-white/60">Points</p>
                          <p className="mt-1 font-bold">{entry.points}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                    <Swords size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Recent / Scheduled Matches</h2>
                    <p className="text-sm text-white/60">
                      Matchups involving this team
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMatches((prev) => !prev)}
                  aria-expanded={showMatches}
                  aria-controls="team-matches"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
                >
                  {showMatches ? "Hide" : "Show"}
                  {showMatches ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {showMatches && (
                <div id="team-matches" className="space-y-4">
                  {teamMatches.length === 0 ? (
                    <p className="text-sm text-white/65">
                      No match data available for this team.
                    </p>
                  ) : (
                    teamMatches.map((match) => (
                      <div
                        key={match.id}
                        className="rounded-2xl border border-white/10 bg-white/10 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2 text-sm text-white/65">
                          <CalendarDays size={15} />
                          <span>{match.date}</span>
                        </div>

                        <p className="font-semibold">
                          {getTeamName(match.teamA)} vs {getTeamName(match.teamB)}
                        </p>

                        <p className="mt-2 text-sm text-white/65">
                          {getTournamentName(match.tournamentId)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}