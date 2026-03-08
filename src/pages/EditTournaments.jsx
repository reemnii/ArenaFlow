import { useEffect, useState } from "react";

export default function EditTournament() {
  const [tournament, setTournament] = useState({
    name: "",
    location: "",
    venue: "",
    startDate: "",
    endDate: "",
    format: "Single Elimination",
    maxTeams: "",
    skillLevel: "Open",
    genderCategory: "Men",
    bestOf: "3 Sets",
    pointsPerSet: "25",
    finalSetPoints: "15",
    description: "",
    additionalRules: ""
  });

  useEffect(() => {
    const savedTournament = localStorage.getItem("createdTournament");
    if (savedTournament) {
      setTournament(JSON.parse(savedTournament));
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
    setTournament({
      name: "",
      location: "",
      venue: "",
      startDate: "",
      endDate: "",
      format: "Single Elimination",
      maxTeams: "",
      skillLevel: "Open",
      genderCategory: "Men",
      bestOf: "3 Sets",
      pointsPerSet: "25",
      finalSetPoints: "15",
      description: "",
      additionalRules: ""
    });
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

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
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
      </div>
    </div>
  );
}
