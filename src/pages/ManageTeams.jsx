import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  Plus,
  Shield,
  Trash2,
  Users,
  Volleyball,
} from "lucide-react";
import { apiFetch, normalizePlayer, normalizeTeam } from "../utils/api";

const createEmptyPlayer = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "",
  position: "",
  number: "",
  age: "",
});

const createEmptyTeamForm = () => ({
  teamName: "",
  coach: "",
  city: "",
  gender: "male",
  players: [createEmptyPlayer()],
});

const CARD_SHELL =
  "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl";
const INNER_CARD =
  "rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl";
const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-inherit outline-none transition placeholder:text-inherit/40 focus:border-white/20 focus:bg-white/[0.14] focus:ring-2 focus:ring-brand/25";
const SELECT_CLASS =
  "w-full rounded-xl border border-white/10 bg-brand px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-brand/25";
const LABEL_CLASS = "mb-2 block text-sm font-medium text-inherit/75";
const SECTION_TITLE_CLASS = "text-xl font-bold text-inherit";
const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:bg-brand/90";
const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 font-semibold text-inherit transition hover:bg-white/[0.14]";
const DANGER_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 font-semibold text-red-100 transition hover:bg-red-500/15";
const TEAM_ACTION_BUTTON =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition";
const TEAM_VIEW_BUTTON =
  `${TEAM_ACTION_BUTTON} border border-white/10 bg-white/10 text-inherit hover:bg-white/[0.14]`;
const TEAM_DELETE_BUTTON =
  `${TEAM_ACTION_BUTTON} border border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/15`;

