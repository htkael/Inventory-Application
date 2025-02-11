const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");
const playerRouter = require("./playerRouter");

indexRouter.get("/", indexController.getTeams);
indexRouter.get("/create-team", indexController.createTeamForm);
indexRouter.post("/create-team", indexController.createTeam);
indexRouter.get("/team/:id", indexController.teamRoster);
indexRouter.post("/team/:id/delete", indexController.deleteTeam);
indexRouter.get("/team/:id/add-player", indexController.addPlayerForm);
indexRouter.post("/team/:id/add-player", indexController.addPlayer);
indexRouter.post(
  "/team/:id/delete-player/:player",
  indexController.removeFromTeam
);
indexRouter.get("/team/:id/edit", indexController.editTeamForm);
indexRouter.post("/team/:id/edit", indexController.editTeam);
indexRouter.use("/players", playerRouter);

module.exports = indexRouter;
