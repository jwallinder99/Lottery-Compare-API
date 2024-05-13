const axios = require("axios");

// Function to fetch lottery codes
const fetchLotteryCodes = async () => {
	try {
		const response = await axios.get(
			"https://www.lottosonline.com/api/lotterydata/get_data?action=list_lotteries"
		);
		const lotteries = response.data;

		// Extracting lottery codes into an array
		const lotteryCodes = Object.keys(lotteries).map(
			(key) => lotteries[key].lottery_code
		);

		return lotteryCodes;
	} catch (error) {
		console.error("Error fetching lottery codes:", error);
		throw error; // Rethrowing the error to be handled by the caller
	}
};

function transformResponse(data, drawCode) {
	const combinedDrawDetails = {};

	Object.entries(data).forEach(([key, value]) => {
		if (key === "0" || key.match(/^\d+-\d+-\d+-\d+$/)) {
			if (!combinedDrawDetails[drawCode]) {
				combinedDrawDetails[drawCode] = {
					...value,
					winnings_structure: { main_draw: [] },
				};
			}
			if (value.winnings_structure && value.winnings_structure.main_draw) {
				combinedDrawDetails[drawCode].winnings_structure.main_draw.push(
					...value.winnings_structure.main_draw
				);
			}
		}
	});

	return combinedDrawDetails;
}

module.exports = {
	fetchLotteryCodes,
	transformResponse,
};
