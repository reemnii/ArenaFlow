import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import {
  apiFetch,
  normalizeMatch,
  normalizeScore,
  normalizeTeam,
  normalizeTournament,
} from "../utils/api";
import { getCurrentUser } from "../utils/auth";

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTournamentDetails() {
      setIsLoading(true);

      try {
        const [tournamentData, matchesData, scoresData, teamsData] = await Promise.all([
          apiFetch(`/api/tournaments/${id}`),
          apiFetch("/api/matches"),
          apiFetch("/api/scores"),
          apiFetch("/api/teams"),
        ]);

        setTournament(normalizeTournament(tournamentData));
        setMatches((matchesData || []).map(normalizeMatch));
        setScores((scoresData || []).map(normalizeScore));
        setTeams((teamsData || []).map(normalizeTeam));
      } catch (requestError) {
        setError(requestError.message || "Unable to load tournament details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTournamentDetails();
  }, [id]);

  const relatedTeams = useMemo(() => {
    if (!tournament) return [];

    if (tournament.teams?.length) {
      return tournament.teams;
    }

    return teams.filter((team) =>
      (tournament.teamIds || []).some((teamId) => String(teamId) === String(team.id))
    );
  }, [teams, tournament]);

  const relatedMatches = useMemo(() => {
    return matches.filter(
      (match) => String(match.tournamentId) === String(id)
    );
  }, [id, matches]);

  const standings = useMemo(() => {
    const table = new Map();

    relatedTeams.forEach((team) => {
      table.set(String(team.id), {
        teamId: team.id,
        wins: 0,
        losses: 0,
        points: 0,
      });
    });

    relatedMatches.forEach((match) => {
      const score = scores.find((item) => String(item.matchId) === String(match.id));

      [match.teamA, match.teamB].forEach((teamId) => {
        if (!table.has(String(teamId))) {
          table.set(String(teamId), {
            teamId,
            wins: 0,
            losses: 0,
            points: 0,
          });
        }
      });

      if (match.winner && table.has(String(match.winner))) {
        table.get(String(match.winner)).wins += 1;
      }

      if (match.winner && String(match.winner) !== String(match.teamA)) {
        table.get(String(match.teamA)).losses += 1;
      }

      if (match.winner && String(match.winner) !== String(match.teamB)) {
        table.get(String(match.teamB)).losses += 1;
      }

      if (score) {
        table.get(String(match.teamA)).points += score.teamAScore || 0;
        table.get(String(match.teamB)).points += score.teamBScore || 0;
      }
    });

    return Array.from(table.values()).sort(
      (left, right) => right.wins - left.wins || right.points - left.points
    );
  }, [relatedMatches, relatedTeams, scores]);

  function getTeamName(teamId) {
    return teams.find((team) => String(team.id) === String(teamId))?.name || "Unknown Team";
  }

  const canEdit =
    currentUser &&
    tournament &&
    (currentUser.role === "admin" ||
      String(currentUser.id) === String(tournament.createdBy));

  if (isLoading) {
    return <div className="min-h-screen px-4 py-10">Loading tournament...</div>;
  }

  if (!tournament || error) {
    return (
      <div className="min-h-screen px-3 py-4 text-inherit sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <h1 className="text-xl font-bold sm:text-2xl">Tournament not found</h1>
            <p className="mt-2 text-sm text-inherit/70">{error || "The selected tournament could not be found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-4 text-inherit sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 sm:mb-5">
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 text-sm text-inherit/75 transition hover:text-inherit"
          >
            <ArrowLeft size={15} />
            Back to tournaments
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium capitalize">
                {tournament.status}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium">
                {tournament.type || tournament.volleyballType}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold">{tournament.name}</h1>
            <p className="mt-3 text-inherit/70">
              {tournament.description || "No description available."}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-2 text-sm text-inherit/60">
                  <MapPin size={14} />
                  Location
                </div>
                <p className="mt-2 font-medium">{tournament.location || "TBA"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-2 text-sm text-inherit/60">
                  <CalendarDays size={14} />
                  Start Date
                </div>
                <p className="mt-2 font-medium">
                  {tournament.startDate
                    ? new Date(tournament.startDate).toLocaleDateString()
                    : "TBA"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
              <h2 className="text-lg font-semibold">Participating Teams</h2>
              <div className="mt-3 space-y-3">
                {relatedTeams.length > 0 ? (
                  relatedTeams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-semibold">{team.name}</p>
                        <p className="text-sm text-inherit/50 capitalize">{team.gender} team</p>
                      </div>
                      <Link to={`/teams/${team.id}`} className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium">
                        View team details
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-inherit/65">No participating teams available yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
              <h2 className="text-lg font-semibold">Match Schedule</h2>
              <div className="mt-3 space-y-3">
                {relatedMatches.length > 0 ? (
                  relatedMatches.map((match) => (
                    <div key={match.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold">
                        {getTeamName(match.teamA)} vs {getTeamName(match.teamB)}
                      </p>
                      <p className="mt-2 text-sm text-inherit/60">
                        {match.date ? new Date(match.date).toLocaleDateString() : "TBA"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-inherit/65">No matches available yet.</p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-lg font-semibold">Quick Actions</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {canEdit && (
                  <Link
                    to={`/edit/${tournament.id}`}
                    className="block rounded-2xl bg-brand px-4 py-3.5 text-center text-sm font-medium text-white transition hover:bg-brand/90"
                  >
                    Edit Tournament
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/participants")}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-medium"
                >
                  Manage Participants
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Trophy size={18} />
                </div>
                <div>
                  <p className="text-lg font-semibold">Standings</p>
                </div>
              </div>

              <div className="space-y-3">
                {standings.length > 0 ? (
                  standings.map((entry, index) => (
                    <div key={entry.teamId} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {index + 1}. {getTeamName(entry.teamId)}
                          </p>
                          <p className="mt-1 text-xs text-inherit/45">
                            Wins {entry.wins} • Losses {entry.losses}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{entry.points}</p>
                          <p className="text-xs text-inherit/45">points</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-inherit/65">No standings available yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <Users className="mx-auto mb-2" size={18} />
                  <p className="text-sm font-semibold">{relatedTeams.length}</p>
                  <p className="text-xs text-inherit/55">Teams</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <Trophy className="mx-auto mb-2" size={18} />
                  <p className="text-sm font-semibold">{standings.length}</p>
                  <p className="text-xs text-inherit/55">Standings</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <CalendarDays className="mx-auto mb-2" size={18} />
                  <p className="text-sm font-semibold">{relatedMatches.length}</p>
                  <p className="text-xs text-inherit/55">Matches</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
