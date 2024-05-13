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

module.exports = {
	fetchLotteryCodes,
};
