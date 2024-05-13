const express = require("express");
const app = express();

app.get("*", (req, res) => {
	res.send("Welcome to Lottery-Compare API");
});

module.exports = app;
