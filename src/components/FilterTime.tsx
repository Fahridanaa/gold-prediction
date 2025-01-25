import { useGoldStore } from "@/hooks/useGoldStore";
import { TimeRange, CAGRTimeRange, MovingAverageTimeRange } from "@/types/gold";

type FilterMode = "historical" | "prediction";
type PredictionType = "CAGR" | "MovingAverage";

interface FilterTimeProps {
	mode: FilterMode;
	type?: PredictionType;
	className?: string;
}

const TIME_RANGES = {
	historical: [
		{ value: "today", label: "Today" },
		{ value: "1w", label: "1 Week" },
		{ value: "1m", label: "1 Month" },
		{ value: "3m", label: "3 Month" },
		{ value: "6m", label: "6 Month" },
		{ value: "ytd", label: "YTD" },
		{ value: "1y", label: "1 Year" },
		{ value: "5y", label: "5 Year" },
		{ value: "all", label: "All Time" },
	],
	prediction: {
		CAGR: [
			{ value: "1w", label: "1 Week" },
			{ value: "1m", label: "1 Month" },
			{ value: "3m", label: "3 Month" },
			{ value: "6m", label: "6 Month" },
		],
		MovingAverage: [
			{ value: "1w", label: "1 Week" },
			{ value: "1m", label: "1 Month" },
			{ value: "3m", label: "3 Month" },
			{ value: "6m", label: "6 Month" },
			{ value: "1y", label: "1 Year" },
			{ value: "5y", label: "5 Year" },
		],
	},
};

export function FilterTime({ mode, type, className = "" }: FilterTimeProps) {
	const {
		historicalFilter,
		predictionFilters,
		isMarketOpen,
		loading,
		setHistoricalFilter,
		setPredictionFilter,
	} = useGoldStore();

	const selectedRange =
		mode === "historical" ? historicalFilter : predictionFilters[type!];

	const handleRangeChange = (value: string) => {
		if (mode === "historical") {
			setHistoricalFilter(value as TimeRange);
		} else {
			setPredictionFilter(
				type as PredictionType,
				value as CAGRTimeRange | MovingAverageTimeRange
			);
		}
	};

	const ranges =
		mode === "historical"
			? TIME_RANGES.historical
			: TIME_RANGES.prediction[type!];

	return (
		<div
			className={`overflow-x-auto flex gap-2 scrollbar-hide ${className}`}
		>
			<div className="flex gap-2 md:gap-4">
				{ranges.map((range) => (
					<button
						key={range.value}
						onClick={() => handleRangeChange(range.value)}
						disabled={
							(mode === "historical" &&
								!isMarketOpen &&
								range.value === "today") ||
							loading
						}
						className={`whitespace-nowrap px-2 py-1 text-sm rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed ${
							selectedRange === range.value
								? "bg-primary text-primary-foreground"
								: "bg-secondary hover:bg-secondary/80"
						}`}
					>
						{range.label}
					</button>
				))}
			</div>
		</div>
	);
}
