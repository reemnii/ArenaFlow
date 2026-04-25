const express = require("express");
const {
  getAllTeams,
  getTeamById,
  getTeamsByTournament
} = require("../controllers/teamController");

const router = express.Router();

router.get("/", getAllTeams);
router.get("/tournament/:tournamentId", getTeamsByTournament);
router.get("/:id", getTeamById);

module.exports = router;
