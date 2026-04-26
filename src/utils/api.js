import { getAuthToken } from "./auth";

const LOCAL_API_URL = "http://localhost:5000";
const DEPLOYED_API_URL = "https://arenaflow-backend.onrender.com";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? LOCAL_API_URL : DEPLOYED_API_URL)
).replace(/\/+$/, "");

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = false,
  } = options;

  const requestHeaders = {
    ...headers,
  };

  if (body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuthToken();

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        (Array.isArray(data?.errors) && data.errors[0]) ||
        "Request failed"
    );
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
}

export function normalizeTeam(team) {
  if (!team) return null;

  return {
    ...team,
    id: team._id || team.id,
    createdBy: normalizeId(team.createdBy),
    coach: team.coachName || team.coach || "",
    teamName: team.name,
  };
}

export function normalizeTournament(tournament) {
  if (!tournament) return null;

  const teams = Array.isArray(tournament.teams)
    ? tournament.teams.map((team) =>
        typeof team === "string" ? team : normalizeTeam(team)
      )
    : [];

  return {
    ...tournament,
    id: tournament._id || tournament.id,
    prize:
      tournament.prize && Number(tournament.prize) > 0
        ? `$${tournament.prize}`
        : tournament.prize,
    createdBy: normalizeId(tournament.createdBy),
    teamIds: teams.map((team) => normalizeId(team)),
    teams: teams
      .map((team) => (typeof team === "string" ? null : team))
      .filter(Boolean),
  };
}

export function normalizePlayer(player) {
  if (!player) return null;

  return {
    ...player,
    id: player._id || player.id,
    teamId: normalizeId(player.team),
  };
}

export function normalizeMatch(match) {
  if (!match) return null;

  return {
    ...match,
    id: match._id || match.id,
    tournamentId: normalizeId(match.tournament),
    teamA: normalizeId(match.teamA),
    teamB: normalizeId(match.teamB),
    winner: normalizeId(match.winner),
    date: match.matchDate || match.date || "",
  };
}

export function normalizeScore(score) {
  if (!score) return null;

  return {
    ...score,
    id: score._id || score.id,
    matchId: normalizeId(score.match),
  };
}
