const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: Number
    },
    position: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    coach: {
      type: String,
      trim: true
    },
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true
    },
    players: [playerSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
