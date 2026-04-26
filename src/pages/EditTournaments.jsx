import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const glassCard =
  "rounded-[1.4rem] sm:rounded-[1.6rem] border border-white/10 bg-white/70 shadow-[0_18px_45px_rgba(18,10,35,0.12)] backdrop-blur-xl dark:bg-white/5 dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]";
const inputClass =
  "w-full rounded-xl border border-white/20 bg-white/60 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#f0b4df] focus:ring-2 focus:ring-[#f0b4df] dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/35";
const labelClass =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";
const sectionTitleClass =
  "mb-4 text-xl font-black text-slate-900 dark:text-white";
const outlineBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#6B124B]/20 bg-white/55 px-5 py-3 text-sm font-bold text-slate-800 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/80 dark:border-white/10 dark:bg-white/6 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/12";
const primaryBtn =
  "inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:opacity-90 dark:bg-fuchsia-300 dark:text-slate-900";
const dangerBtn =
  "inline-flex items-center justify-center rounded-full border border-red-300/70 px-6 py-3 text-sm font-bold text-red-600 transition-all duration-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30";

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
      String(currentUser.id) === String(tournament.createdBy));

  if (isLoading) {
    return <main className="min-h-screen px-4 py-10">Loading tournament...</main>;
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className={`mx-auto max-w-3xl p-8 ${glassCard}`}>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Tournament Not Found
          </h1>
        </div>
      </main>
    );
  }

  if (!canEdit) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className={`mx-auto max-w-3xl p-8 ${glassCard}`}>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            You are not allowed to edit this tournament.
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
            Tournament Management
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
            Edit Tournament
          </h1>
        </header>

        {statusMessage && <p className="mb-6 rounded-[1.1rem] border border-[#f0b4df] bg-white/70 px-4 py-3 text-sm font-semibold text-brand-deep dark:bg-white/10 dark:text-fuchsia-200">{statusMessage}</p>}
        {errorMessage && <p className="mb-6 rounded-[1.1rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">{errorMessage}</p>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className={`lg:col-span-2 p-6 md:p-8 ${glassCard}`}>
            <form className="space-y-8" onSubmit={handleUpdate}>
              <fieldset>
                <legend className={sectionTitleClass}>Basic Information</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className={labelClass}>Tournament Name</label>
                    <input id="name" name="name" value={tournament.name} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="location" className={labelClass}>Location</label>
                    <input id="location" name="location" value={tournament.location} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="venue" className={labelClass}>Venue</label>
                    <input id="venue" name="venue" value={tournament.venue} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="startDate" className={labelClass}>Start Date</label>
                    <input id="startDate" type="date" name="startDate" value={tournament.startDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="endDate" className={labelClass}>End Date</label>
                    <input id="endDate" type="date" name="endDate" value={tournament.endDate} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className={sectionTitleClass}>Tournament Settings</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="format" className={labelClass}>Tournament Format</label>
                    <select id="format" name="format" value={tournament.format} onChange={handleChange} className={inputClass}>
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Round Robin</option>
                      <option>Group Stage + Knockout</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="volleyballType" className={labelClass}>Volleyball Type</label>
                    <select id="volleyballType" name="volleyballType" value={tournament.volleyballType} onChange={handleChange} className={inputClass}>
                      <option>Indoor</option>
                      <option>Beach</option>
                      <option>Grass</option>
                      <option>Snow</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxTeams" className={labelClass}>Max Teams</label>
                    <input id="maxTeams" type="number" min="2" name="maxTeams" value={tournament.maxTeams} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="skillLevel" className={labelClass}>Skill Level</label>
                    <select id="skillLevel" name="skillLevel" value={tournament.skillLevel} onChange={handleChange} className={inputClass}>
                      <option>Open</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>University</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="genderCategory" className={labelClass}>Gender Category</label>
                    <select id="genderCategory" name="genderCategory" value={tournament.genderCategory} onChange={handleChange} className={inputClass}>
                      <option>Men</option>
                      <option>Women</option>
                      <option>Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className={labelClass}>Status</label>
                    <select id="status" name="status" value={tournament.status} onChange={handleChange} className={inputClass}>
                      <option value="draft">Draft</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className={sectionTitleClass}>Description & Rules</legend>
                <div className="space-y-4">
                  <textarea rows={5} name="description" value={tournament.description} onChange={handleChange} className={inputClass} />
                  <textarea rows={4} name="additionalRules" value={tournament.additionalRules} onChange={handleChange} className={inputClass} />
                </div>
              </fieldset>

              <section className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="submit" disabled={isSubmitting} className={primaryBtn}>
                  {isSubmitting ? "Saving..." : "Update Tournament"}
                </button>
                <button type="button" onClick={handleDelete} className={dangerBtn}>
                  Delete Tournament
                </button>
                <button type="button" onClick={() => navigate("/tournaments")} className={outlineBtn}>
                  Back to Tournaments
                </button>
              </section>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
