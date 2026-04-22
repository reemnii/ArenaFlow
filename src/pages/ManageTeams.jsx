import { useEffect, useState } from "react";

const createEmptyPlayer = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "",
  position: "",
  number: "",
});

const createEmptyTeamForm = () => ({
  teamName: "",
  coach: "",
  players: [createEmptyPlayer()],
});

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
  "inline-flex items-center justify-center rounded-full border border-red-300/70 dark:border-red-800 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-950/30";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [teamForm, setTeamForm] = useState(createEmptyTeamForm());

  useEffect(() => {
    const savedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    setTeams(savedTeams);
  }, []);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlayerChange = (index, field, value) => {
    setTeamForm((prev) => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        [field]: value,
      };

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  const addPlayerField = () => {
    setTeamForm((prev) => ({
      ...prev,
      players: [...prev.players, createEmptyPlayer()],
    }));
  };

  const removePlayerField = (playerId) => {
    setTeamForm((prev) => {
      const updatedPlayers = prev.players.filter(
        (player) => player.id !== playerId
      );

      return {
        ...prev,
        players: updatedPlayers.length ? updatedPlayers : [createEmptyPlayer()],
      };
    });
  };

  const addTeam = () => {
    if (!teamForm.teamName.trim()) {
      setStatusMessage("Please enter a team name before adding a team.");
      return;
    }

    const validPlayers = teamForm.players.filter(
      (player) => player.name.trim() !== ""
    );

    const newTeam = {
      id: Date.now().toString(),
      name: teamForm.teamName.trim(),
      coach: teamForm.coach.trim(),
      players: validPlayers,
    };

    setTeams((prev) => [...prev, newTeam]);
    setTeamForm(createEmptyTeamForm());
    setStatusMessage("Team added successfully.");
  };

  const removeTeam = (teamId) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
    setStatusMessage("Team removed successfully.");
  };

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10"
      aria-labelledby="manage-teams-title"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
            Team Management
          </p>
          <h1
            id="manage-teams-title"
            className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
          >
            Manage Teams
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-white/68 sm:text-base">
            Create teams, add players, and manage your tournament participants.
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
          <section className={`lg:col-span-2 p-6 md:p-8 ${glassCard}`}>
            <h2 className={sectionTitleClass}>Create Team</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="teamName" className={labelClass}>
                  Team Name
                </label>
                <input
                  id="teamName"
                  type="text"
                  name="teamName"
                  placeholder="Team name"
                  value={teamForm.teamName}
                  onChange={handleTeamChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="coach" className={labelClass}>
                  Coach Name
                </label>
                <input
                  id="coach"
                  type="text"
                  name="coach"
                  placeholder="Coach name"
                  value={teamForm.coach}
                  onChange={handleTeamChange}
                  className={inputClass}
                />
              </div>

              <fieldset>
                <legend className="mb-3 text-lg font-black text-slate-900 dark:text-white">
                  Players
                </legend>

                <div className="space-y-4">
                  {teamForm.players.map((player, index) => (
                    <div
                      key={player.id}
                      className="rounded-[1.1rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          Player {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removePlayerField(player.id)}
                          aria-label={`Remove player ${index + 1}`}
                          className={dangerBtn}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label
                            htmlFor={`player-name-${player.id}`}
                            className={labelClass}
                          >
                            Player Name
                          </label>
                          <input
                            id={`player-name-${player.id}`}
                            type="text"
                            placeholder="Player name"
                            value={player.name}
                            onChange={(e) =>
                              handlePlayerChange(index, "name", e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`player-position-${player.id}`}
                            className={labelClass}
                          >
                            Position
                          </label>
                          <input
                            id={`player-position-${player.id}`}
                            type="text"
                            placeholder="Position"
                            value={player.position}
                            onChange={(e) =>
                              handlePlayerChange(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`player-number-${player.id}`}
                            className={labelClass}
                          >
                            Jersey Number
                          </label>
                          <input
                            id={`player-number-${player.id}`}
                            type="number"
                            placeholder="Jersey number"
                            value={player.number}
                            onChange={(e) =>
                              handlePlayerChange(index, "number", e.target.value)
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={addPlayerField}
                    className={outlineBtn}
                  >
                    Add Another Player
                  </button>
                </div>
              </fieldset>

              <div className="pt-2">
                <button type="button" onClick={addTeam} className={primaryBtn}>
                  Add Team
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6" aria-label="Team management summary">
            <section className={`${glassCard} p-6`}>
              <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">
                Quick Summary
              </h2>

              <div className="space-y-2 text-sm leading-7 text-slate-600 dark:text-white/68">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Current teams:
                  </span>{" "}
                  {teams.length}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Team being created:
                  </span>{" "}
                  {teamForm.teamName || "Untitled Team"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Coach:
                  </span>{" "}
                  {teamForm.coach || "Not added yet"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Players in form:
                  </span>{" "}
                  {teamForm.players.filter((player) => player.name.trim() !== "").length}
                </p>
              </div>
            </section>

            <section className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,#341248,#4d1e61,#1b1025)] p-6 text-white shadow-[0_18px_45px_rgba(18,10,35,0.22)]">
              <h2 className="mb-3 text-lg font-black">Team Tips</h2>
              <div className="space-y-3 text-sm leading-7 text-white/85">
                <p>• Add player names first so the roster is easier to review.</p>
                <p>• Keep jersey numbers unique inside each team.</p>
                <p>• Use clear positions for better tournament organization.</p>
                <p>• Remove empty player cards before saving if not needed.</p>
              </div>
            </section>
          </aside>
        </div>

        <section className={`mt-8 p-6 ${glassCard}`}>
          <h2 className="mb-4 text-xl font-black text-slate-900 dark:text-white">
            Existing Teams
          </h2>

          {teams.length === 0 ? (
            <p className="text-slate-600 dark:text-white/68">
              No teams added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <article
                  key={team.id}
                  className="rounded-[1.15rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {team.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-white/68">
                        Coach: {team.coach || "N/A"}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-white/68">
                        Players: {team.players.length}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTeam(team.id)}
                      aria-label={`Remove team ${team.name}`}
                      className={dangerBtn}
                    >
                      Remove Team
                    </button>
                  </div>

                  {team.players.length > 0 ? (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {team.players.map((player) => (
                        <div
                          key={player.id}
                          className="rounded-xl border border-white/15 bg-white/50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75"
                        >
                          <span className="font-semibold">
                            #{player.number || "N/A"}
                          </span>{" "}
                          {player.name}
                          {player.position ? ` — ${player.position}` : ""}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500 dark:text-white/45">
                      No players added.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
