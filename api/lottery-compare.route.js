const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();
const axios = require("axios");
const jsonParser = bodyParser.json();

const { fetchLotteryCodes } = require("../controllers/lotteryController");

router.post("/lottery-compare", jsonParser, async (req, res) => {
	const { start_date, end_date, user_numbers, secondary_numbers } = req.body;

	// Check for required fields
	if (!start_date || !end_date || !user_numbers || !secondary_numbers) {
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
	if (
		(!Array.isArray(secondary_numbers) &&
			new Set(secondary_numbers).size < 1) ||
		new Set(secondary_numbers).size > 2 ||
		new Set(secondary_numbers).size !== secondary_numbers.length
	) {
		return res
			.status(400)
			.send("Your secondary number must be an array with at least 1 number");
	}

	const responseBody = {
		start_date: start_date,
		end_date: end_date,
		user_numbers: user_numbers,
		secondary_numbers: secondary_numbers,
	};

	// return res.json(responseBody);

	try {
		const lotteryCodes = await fetchLotteryCodes();

		const drawCodesNested = await Promise.all(
			lotteryCodes.map((code) =>
				axios
					.get(
						`https://www.lottosonline.com/api/lotterydata/get_data?action=get_lottery_draws_list&lottery=${code}&start_date=${start_date}&end_date=${end_date}&offset=0&limit=10`
					)
					.then((response) => response.data.map((draw) => draw.draw_code))
					.catch((error) => {
						console.error(
							`Failed to fetch draw codes for lottery code ${code}: ${error.message}`
						);
						return [];
					})
			)
		);

		const drawCodes = drawCodesNested.flat();

		// return res.json(drawCodes);

		const detailedDrawDataPromises = drawCodes.map((drawCode) =>
			axios
				.get(
					`https://www.lottosonline.com/api/lotterydata/get_data?action=get_lottery_draw_data&lottery_draw=${drawCode}`
				)
				.then((response) => transformResponse(response.data, drawCode))
				.catch((error) => {
					console.error(
						`Failed to fetch detailed draw data for draw code ${drawCode}: ${error.message}`
					);
					return null;
				})
		);

		const detailedDrawDataResults = await Promise.all(detailedDrawDataPromises);
		const filteredDrawData = detailedDrawDataResults.filter(
			(data) => Object.keys(data).length !== 0
		); // Filter out empty objects

		return res.json(filteredDrawData.flat());

		// Calculate winnings based on user numbers
		// const winnings = calculateWinnings(
		// 	filteredDrawData.flat(),
		// 	user_numbers,
		// 	secondary_numbers
		// );

		res.json(winnings);
	} catch (error) {
		console.error(`Error fetching lottery comparisons: ${error.message}`);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;
