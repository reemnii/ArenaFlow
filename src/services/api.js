const API_URL = "http://localhost:5000/api";

// GET ALL TEAMS
export const getTeams = async () => {
  const res = await fetch(`${API_URL}/teams`);
  return res.json();
};

// GET TEAM BY ID
export const getTeamById = async (id) => {
  const res = await fetch(`${API_URL}/teams/${id}`);
  return res.json();
};
