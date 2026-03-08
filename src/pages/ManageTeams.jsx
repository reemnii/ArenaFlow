import { useState } from "react";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);

  const [teamForm, setTeamForm] = useState({
    teamName: "",
    coach: "",
    players: [
      { id: Date.now(), name: "", position: "", number: "" }
    ]
  });

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...teamForm.players];
    updatedPlayers[index][field] = value;

    setTeamForm((prev) => ({
      ...prev,
      players: updatedPlayers
    }));
  };

  const addPlayerField = () => {
    setTeamForm((prev) => ({
      ...prev,
      players: [
        ...prev.players,
        { id: Date.now() + Math.random(), name: "", position: "", number: "" }
      ]
    }));
  };

  const addTeam = () => {
    if (!teamForm.teamName.trim()) return;

    const newTeam = {
      id: Date.now(),
      name: teamForm.teamName,
      coach: teamForm.coach,
      players: teamForm.players.filter((player) => player.name.trim() !== "")
    };

    setTeams((prev) => [...prev, newTeam]);

    setTeamForm({
      teamName: "",
      coach: "",
      players: [{ id: Date.now(), name: "", position: "", number: "" }]
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Manage Teams</h1>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Team</h2>

          <div className="space-y-4">
            <input
              type="text"
              name="teamName"
              placeholder="Team name"
              value={teamForm.teamName}
              onChange={handleTeamChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <input
              type="text"
              name="coach"
              placeholder="Coach name"
              value={teamForm.coach}
              onChange={handleTeamChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <div>
              <h3 className="font-semibold mb-3">Players</h3>

              <div className="space-y-3">
                {teamForm.players.map((player, index) => (
                  <div key={player.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Player name"
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerChange(index, "name", e.target.value)
                      }
                      className="rounded-xl border border-slate-300 px-4 py-3"
                    />

                    <input
                      type="text"
                      placeholder="Position"
                      value={player.position}
                      onChange={(e) =>
                        handlePlayerChange(index, "position", e.target.value)
                      }
                      className="rounded-xl border border-slate-300 px-4 py-3"
                    />

                    <input
                      type="number"
                      placeholder="Jersey number"
                      value={player.number}
                      onChange={(e) =>
                        handlePlayerChange(index, "number", e.target.value)
                      }
                      className="rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPlayerField}
                className="mt-4 rounded-xl border border-slate-300 px-4 py-2"
              >
                Add Another Player
              </button>
            </div>

            <button
              onClick={addTeam}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800"
            >
              Add Team
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Teams</h2>

          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-semibold text-lg">{team.name}</h3>
                <p className="text-slate-600">Coach: {team.coach}</p>
                <p className="text-slate-600 mb-3">Players: {team.players.length}</p>

                <div className="space-y-2">
                  {team.players.map((player) => (
                    <div key={player.id} className="text-sm text-slate-700">
                      #{player.number} {player.name} - {player.position}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
