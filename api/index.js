const express = require("express");
const app = express();

const routes = require("./lottery-compare.js");
app.get("*", (req, res) => {
	res.send("Welcome to Lottery-Compare API");
});

app.use("/", routes);

module.exports = app;
