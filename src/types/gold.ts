export type TimeRange =
	| "today"
	| "1w"
	| "1m"
	| "3m"
	| "6m"
	| "ytd"
	| "1y"
	| "5y"
	| "all";

export type CAGRTimeRange = "1w" | "1m" | "3m" | "6m";
export type MovingAverageTimeRange = "1w" | "1m" | "3m" | "6m" | "1y" | "5y";

export interface GoldPriceData {
	timestamp: number;
	price: number;
	change: number;
	volume: number;
	high: number;
	low: number;
	open: number;
	close: number;
}

export interface DailyHistoryData {
	date: string;
	high: number;
	volume: number;
	open: number;
	low: number;
	close: number;
	adjClose?: number;
}

export interface PredictionData {
	CAGR: CAGRPredictionData[];
	MovingAverage: MovingAveragePredictionData[];
}

export interface PredictionSummary {
	total_days: number;
	date_start: string;
	date_end: string;
	lowest_price: number;
	highest_price: number;
	average_price: number;
}

export interface CAGRPredictionData {
	date: string;
	price: number;
}

export interface MovingAveragePredictionData {
	date: string;
	price: number;
	sma: number;
}

export interface CAGRData {
	close: number;
	date: string;
	prediction: Array<CAGRPredictionData>;
	prediction_summary: PredictionSummary;
}

export interface MovingAverageStatistics {
	sma_period: number;
	time_range: string;
	average_sma: number;
	last_sma: number;
	total_records: number;
}

export interface MovingAverageData {
	data: Array<MovingAveragePredictionData>;
	statistics: MovingAverageStatistics;
}
