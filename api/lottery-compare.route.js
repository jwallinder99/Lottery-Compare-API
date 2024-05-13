const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();

const jsonParser = bodyParser.json();

router.post("/lottery-compare", jsonParser, (req, res) => {
	const { start_date, end_date, user_numbers, secondary_numbers } = req.body;

	// Check for required fields
	if (!start_date || !end_date || !user_numbers) {
		console.error(
			"Missing required fields: start date, end date, or user numbers"
		);
		return res
			.status(400)
			.send("Start date, end date, and user numbers are required");
	}

	// Ensure user_numbers is an array, contains 5 to 7 unique numbers, and each is unique
	if (
		!Array.isArray(user_numbers) ||
		new Set(user_numbers).size < 5 ||
		new Set(user_numbers).size > 7 ||
		new Set(user_numbers).size !== user_numbers.length
	) {
		return res
			.status(400)
			.send("User numbers must be an array of 5 to 7 unique numbers");
	}
	// Ensure secondary number is an array with 1 number
	if (!Array.isArray(secondary_numbers) && secondary_numbers.length > 1) {
		return res
			.status(400)
			.send("You scondary number must be an array with 1 number");
	}

	const responseBody = {
		start_date: start_date,
		end_date: end_date,
		user_numbers: user_numbers,
		secondary_numbers: secondary_numbers,
	};

	return res.json(responseBody);
});

module.exports = router;
