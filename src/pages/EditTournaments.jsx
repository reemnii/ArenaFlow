import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTournamentById, updateTournament } from "../services/api";

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
  status: "Draft",
};

const glassCard =
  "rounded-[1.4rem] sm:rounded-[1.6rem] border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-[0_18px_45px_rgba(18,10,35,0.12)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]";

const inputClass =
  "w-full rounded-xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/20 text-slate-900 dark:text-white px-4 py-3 outline-none placeholder:text-slate-400 dark:placeholder:text-white/35 focus:ring-2 focus:ring-[#f0b4df] focus:border-[#f0b4df] transition";

const labelClass =
  "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2";

const sectionTitleClass =
  "text-xl font-black text-slate-900 dark:text-white mb-4";

const outlineBtn =
  "inline-flex items-center justify-center gap-2 rounded-full cursor-pointer border border-[#6B124B]/20 dark:border-white/10 bg-white/55 dark:bg-white/6 px-5 py-3 text-sm font-bold text-slate-800 dark:text-white backdrop-blur-md transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/12";

const primaryBtn =
  "inline-flex items-center justify-center rounded-full bg-brand dark:bg-fuchsia-300 px-6 py-3 text-sm font-bold text-white dark:text-slate-900 transition-all duration-300 hover:opacity-90";

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
};

