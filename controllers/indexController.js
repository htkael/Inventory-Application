const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

exports.getTeams = async (req, res) => {
  try {
    const teams = await db.getTeams();
    res.render("index", { teams: teams });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createTeam = async (req, res) => {
  try {
    const team_name = req.body.team_name;
    const rating = req.body.rating;
    const date_est = new Date();

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

exports.addPlayerForm = async (req, res) => {
  try {
    const id = req.params.id;
    const teams = await db.getTeam(id);
    const availablePlayers = await db.getAvailablePlayers(id);
    team = teams[0];
    res.render("add-player", {
      team: team,
      availablePlayers: availablePlayers,
    });
  } catch {
    console.error("Could not get add player form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.addPlayer = async (req, res) => {
  try {
    const playerIds = Array.isArray(req.body.selectedPlayers)
      ? req.body.selectedPlayers
      : [req.body.selectedPlayers];
    const team_id = req.params.id;
    const join_date = new Date();
    await db.addPlayers(team_id, playerIds, join_date);
    res.redirect(`/team/${team_id}`);
  } catch {
    console.error("Could not add player", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.removeFromTeam = async (req, res) => {
  try {
    const team_id = req.params.id;
    const player_id = req.params.player;
    console.log(team_id, player_id);
    await db.removeFromTeam(team_id, player_id);
    res.redirect(`/team/${team_id}`);
  } catch {
    console.error("Could not remove player", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editTeamForm = async (req, res) => {
  try {
    const id = req.params.id;
    const teams = await db.getTeam(id);
    const team = teams[0];
    res.render("edit-team", { team: team });
  } catch {
    console.error("Could not get edit team form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const team_name = req.body.team_name;
    const rating = req.body.rating;
    await db.editTeam(id, team_name, rating);
    res.redirect(`/team/${id}`);
  } catch (error) {
    console.error("Could not edit team", error);
    res.status(500).send("Internal Server Error");
  }
};
