const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.post("/", jsonParser, (req, res) => {
	const { user_numbers } = req.body;
	return res.send(`User Numbers: ${user_numbers}`);
});

module.exports = router;
