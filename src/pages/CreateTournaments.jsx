import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Eye,
  Flag,
  MapPin,
  Settings2,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Volleyball,
} from "lucide-react";
import { apiFetch, normalizeTeam } from "../utils/api";
import { toTournamentPayload } from "../utils/tournamentPayload";

const defaultTournament = {
  name: "",
  location: "",
  venue: "",
  startDate: "",
  endDate: "",
  format: "Single Elimination",
  volleyballType: "Indoor",
  maxTeams: "",
  skillLevel: "Open",
  genderCategory: "Men",
  visibility: "Public",
  registrationMode: "approval",
  bestOf: "3 Sets",
  pointsPerSet: "25",
  finalSetPoints: "15",
  description: "",
  additionalRules: "",
  selectedTeamIds: [],
};

const CARD_SHELL =
  "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl";
const INNER_CARD =
  "rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl";
const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-inherit outline-none transition placeholder:text-inherit/40 focus:border-white/20 focus:bg-white/[0.14] focus:ring-2 focus:ring-brand/25";
const LABEL_CLASS = "mb-2 block text-sm font-medium text-inherit/75";
const SELECT_CLASS =
  "w-full rounded-xl border border-white/10 bg-brand px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-brand/25";
const SECTION_TITLE_CLASS = "text-xl font-bold text-inherit";
const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:bg-brand/90";
const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 font-semibold text-inherit transition hover:bg-white/[0.14]";

const tips = [
  "Choose a format before teams start registering.",
  "Keep venue, dates, and volleyball type aligned.",
  "Use the description to clarify eligibility and expectations.",
  "Set match rules once so every round feels consistent.",
];

