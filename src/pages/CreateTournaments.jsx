import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
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

export default function CreateTournament() {
  const [tournament, setTournament] = useState(defaultTournament);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setTournament((previous) => ({
      ...previous,
      [name]: value,
    }));
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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
            Tournament Setup
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
            Create Tournament
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base">
            Set up a volleyball tournament and publish it directly to the backend.
          </p>
        </header>

        {statusMessage && (
          <p className="mb-6 rounded-[1.1rem] border border-[#f0b4df] bg-white/70 px-4 py-3 text-sm font-semibold text-[#6B124B] backdrop-blur-md dark:bg-white/10 dark:text-fuchsia-200">
            {statusMessage}
          </p>
        )}

        {errorMessage && (
          <p className="mb-6 rounded-[1.1rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className={`lg:col-span-2 p-6 md:p-8 ${glassCard}`}>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <fieldset>
                <legend className={sectionTitleClass}>Basic Information</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className={labelClass}>
                      Tournament Name
                    </label>
                    <input id="name" name="name" required value={tournament.name} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="location" className={labelClass}>
                      Location
                    </label>
                    <input id="location" name="location" required value={tournament.location} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="venue" className={labelClass}>
                      Venue
                    </label>
                    <input id="venue" name="venue" value={tournament.venue} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="startDate" className={labelClass}>
                      Start Date
                    </label>
                    <input id="startDate" type="date" name="startDate" required value={tournament.startDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="endDate" className={labelClass}>
                      End Date
                    </label>
                    <input id="endDate" type="date" name="endDate" required value={tournament.endDate} onChange={handleChange} className={inputClass} />
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
                  <div className="md:col-span-2">
                    <label htmlFor="visibility" className={labelClass}>Tournament Visibility</label>
                    <select id="visibility" name="visibility" value={tournament.visibility} onChange={handleChange} className={inputClass}>
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className={sectionTitleClass}>Match Rules</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor="bestOf" className={labelClass}>Best Of</label>
                    <select id="bestOf" name="bestOf" value={tournament.bestOf} onChange={handleChange} className={inputClass}>
                      <option>3 Sets</option>
                      <option>5 Sets</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pointsPerSet" className={labelClass}>Points Per Set</label>
                    <input id="pointsPerSet" type="number" min="1" name="pointsPerSet" value={tournament.pointsPerSet} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="finalSetPoints" className={labelClass}>Final Set Points</label>
                    <input id="finalSetPoints" type="number" min="1" name="finalSetPoints" value={tournament.finalSetPoints} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className={sectionTitleClass}>Description & Rules</legend>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="description" className={labelClass}>Tournament Description</label>
                    <textarea id="description" rows={5} name="description" value={tournament.description} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="additionalRules" className={labelClass}>Additional Rules</label>
                    <textarea id="additionalRules" rows={4} name="additionalRules" value={tournament.additionalRules} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </fieldset>

              <section className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="submit" disabled={isSubmitting} className={primaryBtn}>
                  {isSubmitting ? "Saving..." : "Create Tournament"}
                </button>
                <button type="button" disabled={isSubmitting} onClick={handleSaveDraft} className={outlineBtn}>
                  Save as Draft
                </button>
              </section>
            </form>
          </div>

          <aside className="space-y-6">
            <section className={`${glassCard} p-6`}>
              <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">Quick Tips</h2>
              <ul className="space-y-3 text-sm leading-7 text-slate-600 dark:text-white/68">
                <li>• Choose a clear format before teams register.</li>
                <li>• Match the venue to the volleyball type you selected.</li>
                <li>• Mention roster limits and eligibility rules.</li>
                <li>• Keep match settings consistent across the tournament.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