const tips = [
  "Create the team first, then attach a clean player list in one flow.",
  "Use consistent city and coach names so the data stays readable.",
  "If a team has no players yet, you can still create it and add roster details later.",
  "Open the team details page after creation to review tournaments and match history.",
];

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teamForm, setTeamForm] = useState(createEmptyTeamForm());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    basic: true,
    roster: false,
  });

  async function loadTeamsData() {
    setIsLoading(true);

    try {
      const [teamsData, playersData] = await Promise.all([
        apiFetch("/api/teams"),
        apiFetch("/api/players"),
      ]);

      setTeams((teamsData || []).map(normalizeTeam));
      setPlayers((playersData || []).map(normalizePlayer));
    } catch (requestError) {
      setErrorMessage(requestError.message || "Unable to load teams.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTeamsData();
  }, []);

  const playersByTeam = useMemo(() => {
    return players.reduce((accumulator, player) => {
      const key = String(player.teamId || "");
      if (!accumulator[key]) accumulator[key] = [];
      accumulator[key].push(player);
      return accumulator;
    }, {});
  }, [players]);

  const filledPlayersCount = teamForm.players.filter((player) =>
    player.name.trim()
  ).length;

  function toggleSection(sectionKey) {
    setOpenSections((previous) => ({
      ...previous,
      [sectionKey]: !previous[sectionKey],
    }));
  }

  function handleTeamChange(event) {
    const { name, value } = event.target;
    setTeamForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePlayerChange(index, field, value) {
    setTeamForm((previous) => {
      const updatedPlayers = [...previous.players];
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        [field]: value,
      };

      return {
        ...previous,
        players: updatedPlayers,
      };
    });
  }

  function addPlayerField() {
    setTeamForm((previous) => ({
      ...previous,
      players: [...previous.players, createEmptyPlayer()],
    }));
  }

  function removePlayerField(playerId) {
    setTeamForm((previous) => {
      const updatedPlayers = previous.players.filter(
        (player) => player.id !== playerId
      );

      return {
        ...previous,
        players: updatedPlayers.length ? updatedPlayers : [createEmptyPlayer()],
      };
    });
  }

  async function addTeam() {
    if (!teamForm.teamName.trim()) {
      setErrorMessage("Please enter a team name before adding a team.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const team = normalizeTeam(
        await apiFetch("/api/teams", {
          method: "POST",
          auth: true,
          body: {
            name: teamForm.teamName.trim(),
            coachName: teamForm.coach.trim(),
            city: teamForm.city.trim(),
            gender: teamForm.gender,
          },
        })
      );

      const validPlayers = teamForm.players.filter((player) => player.name.trim());

      await Promise.all(
        validPlayers.map((player) =>
          apiFetch("/api/players", {
            method: "POST",
            auth: true,
            body: {
              name: player.name.trim(),
              position: player.position.trim() || "Unknown",
              gender: teamForm.gender,
              number: player.number === "" ? undefined : Number(player.number),
              age: player.age === "" ? undefined : Number(player.age),
              team: team.id,
            },
          })
        )
      );

      setTeamForm(createEmptyTeamForm());
      setStatusMessage("Team added successfully.");
      await loadTeamsData();
    } catch (requestError) {
      setErrorMessage(requestError.message || "Unable to add team.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeTeam(teamId) {
    try {
      await apiFetch(`/api/teams/${teamId}`, {
        method: "DELETE",
        auth: true,
      });
      setStatusMessage("Team removed successfully.");
      await loadTeamsData();
    } catch (requestError) {
      setErrorMessage(requestError.message || "Unable to remove team.");
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 text-inherit sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 text-sm text-inherit/75 transition hover:text-inherit"
          >
            <ArrowLeft size={15} />
            Back to tournaments
          </Link>
        </div>

        <section className={`mb-8 overflow-hidden p-6 sm:p-8 ${CARD_SHELL}`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-inherit/60">
                ArenaFlow
              </p>
              <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Manage Teams</h1>
              <p className="max-w-2xl text-inherit/70">
                Create teams, attach players, and review your current roster data
                directly from the backend.
              </p>
            </div>

            <div className={`grid grid-cols-2 gap-3 p-3 sm:min-w-[300px] ${INNER_CARD}`}>
              <HeroStat icon={Users} label="Teams" value={teams.length} />
              <HeroStat icon={Volleyball} label="Players" value={players.length} />
              <HeroStat
                icon={Shield}
                label="In Form"
                value={teamForm.teamName || "Untitled"}
              />
              <HeroStat
                icon={MapPin}
                label="Roster"
                value={`${filledPlayersCount} players`}
              />
            </div>
          </div>
        </section>

        {statusMessage ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
            {statusMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_0.7fr]">
          <div className={`p-6 sm:p-8 ${CARD_SHELL}`}>
            <div className="space-y-8">
              <FormSection
                sectionKey="basic"
                title="Create Team"
                icon={Shield}
                description="Start with the main team information and identity."
                isOpen={openSections.basic}
                onToggle={toggleSection}
              >
                <div className="space-y-6">
                  <Field label="Team Name" htmlFor="teamName">
                    <input
                      id="teamName"
                      name="teamName"
                      value={teamForm.teamName}
                      onChange={handleTeamChange}
                      className={INPUT_CLASS}
                      placeholder="ArenaFlow Eagles"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Coach Name" htmlFor="coach">
                      <input
                        id="coach"
                        name="coach"
                        value={teamForm.coach}
                        onChange={handleTeamChange}
                        className={INPUT_CLASS}
                        placeholder="Coach name"
                      />
                    </Field>

                    <Field label="City" htmlFor="city">
                      <input
                        id="city"
                        name="city"
                        value={teamForm.city}
                        onChange={handleTeamChange}
                        className={INPUT_CLASS}
                        placeholder="City"
                      />
                    </Field>
                  </div>

                  <Field label="Team Gender" htmlFor="gender">
                    <select
                      id="gender"
                      name="gender"
                      value={teamForm.gender}
                      onChange={handleTeamChange}
                      className={SELECT_CLASS}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </Field>
                </div>
              </FormSection>

              <FormSection
                sectionKey="roster"
                title="Players"
                icon={Users}
                description="Add roster entries before saving the team."
                isOpen={openSections.roster}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  {teamForm.players.map((player, index) => (
                    <div key={player.id} className={`p-4 ${INNER_CARD}`}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-inherit">
                          Player {index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removePlayerField(player.id)}
                          className={DANGER_BUTTON}
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <input
                          placeholder="Player name"
                          value={player.name}
                          onChange={(event) =>
                            handlePlayerChange(index, "name", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                        <input
                          placeholder="Position"
                          value={player.position}
                          onChange={(event) =>
                            handlePlayerChange(index, "position", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                        <input
                          type="number"
                          placeholder="Jersey number"
                          value={player.number}
                          onChange={(event) =>
                            handlePlayerChange(index, "number", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          value={player.age}
                          onChange={(event) =>
                            handlePlayerChange(index, "age", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={addPlayerField} className={SECONDARY_BUTTON}>
                    <Plus size={16} />
                    Add Another Player
                  </button>
                </div>
              </FormSection>

              <section className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={addTeam}
                  className={PRIMARY_BUTTON}
                >
                  <Plus size={16} />
                  {isSubmitting ? "Saving..." : "Add Team"}
                </button>
              </section>
            </div>
          </div>

          <aside className="space-y-6">
            <section className={`p-6 ${CARD_SHELL}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center ${INNER_CARD}`}>
                  <Eye size={18} className="text-inherit/80" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Quick Summary</h2>
                  <p className="text-sm text-inherit/55">Current backend-backed team data</p>
                </div>
              </div>

              <div className="space-y-3">
                <PreviewRow label="Current teams" value={teams.length} />
                <PreviewRow
                  label="Team in form"
                  value={teamForm.teamName || "Untitled team"}
                />
                <PreviewRow label="Players in form" value={filledPlayersCount} />
                <PreviewRow
                  label="Selected division"
                  value={capitalize(teamForm.gender)}
                />
              </div>
            </section>

            <section className={`p-6 ${CARD_SHELL}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center ${INNER_CARD}`}>
                  <Volleyball size={18} className="text-inherit/80" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Quick Tips</h2>
                  <p className="text-sm text-inherit/55">Keep the roster clean and consistent</p>
                </div>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-inherit/70">
                {tips.map((tip) => (
                  <li key={tip} className={`flex gap-3 rounded-2xl px-4 py-3 ${INNER_CARD}`}>
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <section className={`mt-8 p-6 sm:p-8 ${CARD_SHELL}`}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-inherit/45">
                ArenaFlow
              </p>
              <h2 className="mt-2 text-2xl font-bold text-inherit">Existing Teams</h2>
            </div>
            <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 ${INNER_CARD}`}>
              <Users size={16} className="text-inherit/75" />
              <span className="text-sm font-medium text-inherit">
                {teams.length} teams registered
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className={`p-6 text-center ${INNER_CARD}`}>Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className={`p-6 text-center text-inherit/65 ${INNER_CARD}`}>
              No teams added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => {
                const teamPlayers = playersByTeam[String(team.id)] || [];

                return (
                  <article key={team.id} className={`p-5 ${INNER_CARD}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-inherit">{team.name}</h3>
                          <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-inherit/80">
                            {capitalize(team.gender)}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-inherit/65 sm:grid-cols-3">
                          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                            Coach: {team.coach || "N/A"}
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                            City: {team.city || "Unknown"}
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                            Players: {teamPlayers.length}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/teams/${team.id}`} className={TEAM_VIEW_BUTTON}>
                          <Eye size={15} />
                          View Team
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeTeam(team.id)}
                          className={TEAM_DELETE_BUTTON}
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>

                    {teamPlayers.length > 0 ? (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {teamPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-inherit/75"
                          >
                            <span className="font-semibold text-inherit">
                              #{player.number ?? "N/A"} {player.name}
                            </span>
                            <p className="mt-1 text-inherit/55">
                              {player.position || "Unknown position"}
                              {player.age ? ` • Age ${player.age}` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-5 text-sm text-inherit/55">No players added.</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FormSection({
  title,
  icon: Icon,
  description,
  children,
  sectionKey,
  isOpen,
  onToggle,
}) {
  const contentId = `manage-teams-section-${sectionKey}`;

  return (
    <section className={`p-5 sm:p-6 ${INNER_CARD}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand/20">
            <Icon size={17} className="text-inherit/85" />
          </div>
          <div>
            <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
            <p className="mt-1 text-sm text-inherit/55">{description}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label={`${isOpen ? "Hide" : "Show"} ${title}`}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => onToggle(sectionKey)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-inherit transition hover:bg-white/[0.14]"
        >
          {isOpen ? "Hide" : "Show"}
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isOpen ? <div id={contentId}>{children}</div> : null}
    </section>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={LABEL_CLASS}>
        {label}
      </label>
      {children}
    </div>
  );
}

function HeroStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-inherit/45">
        <Icon size={12} />
        <span>{label}</span>
      </div>
      <p className="truncate text-sm font-semibold text-inherit">{value}</p>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${INNER_CARD}`}>
      <span className="text-sm text-inherit/55">{label}</span>
      <span className="text-right text-sm font-medium text-inherit">{value}</span>
    </div>
  );
}

function capitalize(value) {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
