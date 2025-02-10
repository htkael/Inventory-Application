const pool = require("./pool");

async function getTeams() {
  const { rows } = await pool.query("SELECT * FROM teams");
  return rows;
}

async function getPlayers() {
  const { rows } = await pool.query("SELECT * FROM players");
  return rows;
}

async function createTeam(team_name, date_est, rating) {
  await pool.query(
    "INSERT INTO teams (team_name, date_est, rating) VALUES ($1, $2, $3)",
    [team_name, date_est, rating]
  );
}

async function getTeam(id) {
  const { rows } = await pool.query("SELECT * FROM teams WHERE id = ($1)", [
    id,
  ]);
  return rows;
}

async function getPlayersFromTeam(id) {
  const { rows } = await pool.query(
    "SELECT * FROM players INNER JOIN team_players ON players.id = team_players.player_id WHERE team_players.id = ($1)",
    [id]
  );
  return rows;
}

async function createPlayer(
  first_name,
  last_name,
  country,
  world_ranking,
  playing_hand,
  age
) {
  playing_hand = playing_hand.charAt(0).toUpperCase() + playing_hand.slice(1);
  await pool.query(
    "INSERT INTO players (first_name, last_name, country, world_ranking, playing_hand, age) VALUES ($1, $2, $3, $4, $5, $6)",
    [first_name, last_name, country, world_ranking, playing_hand, age]
  );
}

async function deletePlayer(id) {
  await pool.query("DELETE FROM players WHERE id = ($1)", [id]);
}

async function getPlayer(id) {
  const { rows } = await pool.query("SELECT * FROM players WHERE id = ($1)", [
    id,
  ]);
  return rows;
}

async function deleteTeam(id) {
  await pool.query("DELETE FROM teams WHERE id = ($1)", [id]);
}

module.exports = {
  getTeams,
  getPlayers,
  createTeam,
  getTeam,
  getPlayersFromTeam,
  createPlayer,
  deletePlayer,
  getPlayer,
  deleteTeam,
};
