import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const defaultTournament = {
  id: "",
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
  status: "Published",
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
  "inline-flex items-center justify-center gap-2 rounded-full cursor-pointer border border-[#6B124B]/20 dark:border-white/10 bg-white/55 dark:bg-white/6 px-5 py-3 text-sm font-bold text-slate-800 dark:text-white backdrop-blur-md transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/12 hover:border-white/30 dark:hover:border-white/20";

const primaryBtn =
  "inline-flex items-center justify-center rounded-full bg-brand dark:bg-fuchsia-300 px-6 py-3 text-sm font-bold text-white dark:text-slate-900 transition-all duration-300 hover:opacity-90";

const dangerBtn =
  "inline-flex items-center justify-center rounded-full border border-red-300/70 dark:border-red-800 px-6 py-3 text-sm font-bold text-red-600 dark:text-red-400 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-950/30";

export default function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(defaultTournament);
  const [notFound, setNotFound] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const savedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];

    const foundTournament = savedTournaments.find(
      (t) => String(t.id) === String(id)
    );

    if (foundTournament) {
      setTournament({
        ...defaultTournament,
        ...foundTournament,
      });
      localStorage.setItem("selectedTournamentId", foundTournament.id);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournament((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const savedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];

    const updatedTournaments = savedTournaments.map((t) =>
      String(t.id) === String(id) ? { ...tournament, id } : t
    );

    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
    localStorage.setItem("selectedTournamentId", id);
    setStatusMessage("Tournament updated successfully.");
  };

  const handleDelete = () => {
    const savedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];

    const filteredTournaments = savedTournaments.filter(
      (t) => String(t.id) !== String(id)
    );

    localStorage.setItem("tournaments", JSON.stringify(filteredTournaments));
    localStorage.removeItem("selectedTournamentId");
    navigate("/tournaments");
  };

  if (notFound) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10">
        <div className={`mx-auto max-w-3xl p-8 ${glassCard}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
            Edit Tournament
          </p>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            Tournament Not Found
          </h1>
          <p role="alert" className="mt-3 text-slate-600 dark:text-white/68">
            No tournament was found for this edit page.
          </p>
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
            Tournament Management
          </p>
          <h1
            id="edit-tournament-title"
            className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
          >
            Edit Tournament
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base">
            Edit the tournament details below and keep your event information up
            to date.
          </p>
        </header>

        {statusMessage && (
          <p
            role="status"
            aria-live="polite"
            className="mb-6 rounded-[1.1rem] border border-[#f0b4df] bg-white/70 px-4 py-3 text-sm font-semibold text-[#6B124B] backdrop-blur-md dark:bg-white/10 dark:text-fuchsia-200"
          >
            {statusMessage}
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className={`lg:col-span-2 p-6 md:p-8 ${glassCard}`}>
            <form className="space-y-8" onSubmit={handleUpdate}>
              <fieldset>
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
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
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

              <fieldset>
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
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className={sectionTitleClass}>Description & Rules</legend>

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
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              <section
                className="flex flex-col gap-3 pt-2 sm:flex-row"
                aria-label="Tournament actions"
              >
                <button type="submit" className={primaryBtn}>
                  Update Tournament
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  aria-label={`Delete ${tournament.name || "this tournament"}`}
                  className={dangerBtn}
                >
                  Delete Tournament
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/tournaments")}
                  className={outlineBtn}
                >
                  Back to Tournaments
                </button>
              </section>
            </form>
          </div>

          <aside
            className="space-y-6"
            aria-label="Tournament preview and access information"
          >
            <section className={`${glassCard} p-6`}>
              <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
                Current Preview
              </h2>
              <div className="space-y-2 text-sm leading-7 text-slate-600 dark:text-white/68">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Name:
                  </span>{" "}
                  {tournament.name || "Untitled Tournament"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Type:
                  </span>{" "}
                  {tournament.volleyballType}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Visibility:
                  </span>{" "}
                  {tournament.visibility}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Registration:
                  </span>{" "}
                  {tournament.visibility === "Public"
                    ? "Open to everyone"
                    : "Invite only"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Status:
                  </span>{" "}
                  {tournament.status}
                </p>
              </div>
            </section>

            <section className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,#341248,#4d1e61,#1b1025)] p-6 text-white shadow-[0_18px_45px_rgba(18,10,35,0.22)]">
              <h2 className="mb-3 text-lg font-black">Access Info</h2>
              <div className="text-sm leading-7 text-white/85">
                {tournament.visibility === "Public"
                  ? `This ${tournament.volleyballType.toLowerCase()} tournament is visible to all users and any team can register.`
                  : `This ${tournament.volleyballType.toLowerCase()} tournament is private and only invited teams can participate.`}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
