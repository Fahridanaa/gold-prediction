import { useState, useEffect } from "react";
import { GoldPriceService } from "@/services/goldPriceService";
import type { GoldPriceData, TimeRange } from "@/types/gold";

export function useHistoricalData(selectedRange: TimeRange) {
	const [historicalData, setHistoricalData] = useState<GoldPriceData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchHistorical() {
			try {
				setLoading(true);
				const historicalRange = selectedRange === "1w" ? "3m" : "5y";
				const data = await GoldPriceService.getPrice(historicalRange);
				setHistoricalData(data?.historicalData ?? []);
			} catch (err) {
				console.error("Failed to fetch historical data:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchHistorical();
	}, [selectedRange]);

	return { historicalData, loading };
}
