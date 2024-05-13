const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();

const jsonParser = bodyParser.json();

router.post("/lottery-compare", jsonParser, (req, res) => {
	const { start_date, end_date, user_numbers, secondary_numbers } = req.body;

	const responseBody = {
		start_date: start_date,
		end_date: end_date,
		user_numbers: user_numbers,
		secondary_numbers: secondary_numbers,
	};

	res.json(responseBody);
});

module.exports = router;
