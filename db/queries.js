const pool = require("./pool");

async function getTeams() {
  const { rows } = await pool.query("SELECT * FROM teams");
  return rows;
}

async function getPlayers() {
  const { rows } = await pool.query(
    "SELECT * FROM players ORDER BY world_ranking"
  );
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
    "SELECT * FROM players INNER JOIN team_players ON players.id = team_players.player_id WHERE team_players.team_id = ($1)",
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

async function getAvailablePlayers(id) {
  const { rows } = await pool.query(
    "SELECT * FROM players WHERE id NOT IN (SELECT player_id FROM team_players WHERE team_id = ($1))",
    [id]
  );
  return rows;
}

async function addPlayers(team_id, playerIds, join_date) {
  const values = playerIds
    .map((_, index) => `($1, $${index + 2}, $${playerIds.length + 2})`)
    .join(", ");
  const query = `INSERT INTO team_players (team_id, player_id, join_date) VALUES ${values}`;

  const params = [team_id, ...playerIds, join_date];

  await pool.query(query, params);
}

async function removeFromTeam(team_id, player_id) {
  await pool.query(
    "DELETE FROM team_players WHERE team_id = $1 AND player_id = $2",
    [team_id, player_id]
  );
}

async function editPlayer(
  id,
  first_name,
  last_name,
  country,
  world_ranking,
  playing_hand,
  age
) {
  playing_hand = playing_hand.charAt(0).toUpperCase() + playing_hand.slice(1);
  await pool.query(
    "UPDATE players SET first_name = $2, last_name = $3, country = $4, world_ranking = $5, playing_hand = $6, age = $7 WHERE id = $1",
    [id, first_name, last_name, country, world_ranking, playing_hand, age]
  );
}

async function editTeam(id, team_name, rating) {
  await pool.query(
    "UPDATE teams SET team_name = $2, rating = $3 WHERE id = $1",
    [id, team_name, rating]
  );
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
  getAvailablePlayers,
  addPlayers,
  removeFromTeam,
  editPlayer,
  editTeam,
};
