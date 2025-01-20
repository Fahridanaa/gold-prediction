// src/lib/api/yahoo-finance.ts
import { TimeRange } from "@/types/gold";

export async function fetchGoldPrice(timeRange: TimeRange) {
	try {
		const response = await fetch(`/api/gold?range=${timeRange}`, {
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
}
