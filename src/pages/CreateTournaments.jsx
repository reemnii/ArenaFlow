import { useState } from "react";

export default function CreateTournament() {
  const [visibility, setVisibility] = useState("Public");

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Create Tournament
          </h1>
          <p className="mt-2 text-slate-600">
            Set up a volleyball tournament, manage teams, and publish all the
            key details in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <form className="space-y-8">
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
                      placeholder="e.g. Beirut Summer Volleyball Cup"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Beirut, Lebanon"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Venue
                    </label>
                    <input
                      type="text"
                      placeholder="Main indoor court"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
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
                    <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400">
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
                      placeholder="16"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Skill Level
                    </label>
                    <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400">
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
                    <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400">
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
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                    <p className="mt-2 text-sm text-slate-500">
                      {visibility === "Public"
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
                    <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400">
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
                      placeholder="25"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Final Set Points
                    </label>
                    <input
                      type="number"
                      placeholder="15"
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
                      placeholder="Write a short description about the tournament, eligibility, and what teams should expect..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Rules
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Add registration rules, lineup requirements, tie-break rules, etc."
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
                  Create Tournament
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 text-slate-700 px-6 py-3 font-medium hover:bg-slate-100 transition"
                >
                  Save as Draft
                </button>
              </section>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>• Choose a clear format before teams register.</li>
                <li>• Add full venue details so players can find the court easily.</li>
                <li>• Mention roster limits and eligibility rules.</li>
                <li>• Keep match settings consistent across the tournament.</li>
              </ul>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">Preview</h3>
              <div className="space-y-2 text-sm text-slate-200">
                <p>
                  <span className="text-white font-medium">Status:</span> Draft
                </p>
                <p>
                  <span className="text-white font-medium">Visibility:</span>{" "}
                  {visibility}
                </p>
                <p>
                  <span className="text-white font-medium">Registration:</span>{" "}
                  {visibility === "Public" ? "Open to everyone" : "Invite only"}
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-white/10 p-4 text-sm text-slate-200">
                {visibility === "Public"
                  ? "Once published, any team will be able to view the tournament page, register, and follow matches and stats."
                  : "Once published, only invited teams will be able to access registration and participate in the tournament."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

