import { TimeRange } from "@/types/gold";

export async function fetchCagrPrediction(timeRange: TimeRange) {
	try {
		const response = await fetch(
			`http://127.0.0.1:8000/predict/cagr?range=${timeRange}`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch prediction data");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
}

export async function fetchMovingAveragePrediction(timeRange: TimeRange) {
	try {
		const response = await fetch(
			`http://127.0.0.1:8000/predict/moving-average?range=${timeRange}`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch prediction data");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
}
