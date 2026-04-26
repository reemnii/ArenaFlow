export function toTournamentPayload(tournament, status) {
  const selectedTeamIds = Array.isArray(tournament.selectedTeamIds)
    ? tournament.selectedTeamIds.filter(Boolean)
    : [];

  return {
    name: tournament.name.trim(),
    location: tournament.location.trim(),
    venue: tournament.venue.trim(),
    startDate: tournament.startDate || undefined,
    endDate: tournament.endDate || undefined,
    date: tournament.startDate || undefined,
    format: tournament.format,
    type: tournament.volleyballType,
    volleyballType: tournament.volleyballType,
    maxTeams: Number(tournament.maxTeams),
    skillLevel: tournament.skillLevel,
    genderCategory: tournament.genderCategory,
    visibility: tournament.visibility,
    registrationMode: tournament.registrationMode,
    teams: selectedTeamIds,
    teamIds: selectedTeamIds,
    bestOf: tournament.bestOf,
    pointsPerSet: Number(tournament.pointsPerSet),
    finalSetPoints: Number(tournament.finalSetPoints),
    description: tournament.description.trim(),
    additionalRules: tournament.additionalRules.trim(),
    status,
  };
}
