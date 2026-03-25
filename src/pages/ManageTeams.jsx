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
      const updatedPlayers = prev.players.filter((player) => player.id !== playerId);

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
      className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4"
      aria-labelledby="manage-teams-title"
    >
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1
            id="manage-teams-title"
            className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Manage Teams
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Create teams, add players, and manage your tournament participants.
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

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Create Team
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="teamName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
              >
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                name="teamName"
                placeholder="Team name"
                value={teamForm.teamName}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="coach"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
              >
                Coach Name
              </label>
              <input
                id="coach"
                type="text"
                name="coach"
                placeholder="Coach name"
                value={teamForm.coach}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <fieldset>
              <legend className="font-semibold text-slate-900 dark:text-white mb-3">
                Players
              </legend>

              <div className="space-y-4">
                {teamForm.players.map((player, index) => (
                  <div
                    key={player.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Player {index + 1}
                      </h3>

                      <button
                        type="button"
                        onClick={() => removePlayerField(player.id)}
                        aria-label={`Remove player ${index + 1}`}
                        className="rounded-lg border border-red-300 dark:border-red-800 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label
                          htmlFor={`player-name-${player.id}`}
                          className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
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
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`player-position-${player.id}`}
                          className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
                        >
                          Position
                        </label>
                        <input
                          id={`player-position-${player.id}`}
                          type="text"
                          placeholder="Position"
                          value={player.position}
                          onChange={(e) =>
                            handlePlayerChange(index, "position", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`player-number-${player.id}`}
                          className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
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
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPlayerField}
                className="mt-4 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Add Another Player
              </button>
            </fieldset>

            <button
              type="button"
              onClick={addTeam}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200"
            >
              Add Team
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Existing Teams
          </h2>

          {teams.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-300">
              No teams added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <article
                  key={team.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                        {team.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        Coach: {team.coach || "N/A"}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mb-3">
                        Players: {team.players.length}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTeam(team.id)}
                      aria-label={`Remove team ${team.name}`}
                      className="rounded-lg border border-red-300 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      Remove Team
                    </button>
                  </div>

                  {team.players.length > 0 ? (
                    <div className="space-y-2">
                      {team.players.map((player) => (
                        <div
                          key={player.id}
                          className="text-sm text-slate-700 dark:text-slate-300"
                        >
                          #{player.number || "N/A"} {player.name}{" "}
                          {player.position ? `- ${player.position}` : ""}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
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
