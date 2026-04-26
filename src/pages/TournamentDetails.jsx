import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Trophy,
  Users,
  Shield,
  Clock3,
  CheckCircle2,
  PlayCircle,
  CircleDashed,
  Volleyball,
  ClipboardList,
  Crown,
  Info,
  Flag,
  Swords,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

import {
  apiFetch,
  normalizeMatch,
  normalizeScore,
  normalizeTeam,
  normalizeTournament,
} from "../utils/api";
import { getCurrentUser } from "../utils/auth";

// Reusable card style for main containers
const CARD_SHELL =
  "border border-black/10 bg-white/75 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:ring-white/5 dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]";

// Slightly smaller inner card style
const INNER_CARD =
  "border border-black/10 bg-white/85 shadow-sm ring-1 ring-black/5 dark:border-white/10 dark:bg-white/5 dark:ring-white/5 dark:shadow-none";

// Soft button / surface style used for lighter actions
const SOFT_BUTTON =
  "border border-black/10 bg-white/80 shadow-sm ring-1 ring-black/5 dark:border-white/10 dark:bg-white/10 dark:ring-white/5 dark:shadow-none";

export default function TournamentDetails() {
  // Read the tournament ID from the route
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [joinMessage, setJoinMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTournamentDetails() {
      setIsLoading(true);
      setError("");

      try {
        const [tournamentData, teamsData, matchesData, scoresData] = await Promise.all([
          apiFetch(`/api/tournaments/${id}`),
          apiFetch("/api/teams"),
          apiFetch("/api/matches"),
          apiFetch("/api/scores"),
        ]);

        if (!isMounted) return;

        setTournament(normalizeTournament(tournamentData));
        setTeams((teamsData || []).map(normalizeTeam));
        setMatches((matchesData || []).map(normalizeMatch));
        setScores((scoresData || []).map(normalizeScore));
        setCurrentUser(getCurrentUser());
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.message || "Unable to load tournament details.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTournamentDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Basic role checks
  const isAdmin = currentUser?.role === "admin";
  const isCoach = currentUser?.role === "coach";
  const canManage = isAdmin || isCoach;
  const canEditTournament = isAdmin || isCoach;

  // Build the related teams list for this tournament
  const relatedTeams = useMemo(() => {
    if (!tournament) return [];

    const embeddedTeams = Array.isArray(tournament.teams)
      ? tournament.teams.map((team) => normalizeTeam(team)).filter(Boolean)
      : [];

    if (embeddedTeams.length) {
      return embeddedTeams;
    }

    const possibleTeamIds = [
      tournament.team1Id,
      tournament.team2Id,
      ...(Array.isArray(tournament.teamIds) ? tournament.teamIds : []),
    ]
      .filter(Boolean)
      .map(String);

    if (!possibleTeamIds.length) {
      return [];
    }

    return teams.filter((team) => possibleTeamIds.includes(String(team.id)));
  }, [teams, tournament]);

  // Get related matches from the backend
  const relatedMatches = useMemo(() => {
    if (!tournament) return [];

    return matches.filter(
      (match) => String(match.tournamentId) === String(tournament.id)
    );
  }, [matches, tournament]);

  // Build standings from backend matches and scores
  const relatedStandings = useMemo(() => {
    if (!tournament) return [];

    const standingsMap = new Map(
      relatedTeams.map((team) => [
        String(team.id),
        {
          id: `standing-${team.id}`,
          tournamentId: tournament.id,
          teamId: team.id,
          wins: 0,
          losses: 0,
          points: 0,
        },
      ])
    );

    relatedMatches.forEach((match) => {
      const teamAId = String(match.teamA || "");
      const teamBId = String(match.teamB || "");
      const score = scores.find((item) => String(item.matchId) === String(match.id));

      if (teamAId && standingsMap.has(teamAId)) {
        standingsMap.get(teamAId).points += score?.teamAScore || 0;
      }

      if (teamBId && standingsMap.has(teamBId)) {
        standingsMap.get(teamBId).points += score?.teamBScore || 0;
      }

      if (match.winner && standingsMap.has(String(match.winner))) {
        standingsMap.get(String(match.winner)).wins += 1;
      }

      [teamAId, teamBId].forEach((teamId) => {
        if (
          teamId &&
          standingsMap.has(teamId) &&
          match.winner &&
          String(match.winner) !== teamId
        ) {
          standingsMap.get(teamId).losses += 1;
        }
      });
    });

    return Array.from(standingsMap.values()).sort(
      (a, b) => b.points - a.points || b.wins - a.wins
    );
  }, [relatedMatches, relatedTeams, scores, tournament]);

  // Helper: get team name from team id
  function getTeamName(teamId) {
    return (
      teams.find((team) => String(team.id) === String(teamId))?.name ||
      "Unknown Team"
    );
  }

  // Helper: format date for display
  function formatDate(value) {
    if (!value) return "TBA";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Helper: choose an icon based on tournament status
  function getStatusIcon(status) {
    const s = status?.toLowerCase();
    if (s === "upcoming") return <Clock3 size={13} />;
    if (s === "ongoing") return <PlayCircle size={13} />;
    if (s === "completed") return <CheckCircle2 size={13} />;
    return <CircleDashed size={13} />;
  }

  // Helper: choose badge styles based on tournament status
  function getStatusClass(status) {
    const s = status?.toLowerCase();
    if (s === "upcoming") {
      return "bg-white/80 text-[#7a2e63] border border-[#c06ca6]/35 ring-1 ring-[#c06ca6]/20 dark:bg-white/10 dark:text-[#f2d4e8]";
    }
    if (s === "ongoing") {
      return "bg-[#913075]/10 text-[#6f1f57] border border-[#913075]/35 ring-1 ring-[#913075]/15 dark:bg-[#913075]/20 dark:text-inherit";
    }
    if (s === "completed") {
      return "bg-[#47004A]/10 text-[#5b2566] border border-[#7e4a8f]/35 ring-1 ring-[#7e4a8f]/15 dark:bg-[#47004A]/30 dark:text-[#f5ddff]";
    }
    return "bg-white/80 text-inherit/80 border border-black/10 ring-1 ring-black/5 dark:bg-white/10 dark:border-white/10 dark:ring-white/5";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen px-3 py-4 text-inherit sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className={`rounded-2xl p-4 text-center sm:p-6 ${CARD_SHELL}`}>
            <h1 className="text-xl font-bold sm:text-2xl">Loading tournament...</h1>
          </div>
        </div>
      </div>
    );
  }

  // Show fallback UI if tournament id does not match anything
  if (!tournament || error) {
    return (
      <div className="min-h-screen px-3 py-4 text-inherit sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className={`rounded-2xl p-4 text-center sm:p-6 ${CARD_SHELL}`}>
            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 ${INNER_CARD}`}>
              <Trophy size={22} />
            </div>

            <h1 className="text-xl font-bold sm:text-2xl">Tournament not found</h1>
            <p className="mt-2 text-sm text-inherit/70">
              {error || "The selected tournament could not be found."}
            </p>

            <Link
              to="/tournaments"
              aria-label="Go back to tournaments"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-medium transition hover:bg-brand/90"
            >
              <ArrowLeft size={14} />
              Back to tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Prepare display values with fallbacks
  const startDate = tournament.startDate || tournament.date;
  const endDate = tournament.endDate || tournament.date;
  const category = tournament.genderCategory || tournament.category || "Open";
  const venue = tournament.venue || tournament.location || "TBA";
  const format = tournament.format || "Knockout";
  const skillLevel = tournament.skillLevel || "Open";
  const description =
    tournament.description ||
    "A competitive volleyball tournament with exciting matchups, strong team spirit, and a polished event experience.";
  const rules =
    tournament.additionalRules ||
    "Standard tournament rules apply. Match timing, tiebreakers, and final regulations will be confirmed by the organizer.";
  const leader =
    relatedStandings.length > 0
      ? getTeamName(relatedStandings[0].teamId)
      : "TBD";

  const now = new Date();
  const deadline = tournament.registrationDeadline
    ? new Date(tournament.registrationDeadline)
    : null;

  // Decide whether joining is still allowed
  const canJoin =
    String(tournament.status || "").toLowerCase() === "upcoming" &&
    (!deadline || now <= deadline);

  // Check whether current user already joined
  const alreadyJoined = Array.isArray(tournament.participants)
    ? tournament.participants.some(
        (participant) => String(participant) === String(currentUser?.id)
      )
    : false;

  // Registration needs a backend endpoint; avoid pretending the action persisted.
  const handleJoin = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setJoinMessage(
      "Tournament registration is not available from the backend yet."
    );
  };

  return (
    <div className="min-h-screen px-3 py-4 text-inherit sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top back link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-3 sm:mb-5"
        >
          <Link
            to="/tournaments"
            aria-label="Back to tournaments page"
            className="inline-flex items-center gap-2 text-sm text-inherit/75 transition hover:text-inherit"
          >
            <ArrowLeft size={15} />
            Back to tournaments
          </Link>
        </motion.div>

        {joinMessage ? (
          <div className="mb-4 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {joinMessage}
          </div>
        ) : null}

        {/* Mobile layout */}
        <div className="block lg:hidden">
          <MobileTournamentDetails
            tournament={tournament}
            relatedTeams={relatedTeams}
            relatedMatches={relatedMatches}
            relatedStandings={relatedStandings}
            currentUser={currentUser}
            canManage={canManage}
            navigate={navigate}
            getTeamName={getTeamName}
            canEditTournament={canEditTournament}
            formatDate={formatDate}
            getStatusClass={getStatusClass}
            getStatusIcon={getStatusIcon}
            category={category}
            format={format}
            leader={leader}
            venue={venue}
            skillLevel={skillLevel}
            rules={rules}
            canJoin={canJoin}
            handleJoin={handleJoin}
            alreadyJoined={alreadyJoined}
            deadline={deadline}
          />
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:block">
          <DesktopTournamentDetails
            tournament={tournament}
            relatedTeams={relatedTeams}
            relatedMatches={relatedMatches}
            relatedStandings={relatedStandings}
            currentUser={currentUser}
            canManage={canManage}
            navigate={navigate}
            getTeamName={getTeamName}
            formatDate={formatDate}
            getStatusClass={getStatusClass}
            getStatusIcon={getStatusIcon}
            canEditTournament={canEditTournament}
            category={category}
            format={format}
            leader={leader}
            startDate={startDate}
            endDate={endDate}
            venue={venue}
            skillLevel={skillLevel}
            description={description}
            rules={rules}
            canJoin={canJoin}
            handleJoin={handleJoin}
            alreadyJoined={alreadyJoined}
            deadline={deadline}
          />
        </div>
      </div>
    </div>
  );
}
function MobileTournamentDetails({
  tournament,
  relatedTeams,
  relatedMatches,
  relatedStandings,
  currentUser,
  canEditTournament,
  navigate,
  getTeamName,
  formatDate,
  getStatusClass,
  getStatusIcon,
  category,
  format,
  leader,
  venue,
  skillLevel,
  rules,
  canJoin,
  handleJoin,
  alreadyJoined,
  deadline,
}) {
  // Controls which mobile sections are collapsed / expanded
  const [openSections, setOpenSections] = useState({
    actions: true,
    details: true,
    teams: true,
    matches: true,
    standings: true,
  });

  // Toggle one section at a time by key
  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-3">
      {/* Main tournament hero card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`overflow-hidden rounded-2xl ${CARD_SHELL}`}
      >
        <div className="bg-gradient-to-br from-[#913075]/20 via-transparent to-[#47004A]/20 p-4">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                tournament.status
              )}`}
            >
              {getStatusIcon(tournament.status)}
              {tournament.status || "Unknown"}
            </span>

            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-inherit/85 ${SOFT_BUTTON}`}>
              <Volleyball size={12} />
              {format}
            </span>
          </div>

          <h1 className="mt-3 text-xl font-bold leading-7">{tournament.name}</h1>

          <div className="mt-3 space-y-2 text-sm text-inherit/75">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{tournament.location || "TBA"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={14} />
              <span>{formatDate(tournament.startDate || tournament.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} />
              <span>{category}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick summary stats */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-3 gap-2"
      >
        <CompactStat icon={Users} label="Teams" value={relatedTeams.length} />
        <CompactStat icon={ClipboardList} label="Matches" value={relatedMatches.length} />
        <CompactStat icon={Trophy} label="Leader" value={leader} />
      </motion.section>

      {/* Actions section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <MobileCard
          title="Quick Actions"
          icon={Shield}
          sectionKey="actions"
          isOpen={openSections.actions}
          onToggle={toggleSection}
        >
          <div className="mt-2 flex flex-col gap-2.5">
            {!currentUser ? (
              canJoin ? (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  aria-label="Log in to join this tournament"
                  className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-medium transition hover:bg-brand/90"
                >
                  Login to Join
                </button>
              ) : (
                <div
                  aria-label="Tournament registration is closed"
                  className={`w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-inherit/50 ${INNER_CARD}`}
                >
                  Registration Closed
                </div>
              )
            ) : canEditTournament ? (
              <>
                {/* Coach/admin actions */}
                <Link
                  to={`/edit/${tournament.id}`}
                  aria-label={`Edit ${tournament.name}`}
                  className="block w-full rounded-xl bg-brand px-4 py-3 text-center text-sm font-medium transition hover:bg-brand/90"
                >
                  Edit Tournament
                </Link>

                <Link
                  to="/participants"
                  aria-label="Manage tournament participants"
                  className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-medium transition hover:bg-black/[0.04] dark:hover:bg-white/10 ${INNER_CARD}`}
                >
                  Manage Participants
                </Link>

                {canJoin && !alreadyJoined && (
                  <button
                    type="button"
                    onClick={handleJoin}
                    aria-label={`Join ${tournament.name}`}
                    className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-medium transition hover:bg-brand/60"
                  >
                    Join Tournament
                  </button>
                )}

                {alreadyJoined && (
                  <div
                    aria-label="You have already joined this tournament"
                    className={`w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-inherit/70 ${INNER_CARD}`}
                  >
                    Already Joined
                  </div>
                )}

                {!canJoin && !alreadyJoined && (
                  <div
                    aria-label="Tournament registration is closed"
                    className={`w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-inherit/50 ${INNER_CARD}`}
                  >
                    Registration Closed
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Regular user actions */}
                {canJoin && !alreadyJoined ? (
                  <button
                    type="button"
                    onClick={handleJoin}
                    aria-label={`Join ${tournament.name}`}
                    className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-medium transition hover:bg-brand/60"
                  >
                    Join Tournament
                  </button>
                ) : alreadyJoined ? (
                  <div
                    aria-label="You have already joined this tournament"
                    className={`w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-inherit/70 ${INNER_CARD}`}
                  >
                    Already Joined
                  </div>
                ) : (
                  <div
                    aria-label="Tournament registration is closed"
                    className={`w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-inherit/50 ${INNER_CARD}`}
                  >
                    Registration Closed
                  </div>
                )}
              </>
            )}
          </div>
        </MobileCard>
      </motion.section>

      {/* Extra tournament details */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48 }}
      >
        <MobileCard
          title="Additional Details"
          icon={Info}
          sectionKey="details"
          isOpen={openSections.details}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 gap-2.5">
            <div className={`rounded-xl p-3 ${INNER_CARD}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-inherit/45">
                Venue
              </p>
              <p className="mt-1.5 text-sm font-semibold text-inherit">{venue}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className={`rounded-xl p-3 ${INNER_CARD}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-inherit/45">
                  Skill
                </p>
                <p className="mt-1.5 text-sm font-semibold text-inherit">{skillLevel}</p>
              </div>

              <div className={`rounded-xl p-3 ${INNER_CARD}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-inherit/45">
                  Deadline
                </p>
                <p className="mt-1.5 text-sm font-semibold text-inherit">
                  {deadline ? formatDate(deadline) : "TBA"}
                </p>
              </div>
            </div>

            <div className={`rounded-xl p-3 ${INNER_CARD}`}>
              <p className="text-sm font-semibold text-inherit">Rules</p>
              <p className="mt-1.5 text-xs leading-5 text-inherit/65">{rules}</p>
            </div>
          </div>
        </MobileCard>
      </motion.section>

      {/* Participating teams */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52 }}
      >
        <MobileCard
          title="Participating Teams"
          icon={Users}
          sectionKey="teams"
          isOpen={openSections.teams}
          onToggle={toggleSection}
        >
          <div className="space-y-2">
            {relatedTeams.length > 0 ? (
              relatedTeams.map((team) => (
                <div
                  key={team.id}
                  className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 ${INNER_CARD}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-inherit">{team.name}</p>
                    <p className="mt-1 text-xs text-inherit/50">
                      {team.gender || "Mixed"} team
                    </p>
                  </div>

                  <Link
                    to={`/teams/${team.id}`}
                    aria-label={`View details for ${team.name}`}
                    className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-inherit transition hover:bg-black/[0.04] dark:hover:bg-white/15 ${SOFT_BUTTON}`}
                  >
                    <Eye size={12} />
                    View team details
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-inherit/60">No participating teams available yet.</p>
            )}
          </div>
        </MobileCard>
      </motion.section>

      {/* Match list */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <MobileCard
          title="Matches"
          icon={CalendarDays}
          sectionKey="matches"
          isOpen={openSections.matches}
          onToggle={toggleSection}
        >
          <div className="space-y-2">
            {relatedMatches.length > 0 ? (
              relatedMatches.map((match) => (
                <div
                  key={match.id}
                  className={`rounded-xl px-3 py-2.5 ${INNER_CARD}`}
                >
                  <div className="flex items-center justify-center gap-0.5 text-sm font-medium leading-6">
                    <span className="flex-1 truncate pl-8 text-left">
                      {getTeamName(match.teamA)}
                    </span>

                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      aria-hidden="true"
                    >
                      <Swords size={14} className="text-inherit/70" />
                    </div>

                    <span className="flex-1 truncate pr-8 text-left">
                      {getTeamName(match.teamB)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-inherit/55">{formatDate(match.date)}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${getStatusClass(
                        match.status || tournament.status
                      )}`}
                    >
                      {getStatusIcon(match.status || tournament.status)}
                      {match.status || tournament.status || "scheduled"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-inherit/60">No matches available yet.</p>
            )}
          </div>
        </MobileCard>
      </motion.section>

      {/* Standings list */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MobileCard
          title="Standings"
          icon={Trophy}
          sectionKey="standings"
          isOpen={openSections.standings}
          onToggle={toggleSection}
        >
          <div className="space-y-2">
            {relatedStandings.length > 0 ? (
              relatedStandings.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`rounded-xl px-3 py-2.5 transition-all duration-300 ${
                    index === 0
                      ? "border border-[#913075]/35 bg-[#913075]/12 shadow-sm ring-1 ring-[#913075]/15 dark:bg-[#913075]/15"
                      : INNER_CARD
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="relative shrink-0">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold ${
                            index === 0
                              ? "border-[#c06ca6]/40 bg-[#913075]/20 text-inherit"
                              : "border-black/10 bg-white/85 text-inherit/80 ring-1 ring-black/5 dark:border-white/10 dark:bg-white/10 dark:ring-white/5"
                          }`}
                        >
                          {index + 1}
                        </div>

                        {index === 0 && (
                          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#c06ca6]/40 bg-[#1a1022] shadow-sm">
                            <Crown size={9} className="text-white dark:text-inherit" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {getTeamName(entry.teamId)}
                        </p>
                        <p className="text-[11px] text-inherit/45">
                          {entry.wins}W · {entry.losses}L
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-inherit">{entry.points}</p>
                      <p className="text-[11px] text-inherit/45">pts</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-inherit/60">No standings available yet.</p>
            )}
          </div>
        </MobileCard>
      </motion.section>
    </div>
  );
}

function DesktopTournamentDetails({
  tournament,
  relatedTeams,
  relatedMatches,
  relatedStandings,
  currentUser,
  canEditTournament,
  navigate,
  getTeamName,
  formatDate,
  getStatusClass,
  getStatusIcon,
  category,
  format,
  startDate,
  endDate,
  description,
  rules,
  canJoin,
  handleJoin,
  alreadyJoined,
  deadline,
}) {
  // Controls which desktop sections are collapsed / expanded
  const [openSections, setOpenSections] = useState({
    details: true,
    teams: true,
    matches: true,
    standings: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* Desktop main hero card */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`flex-1 overflow-hidden rounded-3xl ${CARD_SHELL}`}
        >
          <div className="h-full bg-gradient-to-br from-[#913075]/25 via-transparent to-[#47004A]/25 p-6 xl:p-8">
            <div className="flex h-full items-stretch justify-between gap-6">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                      tournament.status
                    )}`}
                  >
                    {getStatusIcon(tournament.status)}
                    {tournament.status || "Unknown"}
                  </span>

                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-inherit/85 ${SOFT_BUTTON}`}>
                    <Volleyball size={14} />
                    {format}
                  </span>
                </div>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  {tournament.name}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-inherit/75">
                  {description}
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <DesktopInfo
                    icon={MapPin}
                    label="Location"
                    value={tournament.location || "TBA"}
                  />
                  <DesktopInfo
                    icon={CalendarDays}
                    label="Start"
                    value={formatDate(startDate)}
                  />
                  <DesktopInfo
                    icon={Flag}
                    label="End"
                    value={formatDate(endDate)}
                  />
                  <DesktopInfo
                    icon={Shield}
                    label="Category"
                    value={category}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Desktop quick actions */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full shrink-0 lg:w-[320px] lg:self-stretch"
        >
          <div className={`flex h-full flex-col rounded-3xl p-5 ${CARD_SHELL}`}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${INNER_CARD}`}>
                <Shield size={18} className="text-inherit/80" />
              </div>
              <div>
                <p className="text-lg font-semibold text-inherit">Quick Actions</p>
                <p className="text-sm text-inherit/50">Manage this tournament</p>
              </div>
            </div>

            <div className="mt-5 flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-3">
                {!currentUser ? (
                  canJoin ? (
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      aria-label="Log in to join this tournament"
                      className="w-full rounded-2xl bg-brand px-4 py-3.5 text-sm font-medium transition hover:bg-brand/90"
                    >
                      Login to Join
                    </button>
                  ) : (
                    <div
                      aria-label="Tournament registration is closed"
                      className={`w-full rounded-2xl px-4 py-3.5 text-center text-sm font-medium text-inherit/50 ${INNER_CARD}`}
                    >
                      Registration Closed
                    </div>
                  )
                ) : canEditTournament ? (
                  <>
                    {/* Coach/admin actions */}
                    <Link
                      to={`/edit/${tournament.id}`}
                      aria-label={`Edit ${tournament.name}`}
                      className="block w-full rounded-2xl bg-brand text-[#f3ceff] px-4 py-3.5 text-center text-sm font-medium transition hover:bg-brand/90"
                    >
                      Edit Tournament
                    </Link>

                    <Link
                      to="/participants"
                      aria-label="Manage tournament participants"
                      className={`block w-full rounded-2xl px-4 py-3.5 text-center text-sm font-medium transition hover:bg-black/[0.04] dark:hover:bg-white/10 ${INNER_CARD}`}
                    >
                      Manage Participants
                    </Link>

                    {canJoin && !alreadyJoined && (
                      <button
                        type="button"
                        onClick={handleJoin}
                        aria-label={`Join ${tournament.name}`}
                        className="w-full rounded-2xl bg-brand px-4 py-3.5 text-sm font-medium transition hover:bg-brand/60"
                      >
                        Join Tournament
                      </button>
                    )}

                    {alreadyJoined && (
                      <div
                        aria-label="You have already joined this tournament"
                        className={`w-full rounded-2xl px-4 py-3.5 text-center text-sm font-medium text-inherit/70 ${INNER_CARD}`}
                      >
                        Already Joined
                      </div>
                    )}

                    {!canJoin && !alreadyJoined && (
                      <div
                        aria-label="Tournament registration is closed"
                        className={`w-full rounded-2xl px-4 py-3.5 text-center text-sm font-medium text-inherit/50 ${INNER_CARD}`}
                      >
                        Registration Closed
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Regular user actions */}
                    {canJoin && !alreadyJoined ? (
                      <button
                        type="button"
                        onClick={handleJoin}
                        aria-label={`Join ${tournament.name}`}
                        className="w-full rounded-2xl bg-brand px-4 py-3.5 text-sm font-medium transition hover:bg-brand/60"
                      >
                        Join Tournament
                      </button>
                    ) : alreadyJoined ? (
                      <div
                        aria-label="You have already joined this tournament"
                        className={`w-full rounded-2xl px-4 py-3.5 text-center text-sm font-medium text-inherit/70 ${INNER_CARD}`}
                      >
                        Already Joined
                      </div>
                    ) : (
                      <div
                        aria-label="Tournament registration is closed"
                        className={`w-full rounded-2xl px-4 py-3.5 text-center text-sm font-medium text-inherit/50 ${INNER_CARD}`}
                      >
                        Registration Closed
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-5">
          {/* Extra desktop details */}
          <DesktopCard
            title="Additional Details"
            icon={Info}
            sectionKey="details"
            isOpen={openSections.details}
            onToggle={toggleSection}
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className={`rounded-xl p-4 ${INNER_CARD}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-inherit/45">
                  Team Size
                </p>
                <p className="mt-2 text-lg font-semibold text-inherit">6 Players</p>
                <p className="mt-1 text-xs leading-5 text-inherit/55">
                  Standard team size
                </p>
              </div>

              <div className={`rounded-xl p-4 ${INNER_CARD}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-inherit/45">
                  Deadline
                </p>
                <p className="mt-2 text-lg font-semibold text-inherit">
                  {deadline ? formatDate(deadline) : "TBA"}
                </p>
                <p className="mt-1 text-xs leading-5 text-inherit/55">
                  Registration closes
                </p>
              </div>

              <div className={`rounded-xl p-4 ${INNER_CARD}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-inherit/45">
                  Entry Fee
                </p>
                <p className="mt-2 text-lg font-semibold text-inherit">Free</p>
                <p className="mt-1 text-xs leading-5 text-inherit/55">
                  No payment required
                </p>
              </div>
            </div>

            <div className={`mt-3 rounded-xl p-4 ${INNER_CARD}`}>
              <p className="text-sm font-semibold text-inherit">Rules</p>
              <p className="mt-2 text-sm leading-6 text-inherit/65">{rules}</p>
            </div>
          </DesktopCard>

          {/* Teams section */}
          <DesktopCard
            title="Participating Teams"
            icon={Users}
            sectionKey="teams"
            isOpen={openSections.teams}
            onToggle={toggleSection}
          >
            <div className="space-y-3">
              {relatedTeams.length > 0 ? (
                relatedTeams.map((team) => (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between gap-4 rounded-2xl p-4 ${INNER_CARD}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-inherit">
                        {team.name}
                      </p>
                      <p className="mt-1 text-sm text-inherit/50">
                        {team.gender || "Mixed"} team
                      </p>
                    </div>

                    <Link
                      to={`/teams/${team.id}`}
                      aria-label={`View details for ${team.name}`}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-inherit transition hover:bg-black/[0.04] dark:hover:bg-white/15 ${SOFT_BUTTON}`}
                    >
                      <Eye size={13} />
                      View team details
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-inherit/65">No participating teams available yet.</p>
              )}
            </div>
          </DesktopCard>

          {/* Match schedule */}
          <DesktopCard
            title="Match Schedule"
            icon={CalendarDays}
            sectionKey="matches"
            isOpen={openSections.matches}
            onToggle={toggleSection}
          >
            <div className="space-y-3">
              {relatedMatches.length > 0 ? (
                relatedMatches.map((match) => (
                  <div
                    key={match.id}
                    className={`rounded-2xl p-4 ${INNER_CARD}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-center gap-3">
                          <p className="flex-1 truncate pl-12 text-left text-base font-semibold leading-6">
                            {getTeamName(match.teamA)}
                          </p>

                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                            aria-hidden="true"
                          >
                            <Swords size={16} className="text-inherit/70" />
                          </div>

                          <p className="flex-1 truncate text-left text-base font-semibold leading-6">
                            {getTeamName(match.teamB)}
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-inherit/60">
                          {formatDate(match.date)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                          match.status || tournament.status
                        )}`}
                      >
                        {getStatusIcon(match.status || tournament.status)}
                        {match.status || tournament.status || "scheduled"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-inherit/65">No matches available yet.</p>
              )}
            </div>
          </DesktopCard>
        </div>

        <div className="space-y-5">
          {/* Standings section */}
          <DesktopCard
            title="Standings"
            icon={Trophy}
            sectionKey="standings"
            isOpen={openSections.standings}
            onToggle={toggleSection}
          >
            <div className="space-y-3">
              {relatedStandings.length > 0 ? (
                relatedStandings.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`rounded-2xl p-4 transition-all duration-300 ${
                      index === 0
                        ? "border border-[#913075]/35 bg-[#913075]/12 shadow-sm ring-1 ring-[#913075]/15 dark:bg-[#913075]/15"
                        : INNER_CARD
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative shrink-0">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-bold ${
                              index === 0
                                ? "border-[#c06ca6]/40 bg-[#913075]/20 text-inherit"
                                : "border-black/10 bg-white/85 text-inherit/80 ring-1 ring-black/5 dark:border-white/10 dark:bg-white/10 dark:ring-white/5"
                            }`}
                          >
                            {index + 1}
                          </div>

                          {index === 0 && (
                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#c06ca6]/40 bg-[#1a1022] shadow-sm">
                              <Crown size={10} className="text-white dark:text-inherit" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold">
                            {getTeamName(entry.teamId)}
                          </p>
                          <p className="mt-1 text-xs text-inherit/45">
                            Played {entry.wins + entry.losses} matches
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-inherit">{entry.points}</p>
                        <p className="text-xs text-inherit/45">points</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <MiniNumber label="Wins" value={entry.wins} />
                      <MiniNumber label="Losses" value={entry.losses} />
                      <MiniNumber label="Points" value={entry.points} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-inherit/65">No standings available yet.</p>
              )}
            </div>
          </DesktopCard>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ title, icon: Icon, children, sectionKey, isOpen, onToggle }) {
  // Unique id used for ARIA controls
  const contentId = `mobile-section-${sectionKey}`;

  return (
    <section className={`rounded-2xl p-3 ${CARD_SHELL}`}>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-brand/20 ${INNER_CARD}`}>
            <Icon size={14} />
          </div>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>

        {/* Toggle button for collapsible mobile sections */}
        <button
          type="button"
          aria-label={`${isOpen ? "Hide" : "Show"} ${title}`}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => onToggle(sectionKey)}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-inherit transition hover:bg-black/[0.04] dark:hover:bg-white/15 rounded-lg ${SOFT_BUTTON}`}
        >
          {isOpen ? "Hide" : "Show"}
          {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {isOpen && <div id={contentId}>{children}</div>}
    </section>
  );
}

function DesktopCard({ title, icon: Icon, children, sectionKey, isOpen, onToggle }) {
  // Unique id used for ARIA controls
  const contentId = `desktop-section-${sectionKey}`;

  return (
    <section className={`rounded-3xl p-5 ${CARD_SHELL}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-brand/20 ${INNER_CARD}`}>
            <Icon size={16} />
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {/* Toggle button for collapsible desktop sections */}
        <button
          type="button"
          aria-label={`${isOpen ? "Hide" : "Show"} ${title}`}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => onToggle(sectionKey)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-inherit transition hover:bg-black/[0.04] dark:hover:bg-white/15 rounded-lg ${SOFT_BUTTON}`}
        >
          {isOpen ? "Hide" : "Show"}
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isOpen && <div id={contentId}>{children}</div>}
    </section>
  );
}

function CompactStat({ icon: Icon, label, value }) {
  // Small stat card used in mobile summary row
  return (
    <div className={`rounded-2xl p-2.5 text-center ${CARD_SHELL}`}>
      <div className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-xl ${INNER_CARD}`}>
        <Icon size={13} />
      </div>
      <p className="truncate text-sm font-semibold">{value}</p>
      <p className="mt-0.5 text-[10px] text-inherit/55">{label}</p>
    </div>
  );
}

function DesktopInfo({ icon: Icon, label, value }) {
  // Small info card used in the desktop hero section
  return (
    <div className={`rounded-2xl p-3 ${INNER_CARD}`}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-inherit/50">
        <Icon size={12} />
        <span>{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

function MiniNumber({ label, value }) {
  // Small number box used inside standings cards
  return (
    <div className={`rounded-xl px-2.5 py-2.5 text-center ${INNER_CARD}`}>
      <p className="text-[10px] uppercase tracking-[0.1em] text-inherit/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

