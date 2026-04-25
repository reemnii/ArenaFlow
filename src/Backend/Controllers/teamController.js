const mongoose = require("mongoose");
const Team = require("../models/Team");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("tournamentId", "name location date")
      .sort({ createdAt: -1 });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch teams",
      error: error.message
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid team ID" });
    }

    const team = await Team.findById(id).populate(
      "tournamentId",
      "name location date"
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch team",
      error: error.message
    });
  }
};

const getTeamsByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    if (!isValidId(tournamentId)) {
      return res.status(400).json({ message: "Invalid tournament ID" });
    }

    const teams = await Team.find({ tournamentId }).sort({ createdAt: -1 });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tournament teams",
      error: error.message
    });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  getTeamsByTournament
};
