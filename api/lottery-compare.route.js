const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();

const jsonParser = bodyParser.json();

router.post("/lottery-compare", jsonParser, (req, res) => {
	res.send(`Welcome, ${req.body.username}`);
});

module.exports = router;
