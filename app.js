const express = require("express");
const app = express();
const path = require("node:path");
require("dotenv").config();
const indexRouter = require("./routes/indexRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

console.log("Server start");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Express app listening on Port: ${PORT}`));
