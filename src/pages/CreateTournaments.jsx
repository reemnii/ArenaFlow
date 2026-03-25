import { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultTournament = {
  id: "",
  name: "",
  location: "",
  venue: "",
  startDate: "",
  endDate: "",
  format: "Single Elimination",
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

export default function CreateTournament() {
  const [tournament, setTournament] = useState(defaultTournament);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournament((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];

    const newTournament = {
      ...tournament,
      id: Date.now().toString(),
      status: "Published",
    };

    const updatedTournaments = [...savedTournaments, newTournament];

    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
    localStorage.setItem("selectedTournamentId", newTournament.id);

    setStatusMessage("Tournament created successfully.");

    setTimeout(() => {
      navigate(`/edit/${newTournament.id}`);
    }, 600);
  };

  const handleSaveDraft = () => {
    const savedTournaments =
      JSON.parse(localStorage.getItem("tournaments")) || [];

    const draftTournament = {
      ...tournament,
      id: Date.now().toString(),
      status: "Draft",
    };

    const updatedTournaments = [...savedTournaments, draftTournament];

    localStorage.setItem("tournaments", JSON.stringify(updatedTournaments));
    localStorage.setItem("selectedTournamentId", draftTournament.id);

    setStatusMessage("Tournament draft saved.");

    setTimeout(() => {
      navigate(`/edit/${draftTournament.id}`);
    }, 600);
  };

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4"
      aria-labelledby="create-tournament-title"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1
            id="create-tournament-title"
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white"
          >
            Create Tournament
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Set up a volleyball tournament, manage teams, and publish all the
            key details in one place.
          </p>
        </header>

        {statusMessage && (
          <p
            role="status"
            aria-live="polite"
            className="mb-6 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
          >
            {statusMessage}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <fieldset>
                <legend className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Basic Information
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="venue"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Venue
                    </label>
                    <input
                      id="venue"
                      type="text"
                      name="venue"
                      value={tournament.venue}
                      onChange={handleChange}
                      placeholder="Main indoor court"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      name="startDate"
                      value={tournament.startDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      name="endDate"
                      value={tournament.endDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Tournament Settings
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="format"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Tournament Format
                    </label>
                    <select
                      id="format"
                      name="format"
                      value={tournament.format}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Round Robin</option>
                      <option>Group Stage + Knockout</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="maxTeams"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skillLevel"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Skill Level
                    </label>
                    <select
                      id="skillLevel"
                      name="skillLevel"
                      value={tournament.skillLevel}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>Open</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>University</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="genderCategory"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Gender Category
                    </label>
                    <select
                      id="genderCategory"
                      name="genderCategory"
                      value={tournament.genderCategory}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>Men</option>
                      <option>Women</option>
                      <option>Mixed</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="visibility"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Tournament Visibility
                    </label>
                    <select
                      id="visibility"
                      name="visibility"
                      value={tournament.visibility}
                      onChange={handleChange}
                      aria-describedby="visibility-help"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                    <p
                      id="visibility-help"
                      className="mt-2 text-sm text-slate-500 dark:text-slate-400"
                    >
                      {tournament.visibility === "Public"
                        ? "Anyone can view and join this tournament."
                        : "This tournament is invite-only. Only approved teams can join."}
                    </p>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Match Rules
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="bestOf"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Best Of
                    </label>
                    <select
                      id="bestOf"
                      name="bestOf"
                      value={tournament.bestOf}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>3 Sets</option>
                      <option>5 Sets</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="pointsPerSet"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="finalSetPoints"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  Description & Rules
                </legend>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Tournament Description
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      name="description"
                      value={tournament.description}
                      onChange={handleChange}
                      placeholder="Write a short description about the tournament, eligibility, and what teams should expect..."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="additionalRules"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Additional Rules
                    </label>
                    <textarea
                      id="additionalRules"
                      rows={4}
                      name="additionalRules"
                      value={tournament.additionalRules}
                      onChange={handleChange}
                      placeholder="Add registration rules, lineup requirements, tie-break rules, etc."
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </fieldset>

              <section
                className="flex flex-col sm:flex-row gap-3 pt-2"
                aria-label="Tournament creation actions"
              >
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition"
                >
                  Create Tournament
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Save as Draft
                </button>
              </section>
            </form>
          </div>

          <aside
            className="space-y-6"
            aria-label="Tournament creation help and preview"
          >
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Quick Tips
              </h2>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li>• Choose a clear format before teams register.</li>
                <li>• Add full venue details so players can find the court easily.</li>
                <li>• Mention roster limits and eligibility rules.</li>
                <li>• Keep match settings consistent across the tournament.</li>
              </ul>
            </section>

            <section className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">Preview</h2>
              <div className="space-y-2 text-sm text-slate-200">
                <p>
                  <span className="text-white font-medium">Status:</span>{" "}
                  {tournament.status || "Draft"}
                </p>
                <p>
                  <span className="text-white font-medium">Visibility:</span>{" "}
                  {tournament.visibility}
                </p>
                <p>
                  <span className="text-white font-medium">Registration:</span>{" "}
                  {tournament.visibility === "Public"
                    ? "Open to everyone"
                    : "Invite only"}
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-white/10 p-4 text-sm text-slate-200">
                {tournament.visibility === "Public"
                  ? "Once published, any team will be able to view the tournament page, register, and follow matches and stats."
                  : "Once published, only invited teams will be able to access registration and participate in the tournament."}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
