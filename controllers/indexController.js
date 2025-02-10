const db = require("../db/queries");

exports.getTeams = async (req, res) => {
  try {
    console.log("index loaded");
    const teams = await db.getTeams();
    console.log(teams);
    res.render("index", { teams: teams });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createTeam = async (req, res) => {
  try {
    console.log("creating team");
    const team_name = req.body.team_name;
    const rating = req.body.rating;
    const date_est = new Date();
    console.log(team_name, rating, date_est);
    await db.createTeam(team_name, date_est, rating);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createTeamForm = async (req, res) => {
  try {
    res.render("create-team");
  } catch (error) {
    console.error("Error retrieving new team form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.teamRoster = async (req, res) => {
  try {
    const id = req.params.id;
    const teams = await db.getTeam(id);
    const team = teams[0];
    const players = await db.getPlayersFromTeam(id);
    console.log(players);
    res.render("team", { team: team, players: players });
  } catch (error) {
    console.error("Error retrieving team ", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const id = req.params.id;
    await db.deleteTeam(id);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting team", error);
    res.status(500).send("Internal Server Error");
  }
};
