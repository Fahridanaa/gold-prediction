import { useState, useEffect } from "react";

interface GoldStats {
	buyPrice: number;
	sellPrice: number;
	dailyHigh: number;
	dailyLow: number;
	loading: boolean;
	error: Error | null;
}

export function useGoldStats() {
	const [stats, setStats] = useState<GoldStats>({
		buyPrice: 0,
		sellPrice: 0,
		dailyHigh: 0,
		dailyLow: 0,
		loading: true,
		error: null,
	});

	useEffect(() => {
		const eventSource = new EventSource("/api/gold/stream");

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setStats({
				buyPrice: Number(data.price) + 1, // Add spread
				sellPrice: Number(data.price) - 1, // Subtract spread
				dailyHigh: Number(data.high),
				dailyLow: Number(data.low),
				loading: false,
				error: null,
			});
		};

		return () => eventSource.close();
	}, []);

	return stats;
}
