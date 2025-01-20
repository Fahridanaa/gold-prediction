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
