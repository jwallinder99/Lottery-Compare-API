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

function calculateWinnings(drawDataResults, userNumbers, secondaryNumbers) {
	return drawDataResults
		.map((entry) => {
			const drawDetails = entry[Object.keys(entry)[0]];

			const primaryResult = drawDetails.primary_result.map(Number);
			const secondaryResult = drawDetails.secondary_result.map(Number); // Conversion for secondary results

			const winningsStructure = drawDetails.winnings_structure.main_draw;

			const lotteryNameMapping = {
				USMEG: "Mega Millions",
				USPOW: "Powerball",
				EUEUR: "EuroMillions",
				EUJAC: "EuroJackpot",
				AULOT: "Oz Lotto",
				USCAL: "California SuperLotto Plus",
				FRLOT: "French Lotto",
				AUPOW: "Australia Powerball",
				UKLOT: "UK Lotto",
				ESELG: "Spanish El Gordo",
				USLIF: "Cash4Life",
				IELOT: "Irish Lotto",
				USLOT: "Lotto America",
				ESBON: "BonoLoto",
				AUMON: "Australia Mon & Wed Lotto",
				UKTHU: "UK Thunderball",
				AUTAT: "Australia Saturday Lotto",
				ITSUP: "SuperEnaLotto",
				DELOT: "German Lotto",
			};

			// Calculate primary matches
			const primaryMatches = userNumbers.reduce(
				(acc, num) => acc + primaryResult.includes(num),
				0
			);

			// Calculate secondary matches
			const secondaryMatches = secondaryNumbers.reduce(
				(acc, num) => acc + secondaryResult.includes(num),
				0
			); // Count secondary matches

			// Find the prize info for the number of primary matches
			const prizeInfo = winningsStructure.find(
				(prize) =>
					prize.primary === primaryMatches &&
					prize.secondary === secondaryMatches
			);

			const prizeAmount = prizeInfo ? prizeInfo.prize_amount : 0;
			const lotteryCurrency = drawDetails.lottery_currency; // Extract the currency from draw details

			return {
				lottery_name: lotteryNameMapping[drawDetails.lottery_code],
				draw_code: drawDetails.draw_code,
				draw_date: drawDetails.draw_date,
				primaryMatches,
				secondaryMatches, // Include secondaryMatches in the return
				prize_amount: prizeAmount, // This is the corrected line
				currency: lotteryCurrency, // Adding currency to the output
			};
		})
		.filter((entry) => entry.prize_amount > 0)
		.sort((a, b) => b.prize_amount - a.prize_amount); // Sort based on prize_amount in descending order
}

module.exports = {
	fetchLotteryCodes,
	transformResponse,
	calculateWinnings,
};
