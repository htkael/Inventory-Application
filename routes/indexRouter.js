const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");
const playerRouter = require("./playerRouter");

indexRouter.get("/", indexController.getTeams);
indexRouter.get("/create-team", indexController.createTeamForm);
indexRouter.post("/create-team", indexController.createTeam);
indexRouter.get("/team/:id", indexController.teamRoster);
indexRouter.post("/team/:id/delete", indexController.deleteTeam);
indexRouter.use("/players", playerRouter);

module.exports = indexRouter;