export default function CreateTournament() {
  const [tournament, setTournament] = useState(defaultTournament);
  const [teams, setTeams] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    basic: true,
    settings: false,
    access: false,
    rules: false,
    description: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await apiFetch("/api/teams");
        setTeams((data || []).map(normalizeTeam));
      } catch {
        setTeams([]);
      }
    }

    loadTeams();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setTournament((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "visibility" && value === "Public"
        ? {
            registrationMode:
              previous.registrationMode === "invite-only"
                ? "approval"
                : previous.registrationMode,
            selectedTeamIds: [],
          }
        : {}),
    }));
  }

  function toggleSelectedTeam(teamId) {
    setTournament((previous) => {
      const currentIds = Array.isArray(previous.selectedTeamIds)
        ? previous.selectedTeamIds
        : [];

      const exists = currentIds.includes(teamId);

      return {
        ...previous,
        selectedTeamIds: exists
          ? currentIds.filter((id) => id !== teamId)
          : [...currentIds, teamId],
      };
    });
  }

  async function submitTournament(status) {
    setIsSubmitting(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const data = await apiFetch("/api/tournaments", {
        method: "POST",
        auth: true,
        body: toTournamentPayload(tournament, status),
      });

      setStatusMessage(
        status === "draft"
          ? "Tournament draft saved."
          : "Tournament created successfully."
      );

      setTimeout(() => {
        navigate(`/edit/${data._id || data.id}`);
      }, 600);
    } catch (requestError) {
      const validationMessage = Array.isArray(requestError.details?.errors)
        ? requestError.details.errors[0]
        : requestError.message;
      setErrorMessage(validationMessage || "Unable to create tournament.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitTournament("published");
  }

  function handleSaveDraft() {
    submitTournament("draft");
  }

  function toggleSection(sectionKey) {
    setOpenSections((previous) => ({
      ...previous,
      [sectionKey]: !previous[sectionKey],
    }));
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
              <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
                Create Tournament
              </h1>
              <p className="max-w-2xl text-inherit/70">
                Set up a tournament using the same live backend flow as the rest
                of the platform.
              </p>
            </div>

            <div className={`grid grid-cols-2 gap-3 p-3 sm:min-w-[280px] ${INNER_CARD}`}>
              <HeroStat icon={Volleyball} label="Type" value={tournament.volleyballType} />
              <HeroStat
                icon={CalendarDays}
                label="Start"
                value={tournament.startDate || "TBA"}
              />
              <HeroStat icon={Shield} label="Category" value={tournament.genderCategory} />
              <HeroStat
                icon={Trophy}
                label="Format"
                value={shortenValue(tournament.format)}
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
            <form className="space-y-8" onSubmit={handleSubmit}>
              <FormSection
                sectionKey="basic"
                title="Basic Information"
                icon={MapPin}
                description="Start with the core event identity and schedule."
                isOpen={openSections.basic}
                onToggle={toggleSection}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Tournament Name" htmlFor="name" className="md:col-span-2">
                    <input
                      id="name"
                      name="name"
                      required
                      value={tournament.name}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                      placeholder="ArenaFlow Spring Cup"
                    />
                  </Field>

                  <Field label="Location" htmlFor="location">
                    <input
                      id="location"
                      name="location"
                      required
                      value={tournament.location}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                      placeholder="Beirut"
                    />
                  </Field>

                  <Field label="Venue" htmlFor="venue">
                    <input
                      id="venue"
                      name="venue"
                      value={tournament.venue}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                      placeholder="Main court or sports complex"
                    />
                  </Field>

                  <Field label="Start Date" htmlFor="startDate">
                    <input
                      id="startDate"
                      type="date"
                      name="startDate"
                      required
                      value={tournament.startDate}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <Field label="End Date" htmlFor="endDate">
                    <input
                      id="endDate"
                      type="date"
                      name="endDate"
                      required
                      value={tournament.endDate}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                sectionKey="settings"
                title="Tournament Settings"
                icon={Settings2}
                description="Choose the structure and audience for the event."
                isOpen={openSections.settings}
                onToggle={toggleSection}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Tournament Format" htmlFor="format">
                    <select
                      id="format"
                      name="format"
                      value={tournament.format}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Round Robin</option>
                      <option>Group Stage + Knockout</option>
                    </select>
                  </Field>

                  <Field label="Volleyball Type" htmlFor="volleyballType">
                    <select
                      id="volleyballType"
                      name="volleyballType"
                      value={tournament.volleyballType}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option>Indoor</option>
                      <option>Beach</option>
                      <option>Grass</option>
                      <option>Snow</option>
                    </select>
                  </Field>

                  <Field label="Max Teams" htmlFor="maxTeams">
                    <input
                      id="maxTeams"
                      type="number"
                      min="2"
                      name="maxTeams"
                      value={tournament.maxTeams}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                      placeholder="8"
                    />
                  </Field>

                  <Field label="Skill Level" htmlFor="skillLevel">
                    <select
                      id="skillLevel"
                      name="skillLevel"
                      value={tournament.skillLevel}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option>Open</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>University</option>
                    </select>
                  </Field>

                  <Field label="Gender Category" htmlFor="genderCategory">
                    <select
                      id="genderCategory"
                      name="genderCategory"
                      value={tournament.genderCategory}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option>Men</option>
                      <option>Women</option>
                      <option>Mixed</option>
                    </select>
                  </Field>

                  <Field label="Tournament Visibility" htmlFor="visibility">
                    <select
                      id="visibility"
                      name="visibility"
                      value={tournament.visibility}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </Field>
                </div>
              </FormSection>

              <FormSection
                sectionKey="access"
                title="Team Access"
                icon={Users}
                description="Decide whether teams apply to join or get invited directly."
                isOpen={openSections.access}
                onToggle={toggleSection}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Registration Flow" htmlFor="registrationMode">
                    <select
                      id="registrationMode"
                      name="registrationMode"
                      value={tournament.registrationMode}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option value="approval">Teams apply, organizer approves</option>
                      <option value="invite-only">Invite selected teams only</option>
                    </select>
                  </Field>

                  <div className={`flex items-end rounded-2xl px-4 py-3 ${INNER_CARD}`}>
                    <p className="text-sm leading-6 text-inherit/65">
                      {tournament.visibility === "Public"
                        ? "Public tournaments can be discovered by teams. Approval keeps the organizer in control of who joins."
                        : "Private tournaments stay controlled. Invite selected teams to populate the bracket from the start."}
                    </p>
                  </div>
                </div>

                {tournament.registrationMode === "invite-only" ||
                tournament.visibility === "Private" ? (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-inherit/75">
                        Invite Teams
                      </p>
                      <p className="text-xs text-inherit/45">
                        {tournament.selectedTeamIds.length} selected
                      </p>
                    </div>

                    {teams.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {teams.map((team) => {
                          const isSelected = tournament.selectedTeamIds.includes(team.id);

                          return (
                            <button
                              key={team.id}
                              type="button"
                              onClick={() => toggleSelectedTeam(team.id)}
                              className={`rounded-2xl border px-4 py-3 text-left transition ${
                                isSelected
                                  ? "border-brand bg-brand/15 ring-1 ring-brand/20"
                                  : "border-white/10 bg-white/10 hover:bg-white/[0.14]"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-inherit">
                                    {team.name}
                                  </p>
                                  <p className="mt-1 text-sm text-inherit/55">
                                    {team.city || "Unknown city"} • {team.gender || "Mixed"}
                                  </p>
                                </div>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    isSelected
                                      ? "bg-brand text-white"
                                      : "bg-white/10 text-inherit/65"
                                  }`}
                                >
                                  {isSelected ? "Invited" : "Select"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`rounded-2xl px-4 py-4 text-sm text-inherit/60 ${INNER_CARD}`}>
                        No teams are available yet. Create teams first from the teams page,
                        then come back here to invite them.
                      </div>
                    )}
                  </div>
                ) : null}
              </FormSection>

              <FormSection
                sectionKey="rules"
                title="Match Rules"
                icon={ClipboardList}
                description="Define how matches should be played across the event."
                isOpen={openSections.rules}
                onToggle={toggleSection}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field label="Best Of" htmlFor="bestOf">
                    <select
                      id="bestOf"
                      name="bestOf"
                      value={tournament.bestOf}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option>3 Sets</option>
                      <option>5 Sets</option>
                    </select>
                  </Field>

                  <Field label="Points Per Set" htmlFor="pointsPerSet">
                    <input
                      id="pointsPerSet"
                      type="number"
                      min="1"
                      name="pointsPerSet"
                      value={tournament.pointsPerSet}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <Field label="Final Set Points" htmlFor="finalSetPoints">
                    <input
                      id="finalSetPoints"
                      type="number"
                      min="1"
                      name="finalSetPoints"
                      value={tournament.finalSetPoints}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                sectionKey="description"
                title="Description & Rules"
                icon={Flag}
                description="Add context that players and organizers should know."
                isOpen={openSections.description}
                onToggle={toggleSection}
              >
                <div className="space-y-4">
                  <Field label="Tournament Description" htmlFor="description">
                    <textarea
                      id="description"
                      rows={5}
                      name="description"
                      value={tournament.description}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                      placeholder="Describe the event atmosphere, eligibility, and expectations."
                    />
                  </Field>

                  <Field label="Additional Rules" htmlFor="additionalRules">
                    <textarea
                      id="additionalRules"
                      rows={4}
                      name="additionalRules"
                      value={tournament.additionalRules}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                      placeholder="Add tie-breakers, roster notes, or court-specific rules."
                    />
                  </Field>
                </div>
              </FormSection>

              <section className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
                <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON}>
                  <Sparkles size={16} />
                  {isSubmitting ? "Saving..." : "Create Tournament"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveDraft}
                  className={SECONDARY_BUTTON}
                >
                  Save as Draft
                </button>
              </section>
            </form>
          </div>

          <aside className="space-y-6">
            <section className={`p-6 ${CARD_SHELL}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center ${INNER_CARD}`}>
                  <Eye size={18} className="text-inherit/80" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Quick Preview</h2>
                  <p className="text-sm text-inherit/55">How this setup is shaping up</p>
                </div>
              </div>

              <div className="space-y-3">
                <PreviewRow label="Name" value={tournament.name || "Untitled tournament"} />
                <PreviewRow label="Location" value={tournament.location || "No location yet"} />
                <PreviewRow label="Dates" value={formatDateRange(tournament.startDate, tournament.endDate)} />
                <PreviewRow label="Teams" value={tournament.maxTeams || "Not set"} />
                <PreviewRow label="Skill" value={tournament.skillLevel} />
                <PreviewRow label="Visibility" value={tournament.visibility} />
                <PreviewRow
                  label="Access"
                  value={
                    tournament.registrationMode === "invite-only"
                      ? "Invite only"
                      : "Approval required"
                  }
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
                  <p className="text-sm text-inherit/55">Keep the setup clean and consistent</p>
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
  const contentId = `create-tournament-section-${sectionKey}`;

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

function Field({ label, htmlFor, className = "", children }) {
  return (
    <div className={className}>
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

function shortenValue(value) {
  if (!value) return "TBA";
  if (value.length <= 18) return value;
  return `${value.slice(0, 18)}...`;
}

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return "Not scheduled";
  if (startDate && endDate) return `${startDate} to ${endDate}`;
  return startDate || endDate;
}
