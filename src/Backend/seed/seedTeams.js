const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Team = require("../models/Team");

dotenv.config();

const teams = [
  {
    name: "LAU Sailors",
    coach: "Coach Name",
    tournamentId: "PUT_REAL_TOURNAMENT_ID_HERE",
    players: [
      { name: "Rawad", number: 13, position: "Outside Hitter" },
      { name: "Ali", number: 7, position: "Setter" }
    ]
  },
  {
    name: "LAU Captains",
    coach: "Coach Name",
    tournamentId: "PUT_REAL_TOURNAMENT_ID_HERE",
    players: [
      { name: "Omar", number: 10, position: "Middle Blocker" },
      { name: "Karim", number: 4, position: "Libero" }
    ]
  }
];

const seedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Team.deleteMany();
    await Team.insertMany(teams);

    console.log("Teams seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedTeams();
