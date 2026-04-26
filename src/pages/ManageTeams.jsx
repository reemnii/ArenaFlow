import { useEffect, useMemo, useState } from "react";
import { apiFetch, normalizePlayer, normalizeTeam } from "../utils/api";

const createEmptyPlayer = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "",
  position: "",
  number: "",
  age: "",
});

const createEmptyTeamForm = () => ({
  teamName: "",
  coach: "",
  city: "",
  gender: "male",
  players: [createEmptyPlayer()],
});

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
  "inline-flex items-center justify-center rounded-full border border-red-300/70 px-4 py-2 text-sm font-bold text-red-600 transition-all duration-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teamForm, setTeamForm] = useState(createEmptyTeamForm());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadTeamsData() {
    setIsLoading(true);

    try {
      const [teamsData, playersData] = await Promise.all([
        apiFetch("/api/teams"),
        apiFetch("/api/players"),
      ]);

      setTeams((teamsData || []).map(normalizeTeam));
      setPlayers((playersData || []).map(normalizePlayer));
    } catch (requestError) {
      setErrorMessage(requestError.message || "Unable to load teams.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTeamsData();
  }, []);

  const playersByTeam = useMemo(() => {
    return players.reduce((accumulator, player) => {
      const key = String(player.teamId || "");
      if (!accumulator[key]) accumulator[key] = [];
      accumulator[key].push(player);
      return accumulator;
    }, {});
  }, [players]);

  function handleTeamChange(event) {
    const { name, value } = event.target;
    setTeamForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePlayerChange(index, field, value) {
    setTeamForm((previous) => {
      const updatedPlayers = [...previous.players];
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        [field]: value,
      };

      return {
        ...previous,
        players: updatedPlayers,
      };
    });
  }

  function addPlayerField() {
    setTeamForm((previous) => ({
      ...previous,
      players: [...previous.players, createEmptyPlayer()],
    }));
  }

  function removePlayerField(playerId) {
    setTeamForm((previous) => {
      const updatedPlayers = previous.players.filter(
        (player) => player.id !== playerId
      );

      return {
        ...previous,
        players: updatedPlayers.length ? updatedPlayers : [createEmptyPlayer()],
      };
    });
  }

  async function addTeam() {
    if (!teamForm.teamName.trim()) {
      setErrorMessage("Please enter a team name before adding a team.");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const team = normalizeTeam(
        await apiFetch("/api/teams", {
          method: "POST",
          auth: true,
          body: {
            name: teamForm.teamName.trim(),
            coachName: teamForm.coach.trim(),
            city: teamForm.city.trim(),
            gender: teamForm.gender,
          },
        })
      );

      const validPlayers = teamForm.players.filter((player) => player.name.trim());

      await Promise.all(
        validPlayers.map((player) =>
          apiFetch("/api/players", {
            method: "POST",
            body: {
              name: player.name.trim(),
              position: player.position.trim() || "Unknown",
              gender: teamForm.gender,
              number: player.number === "" ? undefined : Number(player.number),
              age: player.age === "" ? undefined : Number(player.age),
              team: team.id,
            },
          })
        )
      );

      setTeamForm(createEmptyTeamForm());
      setStatusMessage("Team added successfully.");
      await loadTeamsData();
    } catch (requestError) {
      setErrorMessage(requestError.message || "Unable to add team.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeTeam(teamId) {
    try {
      await apiFetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });
      setStatusMessage("Team removed successfully.");
      await loadTeamsData();
    } catch (requestError) {
      setErrorMessage(requestError.message || "Unable to remove team.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand dark:text-fuchsia-300">
            Team Management
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
            Manage Teams
          </h1>
        </header>

        {statusMessage && <p className="mb-6 rounded-[1.1rem] border border-[#f0b4df] bg-white/70 px-4 py-3 text-sm font-semibold text-brand-deep dark:bg-white/10 dark:text-fuchsia-200">{statusMessage}</p>}
        {errorMessage && <p className="mb-6 rounded-[1.1rem] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100">{errorMessage}</p>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className={`lg:col-span-2 p-6 md:p-8 ${glassCard}`}>
            <h2 className={sectionTitleClass}>Create Team</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="teamName" className={labelClass}>Team Name</label>
                <input id="teamName" name="teamName" value={teamForm.teamName} onChange={handleTeamChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="coach" className={labelClass}>Coach Name</label>
                  <input id="coach" name="coach" value={teamForm.coach} onChange={handleTeamChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>City</label>
                  <input id="city" name="city" value={teamForm.city} onChange={handleTeamChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="gender" className={labelClass}>Team Gender</label>
                <select id="gender" name="gender" value={teamForm.gender} onChange={handleTeamChange} className={inputClass}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <fieldset>
                <legend className="mb-3 text-lg font-black text-slate-900 dark:text-white">Players</legend>
                <div className="space-y-4">
                  {teamForm.players.map((player, index) => (
                    <div key={player.id} className="rounded-[1.1rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">Player {index + 1}</h3>
                        <button type="button" onClick={() => removePlayerField(player.id)} className={dangerBtn}>
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <input placeholder="Player name" value={player.name} onChange={(event) => handlePlayerChange(index, "name", event.target.value)} className={inputClass} />
                        <input placeholder="Position" value={player.position} onChange={(event) => handlePlayerChange(index, "position", event.target.value)} className={inputClass} />
                        <input type="number" placeholder="Jersey number" value={player.number} onChange={(event) => handlePlayerChange(index, "number", event.target.value)} className={inputClass} />
                        <input type="number" placeholder="Age" value={player.age} onChange={(event) => handlePlayerChange(index, "age", event.target.value)} className={inputClass} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={addPlayerField} className={outlineBtn}>
                    Add Another Player
                  </button>
                </div>
              </fieldset>

              <div className="pt-2">
                <button type="button" disabled={isSubmitting} onClick={addTeam} className={primaryBtn}>
                  {isSubmitting ? "Saving..." : "Add Team"}
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className={`${glassCard} p-6`}>
              <h2 className="mb-3 text-lg font-black text-slate-900 dark:text-white">Quick Summary</h2>
              <div className="space-y-2 text-sm leading-7 text-slate-600 dark:text-white/68">
                <p><span className="font-semibold text-slate-900 dark:text-white">Current teams:</span> {teams.length}</p>
                <p><span className="font-semibold text-slate-900 dark:text-white">Team being created:</span> {teamForm.teamName || "Untitled Team"}</p>
                <p><span className="font-semibold text-slate-900 dark:text-white">Players in form:</span> {teamForm.players.filter((player) => player.name.trim()).length}</p>
              </div>
            </section>
          </aside>
        </div>

        <section className={`mt-8 p-6 ${glassCard}`}>
          <h2 className="mb-4 text-xl font-black text-slate-900 dark:text-white">
            Existing Teams
          </h2>

          {isLoading ? (
            <p>Loading teams...</p>
          ) : teams.length === 0 ? (
            <p className="text-slate-600 dark:text-white/68">No teams added yet.</p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => {
                const teamPlayers = playersByTeam[String(team.id)] || [];

                return (
                  <article key={team.id} className="rounded-[1.15rem] border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-black/20 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{team.name}</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-white/68">Coach: {team.coach || "N/A"}</p>
                        <p className="text-sm text-slate-600 capitalize dark:text-white/68">Division: {team.gender}</p>
                        <p className="text-sm text-slate-600 dark:text-white/68">Players: {teamPlayers.length}</p>
                      </div>

                      <button type="button" onClick={() => removeTeam(team.id)} className={dangerBtn}>
                        Remove Team
                      </button>
                    </div>

                    {teamPlayers.length > 0 ? (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {teamPlayers.map((player) => (
                          <div key={player.id} className="rounded-xl border border-white/15 bg-white/50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                            <span className="font-semibold">#{player.number ?? "N/A"}</span>{" "}
                            {player.name}
                            {player.position ? ` - ${player.position}` : ""}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500 dark:text-white/45">
                        No players added.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
