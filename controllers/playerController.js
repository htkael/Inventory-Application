const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const playerValidation = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .matches(/^[A-Za-z\s-']+$/)
    .withMessage(
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .matches(/^[A-Za-z\s-']+$/)
    .withMessage(
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  body("country")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Country is required")
    .matches(/^[A-Za-z\s-']+$/)
    .withMessage("Country name is invalid"),

  body("world_ranking")
    .isFloat({ min: 1 })
    .withMessage("Ranking must be a positive number"),

  body("playing_hand")
    .isIn(["left", "right"])
    .withMessage("Playing hand must be either left or right"),

  body("age")
    .isInt({ min: 15, max: 120 })
    .withMessage("Age must be between 15 and 120"),
];

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
    res.render("create-player", { formData: "" });
  } catch (error) {
    console.error("Error retrieving player form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createPlayer = [
  playerValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("create-player", {
          errors: errors.array(),
          formData: req.body,
        });
      }
      const {
        first_name,
        last_name,
        country,
        world_ranking,
        playing_hand,
        age,
      } = req.body;
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
      console.error("Error creating player:", error);
      res.status(500).send("Error creating player");
    }
  },
];

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
  try {
    const id = req.params.id;
    const players = await db.getPlayer(id);
    const player = players[0];
    console.log(player);
    res.render("player", { player: player });
  } catch (error) {
    console.error("Error getting player details", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editPlayerForm = async (req, res) => {
  try {
    const id = req.params.id;
    const players = await db.getPlayer(id);
    const player = players[0];
    res.render("edit-player", { player: player });
  } catch (error) {
    console.error("Error getting edit form", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editPlayer = async (req, res) => {
  try {
    const id = req.params.id;
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
    await db.editPlayer(
      id,
      first_name,
      last_name,
      country,
      world_ranking,
      playing_hand,
      age
    );
    res.redirect(`/players/${id}`);
  } catch (error) {
    console.error("Error editing player", error);
    res.status(500).send("Internal Server Error");
  }
};
