import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTournament } from "../services/api";

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

export default function CreateTournament() {
  const [tournament, setTournament] = useState(defaultTournament);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const res = await createTournament(buildPayload("Published"));

      const id = res._id || res.id;

      setStatusMessage("Tournament created successfully.");
      setTournament(defaultTournament);

      if (id) {
        setTimeout(() => {
          navigate(`/edit/${id}`);
        }, 600);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to create tournament.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const res = await createTournament(buildPayload("Draft"));

      const id = res._id || res.id;

      setStatusMessage("Draft saved.");
      setTournament(defaultTournament);

      if (id) {
        setTimeout(() => {
          navigate(`/edit/${id}`);
        }, 600);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save draft.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black mb-6">Create Tournament</h1>

        {statusMessage && <p className="mb-4 text-green-600">{statusMessage}</p>}
        {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}

        <div className={`p-6 ${glassCard}`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>Tournament Name</label>
              <input
                name="name"
                value={tournament.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <input
                name="location"
                value={tournament.location}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Venue</label>
              <input
                name="venue"
                value={tournament.venue}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={tournament.startDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="date"
                name="endDate"
                value={tournament.endDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Max Teams</label>
              <input
                type="number"
                name="maxTeams"
                value={tournament.maxTeams}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={tournament.description}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className={primaryBtn} disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className={outlineBtn}
                disabled={loading}
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
