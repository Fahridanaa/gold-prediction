// src/services/goldPriceService.ts
import { fetchGoldPrice } from "@/lib/api/yahoo-finance";
import { TimeRange } from "@/types/gold";

export class GoldPriceService {
	static async getPrice(timeRange: TimeRange) {
		const response = await fetchGoldPrice(timeRange);
		if (!response) {
			throw new Error("Failed to fetch gold price data");
		}
		return response;
	}
}