export default function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(defaultTournament);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true);
      setStatusMessage("");
      setErrorMessage("");

      try {
        const data = await getTournamentById(id);

        setTournament({
          name: data.name || "",
          location: data.location || "",
          venue: data.venue || "",
          startDate: formatDateForInput(data.startDate),
          endDate: formatDateForInput(data.endDate),
          format: data.format || "Single Elimination",
          volleyballType: data.volleyballType || "Indoor",
          maxTeams: data.maxTeams || "",
          skillLevel: data.skillLevel || "Open",
          genderCategory: data.genderCategory || "Men",
          visibility: data.visibility || "Public",
          bestOf: data.bestOf || "3 Sets",
          pointsPerSet: data.pointsPerSet || "25",
          finalSetPoints: data.finalSetPoints || "15",
          description: data.description || "",
          additionalRules: data.additionalRules || "",
          status: data.status || "Draft",
        });
      } catch (err) {
        setErrorMessage(err.message || "Failed to load tournament.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTournament((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildPayload = (status) => {
    return {
      ...tournament,
      maxTeams: Number(tournament.maxTeams) || 0,
      pointsPerSet: Number(tournament.pointsPerSet) || 25,
      finalSetPoints: Number(tournament.finalSetPoints) || 15,
      status,
    };
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      await updateTournament(id, buildPayload("Published"));
      setStatusMessage("Tournament updated successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to update tournament.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      await updateTournament(id, buildPayload("Draft"));
      setStatusMessage("Draft saved successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-700 dark:text-white">Loading tournament...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10"
      aria-labelledby="edit-tournament-title"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
            Tournament Editor
          </p>

          <h1
            id="edit-tournament-title"
            className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
          >
            Edit Tournament
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base">
            Update tournament details, rules, visibility, and match settings.
          </p>
        </header>

        {statusMessage && (
          <p className="mb-6 rounded-[1.1rem] border border-[#f0b4df] bg-white/70 px-4 py-3 text-sm font-semibold text-[#6B124B] backdrop-blur-md dark:bg-white/10 dark:text-fuchsia-200">
            {statusMessage}
          </p>
        )}

        {errorMessage && (
          <p className="mb-6 rounded-[1.1rem] border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 backdrop-blur-md dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className={`lg:col-span-2 p-6 md:p-8 ${glassCard}`}>
            <form className="space-y-8" onSubmit={handleUpdate}>
              <fieldset disabled={saving}>
                <legend className={sectionTitleClass}>Basic Information</legend>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className={labelClass}>
                      Tournament Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={tournament.name}
                      onChange={handleChange}
                      placeholder="e.g. Beirut Summer Volleyball Cup"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={tournament.location}
                      onChange={handleChange}
                      placeholder="Beirut, Lebanon"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="venue" className={labelClass}>
                      Venue
                    </label>
                    <input
                      id="venue"
                      type="text"
                      name="venue"
                      value={tournament.venue}
                      onChange={handleChange}
                      placeholder="Gym, court, beach, grass field, or snow venue"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="startDate" className={labelClass}>
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      name="startDate"
                      value={tournament.startDate}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className={labelClass}>
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      name="endDate"
                      value={tournament.endDate}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset disabled={saving}>
                <legend className={sectionTitleClass}>Tournament Settings</legend>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="format" className={labelClass}>
                      Tournament Format
                    </label>
                    <select
                      id="format"
                      name="format"
                      value={tournament.format}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Round Robin</option>
                      <option>Group Stage + Knockout</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="volleyballType" className={labelClass}>
                      Volleyball Type
                    </label>
                    <select
                      id="volleyballType"
                      name="volleyballType"
                      value={tournament.volleyballType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option>Indoor</option>
                      <option>Beach</option>
                      <option>Grass</option>
                      <option>Snow</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="maxTeams" className={labelClass}>
                      Max Teams
                    </label>
                    <input
                      id="maxTeams"
                      type="number"
                      name="maxTeams"
                      value={tournament.maxTeams}
                      onChange={handleChange}
                      placeholder="16"
                      min="1"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="skillLevel" className={labelClass}>
                      Skill Level
                    </label>
                    <select
                      id="skillLevel"
                      name="skillLevel"
                      value={tournament.skillLevel}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option>Open</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>University</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="genderCategory" className={labelClass}>
                      Gender Category
                    </label>
                    <select
                      id="genderCategory"
                      name="genderCategory"
                      value={tournament.genderCategory}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option>Men</option>
                      <option>Women</option>
                      <option>Mixed</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="visibility" className={labelClass}>
                      Tournament Visibility
                    </label>
                    <select
                      id="visibility"
                      name="visibility"
                      value={tournament.visibility}
                      onChange={handleChange}
                      aria-describedby="visibility-help"
                      className={inputClass}
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>

                    <p
                      id="visibility-help"
                      className="mt-2 text-sm text-slate-500 dark:text-white/50"
                    >
                      {tournament.visibility === "Public"
                        ? "Anyone can view and join this tournament."
                        : "This tournament is invite-only. Only approved teams can join."}
                    </p>
                  </div>
                </div>
              </fieldset>

              <fieldset disabled={saving}>
                <legend className={sectionTitleClass}>Match Rules</legend>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor="bestOf" className={labelClass}>
                      Best Of
                    </label>
                    <select
                      id="bestOf"
                      name="bestOf"
                      value={tournament.bestOf}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option>3 Sets</option>
                      <option>5 Sets</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pointsPerSet" className={labelClass}>
                      Points Per Set
                    </label>
                    <input
                      id="pointsPerSet"
                      type="number"
                      name="pointsPerSet"
                      value={tournament.pointsPerSet}
                      onChange={handleChange}
                      placeholder="25"
                      min="1"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="finalSetPoints" className={labelClass}>
                      Final Set Points
                    </label>
                    <input
                      id="finalSetPoints"
                      type="number"
                      name="finalSetPoints"
                      value={tournament.finalSetPoints}
                      onChange={handleChange}
                      placeholder="15"
                      min="1"
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset disabled={saving}>
                <legend className={sectionTitleClass}>
                  Description & Rules
                </legend>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="description" className={labelClass}>
                      Tournament Description
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      name="description"
                      value={tournament.description}
                      onChange={handleChange}
                      placeholder="Write a short description about the tournament..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="additionalRules" className={labelClass}>
                      Additional Rules
                    </label>
                    <textarea
                      id="additionalRules"
                      rows={4}
                      name="additionalRules"
                      value={tournament.additionalRules}
                      onChange={handleChange}
                      placeholder="Add registration rules, lineup requirements, tie-break rules, etc."
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              <section className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button type="submit" className={primaryBtn} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className={outlineBtn}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save as Draft"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/tournaments")}
                  className={outlineBtn}
                  disabled={saving}
                >
                  Back to Tournaments
                </button>
              </section>
            </form>
          </div>

          <aside className="space-y-6">
            <section className={`${glassCard} p-6`}>
              <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
                Editing Tips
              </h2>

              <ul className="space-y-3 text-sm leading-7 text-slate-600 dark:text-white/68">
                <li>• Review the tournament format before saving.</li>
                <li>• Make sure start and end dates are correct.</li>
                <li>• Update rules before teams register.</li>
                <li>• Keep visibility correct for public/private events.</li>
              </ul>
            </section>

            <section className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,#341248,#4d1e61,#1b1025)] p-6 text-white shadow-[0_18px_45px_rgba(18,10,35,0.22)]">
              <h2 className="mb-3 text-lg font-black">Preview</h2>

              <div className="space-y-2 text-sm text-white/85">
                <p>
                  <span className="font-semibold text-white">Status:</span>{" "}
                  {tournament.status}
                </p>

                <p>
                  <span className="font-semibold text-white">Type:</span>{" "}
                  {tournament.volleyballType}
                </p>

                <p>
                  <span className="font-semibold text-white">Visibility:</span>{" "}
                  {tournament.visibility}
                </p>

                <p>
                  <span className="font-semibold text-white">Format:</span>{" "}
                  {tournament.format}
                </p>

                <p>
                  <span className="font-semibold text-white">Teams:</span>{" "}
                  {tournament.maxTeams || "Not set"}
                </p>
              </div>

              <div className="mt-4 rounded-[1rem] border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85 backdrop-blur-md">
                {tournament.visibility === "Public"
                  ? `This ${tournament.volleyballType.toLowerCase()} tournament is visible to all teams.`
                  : `This ${tournament.volleyballType.toLowerCase()} tournament is invite-only.`}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
