import { useState, useEffect, useCallback } from "react";
import { GoldPriceService } from "@/services/goldPriceService";
import type { GoldPriceData, TimeRange } from "@/types/gold";

interface GoldPriceState {
	data: GoldPriceData[];
	loading: boolean;
	error: Error | null;
}

const MINUTE = 60000;
const MAX_DATA_POINTS = 1000;

export function useGoldPrice(timeRange: TimeRange) {
	const [state, setState] = useState<GoldPriceState>({
		data: [],
		loading: true,
		error: null,
	});

	const processNewData = useCallback(
		(newData: GoldPriceData, prevData: GoldPriceData[]) => {
			const lastPoint = prevData[prevData.length - 1];
			if (!lastPoint) return [newData];

			const normalizedTimestamp =
				Math.floor(newData.timestamp / MINUTE) * MINUTE;

			// Update existing point if same timestamp
			if (lastPoint.timestamp === normalizedTimestamp) {
				return prevData.map((point) =>
					point.timestamp === normalizedTimestamp
						? {
								...point,
								price: newData.price,
								change: newData.change,
						  }
						: point
				);
			}

			// Fill missing points with interpolation
			const missingPoints = [];
			let currentTimestamp = lastPoint.timestamp + MINUTE;

			while (currentTimestamp < normalizedTimestamp) {
				const progress =
					(currentTimestamp - lastPoint.timestamp) /
					(normalizedTimestamp - lastPoint.timestamp);
				const interpolatedPrice =
					lastPoint.price +
					(newData.price - lastPoint.price) * progress;

				missingPoints.push({
					timestamp: currentTimestamp,
					price: Number(interpolatedPrice.toFixed(2)),
					change: 0,
					volume: 0,
					high: interpolatedPrice,
					low: interpolatedPrice,
					open: interpolatedPrice,
					close: interpolatedPrice,
				});

				currentTimestamp += MINUTE;
			}

			return [
				...prevData,
				...missingPoints,
				{ ...newData, timestamp: normalizedTimestamp },
			].slice(-MAX_DATA_POINTS);
		},
		[]
	);

	useEffect(() => {
		async function fetchHistoricalData() {
			try {
				const response = await GoldPriceService.getPrice(timeRange);
				if (response?.historicalData) {
					const sortedData = response.historicalData.sort(
						(a: { timestamp: number }, b: { timestamp: number }) =>
							a.timestamp - b.timestamp
					);
					setState((prev) => ({
						...prev,
						data: sortedData,
						loading: false,
					}));
				}
			} catch (err) {
				console.error("Error fetching historical data:", err);
				setState((prev) => ({
					...prev,
					error: err as Error,
					loading: false,
				}));
			}
		}

		setState((prev) => ({ ...prev, loading: true }));
		fetchHistoricalData();
	}, [timeRange]);

	// Real-time updates
	useEffect(() => {
		const eventSource = new EventSource("/api/gold/stream");

		eventSource.onmessage = (event) => {
			try {
				const newData = JSON.parse(event.data);
				setState((prev) => ({
					...prev,
					data: processNewData(newData, prev.data),
					error: null,
				}));
			} catch (err) {
				console.error("Error processing SSE data:", err);
			}
		};

		eventSource.onerror = () => {
			console.error("SSE connection error");
			eventSource.close();
			setState((prev) => ({
				...prev,
				error: new Error("Real-time connection lost"),
			}));
		};

		return () => eventSource.close();
	}, [processNewData]);

	return state;
}
