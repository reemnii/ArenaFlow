import { useEffect, useState } from "react";

const defaultTournament = {
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
  additionalRules: ""
};

export default function EditTournament() {
  const [tournament, setTournament] = useState(defaultTournament);

  useEffect(() => {
    const savedTournament = localStorage.getItem("createdTournament");
    if (savedTournament) {
      const parsedTournament = JSON.parse(savedTournament);
      setTournament({
        ...defaultTournament,
        ...parsedTournament
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournament((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem("createdTournament", JSON.stringify(tournament));
    alert("Tournament updated successfully.");
  };

  const handleDelete = () => {
    localStorage.removeItem("createdTournament");
    alert("Tournament deleted.");
    setTournament(defaultTournament);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Edit Tournament
          </h1>
          <p className="mt-2 text-slate-600">
            Edit the tournament you created earlier. This page automatically
            loads the saved tournament data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <form className="space-y-8" onSubmit={handleUpdate}>
              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tournament Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={tournament.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={tournament.location}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Venue
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={tournament.venue}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={tournament.startDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={tournament.endDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Tournament Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tournament Format
                    </label>
                    <select
                      name="format"
                      value={tournament.format}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Round Robin</option>
                      <option>Group Stage + Knockout</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Max Teams
                    </label>
                    <input
                      type="number"
                      name="maxTeams"
                      value={tournament.maxTeams}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Skill Level
                    </label>
                    <select
                      name="skillLevel"
                      value={tournament.skillLevel}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>Open</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>University</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender Category
                    </label>
                    <select
                      name="genderCategory"
                      value={tournament.genderCategory}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>Men</option>
                      <option>Women</option>
                      <option>Mixed</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tournament Visibility
                    </label>
                    <select
                      name="visibility"
                      value={tournament.visibility}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                    <p className="mt-2 text-sm text-slate-500">
                      {tournament.visibility === "Public"
                        ? "Anyone can view and join this tournament."
                        : "This tournament is invite-only. Only approved teams can join."}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Match Rules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Best Of
                    </label>
                    <select
                      name="bestOf"
                      value={tournament.bestOf}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option>3 Sets</option>
                      <option>5 Sets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Points Per Set
                    </label>
                    <input
                      type="number"
                      name="pointsPerSet"
                      value={tournament.pointsPerSet}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Final Set Points
                    </label>
                    <input
                      type="number"
                      name="finalSetPoints"
                      value={tournament.finalSetPoints}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Description & Rules
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tournament Description
                    </label>
                    <textarea
                      rows={5}
                      name="description"
                      value={tournament.description}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Rules
                    </label>
                    <textarea
                      rows={4}
                      name="additionalRules"
                      value={tournament.additionalRules}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>
              </section>

              <section className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 text-white px-6 py-3 font-medium hover:bg-slate-800 transition"
                >
                  Update Tournament
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl border border-red-300 text-red-600 px-6 py-3 font-medium hover:bg-red-50 transition"
                >
                  Delete Tournament
                </button>
              </section>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Current Preview
              </h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Name:</span>{" "}
                  {tournament.name || "Untitled Tournament"}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Visibility:</span>{" "}
                  {tournament.visibility}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Registration:</span>{" "}
                  {tournament.visibility === "Public"
                    ? "Open to everyone"
                    : "Invite only"}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">Access Info</h3>
              <div className="text-sm text-slate-200">
                {tournament.visibility === "Public"
                  ? "This tournament is visible to all users and any team can register."
                  : "This tournament is private and only invited teams can participate."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
