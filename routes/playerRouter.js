const { Router } = require("express");
const playerRouter = Router();
const playerController = require("../controllers/playerController");

playerRouter.get("/", playerController.getPlayers);
playerRouter.get("/create-player", playerController.createPlayerForm);
playerRouter.post("/create-player", playerController.createPlayer);
playerRouter.get("/:id", playerController.playerDetails);
playerRouter.post("/:id/delete", playerController.deletePlayer);

module.exports = playerRouter;
