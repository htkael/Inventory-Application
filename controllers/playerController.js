const db = require("../db/queries");

exports.getPlayers = async (req, res) => {
  try {
    const players = await db.getPlayers();
    res.render("players", { players: players });
  } catch (error) {
    console.error("Error retrieving players", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createPlayerForm = async (req, res) => {
  try {
    res.render("create-player");
  } catch (error) {
    console.error("Error retrieving player form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const country = req.body.country;
    const world_ranking = req.body.world_ranking;
    const playing_hand = req.body.playing_hand;
    const age = req.body.age;
    console.log(
      first_name,
      last_name,
      country,
      world_ranking,
      playing_hand,
      age
    );
    await db.createPlayer(
      first_name,
      last_name,
      country,
      world_ranking,
      playing_hand,
      age
    );
    res.redirect("/players");
  } catch (error) {
    console.error("Error creating player", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const id = req.params.id;
    await db.deletePlayer(id);
    res.redirect("/players");
  } catch (error) {
    console.error("Error deleting player", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.playerDetails = async (req, res) => {
  const id = req.params.id;
  const players = await db.getPlayer(id);
  const player = players[0];
  console.log(player);
  res.render("player", { player: player });
};
