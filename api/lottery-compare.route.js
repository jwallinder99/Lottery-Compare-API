const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();

const jsonParser = bodyParser.json();

router.post("/lottery-compare", jsonParser, (req, res) => {
	const { start_date, end_date, user_numbers, secondary_numbers } = req.body;

	res.send(
		`Recieved ${start_date}, ${end_date}, ${user_numbers}, ${secondary_numbers}`
	);
});

module.exports = router;
