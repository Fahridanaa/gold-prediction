import { create } from "zustand";
import type {
	CAGRPredictionData,
	CAGRTimeRange,
	DailyHistoryData,
	GoldPriceData,
	MovingAveragePredictionData,
	MovingAverageTimeRange,
	PredictionData,
	PredictionSummary,
	TimeRange,
} from "@/types/gold";

const MINUTE = 60000;
const MAX_DATA_POINTS = 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface GoldStore {
	historicalData: GoldPriceData[];
	filteredHistorical: GoldPriceData[];
	predictionData: PredictionData;
	filteredPredictions: PredictionData;
	predictionSummary: PredictionSummary;
	stats: {
		buyPrice: number;
		sellPrice: number;
		dailyHigh: number;
		dailyLow: number;
	};
	isMarketOpen: boolean;

	loading: boolean;
	error: Error | null;
	historicalFilter: TimeRange;
	predictionFilters: {
		CAGR: CAGRTimeRange;
		MovingAverage: MovingAverageTimeRange;
	};
	dailyHistory: DailyHistoryData[];
	setDailyHistory: (data: DailyHistoryData[]) => void;
	setHistoricalData: (data: GoldPriceData[]) => void;
	setPredictionData: (data: PredictionData) => void;
	updateRealtimeData: (newData: GoldPriceData) => void;
	setHistoricalFilter: (filter: TimeRange) => void;
	setPredictionFilter: (
		method: "CAGR" | "MovingAverage",
		filter: CAGRTimeRange | MovingAverageTimeRange
	) => void;
	setPredictionSummary: (data: PredictionSummary) => void;
	setStats: (data: GoldPriceData) => void;
	setMarketStatus: (isOpen: boolean) => void;
	setError: (error: Error | null) => void;
	setLoading: (loading: boolean) => void;
}

export const useGoldStore = create<GoldStore>((set) => ({
	historicalData: [],
	filteredHistorical: [],
	predictionSummary: {
		total_days: 0,
		date_start: "",
		date_end: "",
		lowest_price: 0,
		highest_price: 0,
		average_price: 0,
	},
	predictionData: { CAGR: [], MovingAverage: [] },
	filteredPredictions: { CAGR: [], MovingAverage: [] },
	stats: {
		buyPrice: 0,
		sellPrice: 0,
		dailyHigh: 0,
		dailyLow: 0,
	},
	isMarketOpen: false,
	loading: true,
	error: null,
	historicalFilter: "today",
	predictionFilters: { CAGR: "1w", MovingAverage: "1w" },
	dailyHistory: [],
	setDailyHistory: (data) => set({ dailyHistory: data }),
	setHistoricalData: (data) =>
		set((state) => ({
			historicalData: data,
			filteredHistorical: data.filter((item) =>
				applyFilter(item, state.historicalFilter)
			),
		})),

	setPredictionData: (data) =>
		set((state) => ({
			predictionData: data,
			filteredPredictions: {
				CAGR: data.CAGR.filter((item) =>
					applyPredictionFilter(item, state.predictionFilters.CAGR)
				),
				MovingAverage: data.MovingAverage,
			},
		})),

	updateRealtimeData: (newData) =>
		set((state) => {
			const processedData = processNewData(newData, state.historicalData);
			return {
				historicalData: processedData,
				filteredHistorical: processedData.filter((item) =>
					applyFilter(item, state.historicalFilter)
				),
			};
		}),

	setHistoricalFilter: (filter: TimeRange) =>
		set((state) => ({
			historicalFilter: filter,
			filteredHistorical: state.historicalData.filter((item) =>
				applyFilter(item, filter)
			),
		})),

	setPredictionFilter: (
		method: "CAGR" | "MovingAverage",
		filter: CAGRTimeRange | MovingAverageTimeRange
	) =>
		set((state) => ({
			predictionFilters: { ...state.predictionFilters, [method]: filter },
			filteredPredictions: {
				...state.filteredPredictions,
				[method]: state.predictionData[method].filter((item) =>
					applyPredictionFilter(item, filter)
				),
			},
		})),

	setPredictionSummary: (data) => set({ predictionSummary: data }),

	setStats: (data) =>
		set(() => ({
			stats: {
				buyPrice: Number(data.price) + 1,
				sellPrice: Number(data.price) - 1,
				dailyHigh: Number(data.high),
				dailyLow: Number(data.low),
			},
		})),
	setMarketStatus: (isOpen) => set({ isMarketOpen: isOpen }),

	setError: (error) => set({ error }),
	setLoading: (loading) => set({ loading }),
}));

function applyFilter(item: GoldPriceData, filter: string) {
	const now = Date.now();
	const date = item.timestamp;

	switch (filter) {
		case "1w":
			return now - date <= 7 * MS_PER_DAY;
		case "1m":
			return now - date <= 30 * MS_PER_DAY;
		case "3m":
			return now - date <= 90 * MS_PER_DAY;
		case "6m":
			return now - date <= 180 * MS_PER_DAY;
		case "1y":
			return now - date <= 365 * MS_PER_DAY;
		case "5y":
			return now - date <= 5 * 365 * MS_PER_DAY;
		case "all":
		default:
			return true;
	}
}

function applyPredictionFilter(
	item: CAGRPredictionData | MovingAveragePredictionData,
	filter: string
) {
	const now = new Date();
	const date = new Date(item.date).getTime();
	switch (filter) {
		case "1w":
			return now.getTime() - date <= 7 * MS_PER_DAY;
		case "1m":
			return now.getTime() - date <= 30 * MS_PER_DAY;
		case "3m":
			return now.getTime() - date <= 90 * MS_PER_DAY;
		case "6m":
			return now.getTime() - date <= 180 * MS_PER_DAY;
		default:
			return true;
	}
}

function processNewData(newData: GoldPriceData, prevData: GoldPriceData[]) {
	const lastPoint = prevData[prevData.length - 1];
	if (!lastPoint) return [newData];

	const normalizedTimestamp = Math.floor(newData.timestamp / MINUTE) * MINUTE;

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

	const missingPoints = [];
	let currentTimestamp = lastPoint.timestamp + MINUTE;

	while (currentTimestamp < normalizedTimestamp) {
		const progress =
			(currentTimestamp - lastPoint.timestamp) /
			(normalizedTimestamp - lastPoint.timestamp);
		const interpolatedPrice =
			lastPoint.price + (newData.price - lastPoint.price) * progress;

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
}
