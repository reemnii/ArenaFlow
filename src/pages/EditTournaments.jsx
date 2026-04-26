import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Trash2,
  Trophy,
  Volleyball,
} from "lucide-react";
import { apiFetch, normalizeTournament } from "../utils/api";
import { getCurrentUser } from "../utils/auth";
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
  bestOf: "3 Sets",
  pointsPerSet: "25",
  finalSetPoints: "15",
  description: "",
  additionalRules: "",
  status: "upcoming",
};

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
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-3 font-semibold text-red-100 transition hover:bg-red-500/15";

const tips = [
  "Update status as the tournament moves from draft to live play.",
  "Keep dates and venue current so teams see accurate details.",
  "Review match settings before publishing changes to participants.",
  "Use the description area for organizer notes and special rules.",
];

export default function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [tournament, setTournament] = useState(defaultTournament);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    basic: true,
    settings: false,
    rules: false,
    description: false,
  });

  useEffect(() => {
    async function loadTournament() {
      setIsLoading(true);

      try {
        const data = normalizeTournament(await apiFetch(`/api/tournaments/${id}`));
        setTournament({
          ...defaultTournament,
          ...data,
          volleyballType: data.volleyballType || data.type || "Indoor",
          startDate: data.startDate ? data.startDate.slice(0, 10) : "",
          endDate: data.endDate ? data.endDate.slice(0, 10) : "",
          maxTeams: data.maxTeams || "",
          pointsPerSet: data.pointsPerSet || "25",
          finalSetPoints: data.finalSetPoints || "15",
        });
      } catch (requestError) {
        if (requestError.status === 404) {
          setNotFound(true);
        } else {
          setErrorMessage(requestError.message || "Unable to load tournament.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTournament();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setTournament((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function toggleSection(sectionKey) {
    setOpenSections((previous) => ({
      ...previous,
      [sectionKey]: !previous[sectionKey],
    }));
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      await apiFetch(`/api/tournaments/${id}`, {
        method: "PUT",
        auth: true,
        body: toTournamentPayload(tournament, tournament.status || "upcoming"),
      });

      setStatusMessage("Tournament updated successfully.");
    } catch (requestError) {
      const validationMessage = Array.isArray(requestError.details?.errors)
        ? requestError.details.errors[0]
        : requestError.message;
      setErrorMessage(validationMessage || "Unable to update tournament.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this tournament?")) {
      return;
    }

    try {
      await apiFetch(`/api/tournaments/${id}`, {
        method: "DELETE",
        auth: true,
      });
      navigate("/tournaments");
    } catch (requestError) {
      setErrorMessage(requestError.message || "Unable to delete tournament.");
    }
  }

  const canEdit =
    currentUser &&
    (currentUser.role === "admin" ||
      currentUser.role === "manager" ||
      currentUser.role === "coach" ||
      String(currentUser.id) === String(tournament.createdBy));

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8 text-inherit sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className={`p-8 text-center ${CARD_SHELL}`}>Loading tournament...</div>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen px-4 py-8 text-inherit sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className={`p-8 text-center ${CARD_SHELL}`}>
            <h1 className="text-2xl font-bold">Tournament Not Found</h1>
          </div>
        </div>
      </main>
    );
  }

  if (!canEdit) {
    return (
      <main className="min-h-screen px-4 py-8 text-inherit sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className={`p-8 text-center ${CARD_SHELL}`}>
            <h1 className="text-2xl font-bold">
              You are not allowed to edit this tournament.
            </h1>
          </div>
        </div>
      </main>
    );
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
                Edit Tournament
              </h1>
              <p className="max-w-2xl text-inherit/70">
                Update tournament settings, visibility, and details using the
                same interface style as the rest of the platform.
              </p>
            </div>

            <div className={`grid grid-cols-2 gap-3 p-3 sm:min-w-[300px] ${INNER_CARD}`}>
              <HeroStat icon={Volleyball} label="Type" value={tournament.volleyballType} />
              <HeroStat
                icon={CalendarDays}
                label="Start"
                value={tournament.startDate || "TBA"}
              />
              <HeroStat icon={Shield} label="Category" value={tournament.genderCategory} />
              <HeroStat icon={Trophy} label="Status" value={capitalize(tournament.status)} />
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
            <form className="space-y-8" onSubmit={handleUpdate}>
              <FormSection
                sectionKey="basic"
                title="Basic Information"
                icon={MapPin}
                description="Keep the core tournament identity and schedule accurate."
                isOpen={openSections.basic}
                onToggle={toggleSection}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Tournament Name" htmlFor="name" className="md:col-span-2">
                    <input
                      id="name"
                      name="name"
                      value={tournament.name}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Location" htmlFor="location">
                    <input
                      id="location"
                      name="location"
                      value={tournament.location}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Venue" htmlFor="venue">
                    <input
                      id="venue"
                      name="venue"
                      value={tournament.venue}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Start Date" htmlFor="startDate">
                    <input
                      id="startDate"
                      type="date"
                      name="startDate"
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
                description="Adjust structure, category, and visibility."
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
                  <Field label="Visibility" htmlFor="visibility">
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
                  <Field label="Status" htmlFor="status">
                    <select
                      id="status"
                      name="status"
                      value={tournament.status}
                      onChange={handleChange}
                      className={SELECT_CLASS}
                    >
                      <option value="draft">Draft</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </Field>
                </div>
              </FormSection>

              <FormSection
                sectionKey="rules"
                title="Match Rules"
                icon={ClipboardList}
                description="Keep scoring and match settings consistent."
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
                description="Update the participant-facing details and organizer notes."
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
                    />
                  </Field>
                </div>
              </FormSection>

              <section className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
                <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON}>
                  <Sparkles size={16} />
                  {isSubmitting ? "Saving..." : "Update Tournament"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/tournaments")}
                  className={SECONDARY_BUTTON}
                >
                  Back to Tournaments
                </button>
                <button type="button" onClick={handleDelete} className={DANGER_BUTTON}>
                  <Trash2 size={16} />
                  Delete Tournament
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
                  <p className="text-sm text-inherit/55">A fast summary of the current setup</p>
                </div>
              </div>

              <div className="space-y-3">
                <PreviewRow label="Name" value={tournament.name || "Untitled tournament"} />
                <PreviewRow label="Location" value={tournament.location || "No location yet"} />
                <PreviewRow
                  label="Dates"
                  value={formatDateRange(tournament.startDate, tournament.endDate)}
                />
                <PreviewRow label="Teams" value={tournament.maxTeams || "Not set"} />
                <PreviewRow label="Skill" value={tournament.skillLevel} />
                <PreviewRow label="Visibility" value={tournament.visibility} />
                <PreviewRow label="Status" value={capitalize(tournament.status)} />
              </div>
            </section>

            <section className={`p-6 ${CARD_SHELL}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center ${INNER_CARD}`}>
                  <Volleyball size={18} className="text-inherit/80" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Quick Tips</h2>
                  <p className="text-sm text-inherit/55">Helpful reminders while editing</p>
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
  const contentId = `edit-tournament-section-${sectionKey}`;

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

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return "Not scheduled";
  if (startDate && endDate) return `${startDate} to ${endDate}`;
  return startDate || endDate;
}

function capitalize(value) {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
