import { useGoldStore } from "@/hooks/useGoldStore";
import type {
	CAGRTimeRange,
	GoldPriceData,
	MovingAverageTimeRange,
	PredictionData,
	TimeRange,
} from "@/types/gold";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
} from "./ui/card";
import {
	Area,
	CartesianGrid,
	ComposedChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	ReferenceLine,
	Line,
} from "recharts";
import { FilterTime } from "./FilterTime";
import { Badge } from "./ui/badge";

interface GoldPriceChartProps {
	chartMode: "historical" | "prediction";
	predictionType?: "CAGR" | "MovingAverage";
}

const formatTimestamp = (
	timestamp: number,
	range: TimeRange | CAGRTimeRange | MovingAverageTimeRange
) => {
	const date = new Date(timestamp);
	switch (range) {
		case "today":
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
		case "1w":
			return date.toLocaleDateString([], {
				weekday: "short",
				hour: "2-digit",
				hour12: false,
			});
		case "1m":
			return date.toLocaleDateString([], {
				month: "short",
				day: "numeric",
			});
		case "3m":
		case "6m":
			return date.toLocaleDateString([], {
				month: "short",
				day: "numeric",
			});
		case "1y":
		case "5y":
			return date.toLocaleDateString([], {
				month: "short",
				year: "2-digit",
			});
		default:
			return date.toLocaleDateString();
	}
};

const processChartData = (
	chartMode: "historical" | "prediction",
	historical: GoldPriceData[],
	predictions: PredictionData,
	type?: "CAGR" | "MovingAverage"
) => {
	if (chartMode === "historical") {
		return historical;
	}

	if (type === "CAGR") {
		return [
			...historical,
			...predictions.CAGR.map((d) => ({
				timestamp: new Date(d.date).getTime(),
				price: d.price,
				isPredicted: true,
			})),
		].sort((a, b) => a.timestamp - b.timestamp);
	}

	if (type === "MovingAverage") {
		return [
			...historical,
			...predictions.MovingAverage.map((d) => ({
				timestamp: new Date(d.date).getTime(),
				price: d.price,
				sma: d.sma,
				isPredicted: true,
			})),
		].sort((a, b) => a.timestamp - b.timestamp);
	}

	return historical;
};

export const GoldPriceChart = ({
	chartMode,
	predictionType,
}: GoldPriceChartProps) => {
	const {
		filteredHistorical,
		filteredPredictions,
		historicalData,
		historicalFilter,
		predictionFilters,
		isMarketOpen,
		loading,
	} = useGoldStore();

	const lastKnownDate = historicalData[historicalData.length - 1]?.timestamp;

	const chartData = processChartData(
		chartMode,
		filteredHistorical,
		filteredPredictions,
		predictionType
	);

	return (
		<Card className="w-full">
			<CardHeader className="pb-0">
				<CardTitle>
					<div className="inline-block">
						<h2 className="inline mr-4">
							{chartMode === "historical"
								? "Gold Price"
								: predictionType === "CAGR"
								? "CAGR Prediction"
								: "Moving Average Prediction"}
						</h2>
						{!isMarketOpen && chartMode !== "prediction" && (
							<Badge
								variant="destructive"
								className="text-white cursor-default"
							>
								Market Closed
							</Badge>
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-2 md:p-6 min-h-[28rem]">
				{loading ? (
					<div>Loading Data...</div>
				) : (
					<ResponsiveContainer width="100%" height={400}>
						<ComposedChart data={chartData}>
							<defs>
								<linearGradient
									id="colorPrice"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="hsl(var(--primary))"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="hsl(var(--primary))"
										stopOpacity={0}
									/>
								</linearGradient>
								<linearGradient
									id="colorPrediction"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="hsl(var(--chart-1))"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="hsl(var(--chart-1))"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="timestamp"
								type="number"
								domain={["dataMin", "dataMax"]}
								scale="time"
								tickFormatter={(timestamp) => {
									return chartMode === "historical"
										? formatTimestamp(
												timestamp,
												historicalFilter
										  )
										: formatTimestamp(
												timestamp,
												predictionFilters[
													predictionType!
												]
										  );
								}}
								className="text-xs"
							/>
							<YAxis
								domain={["auto", "auto"]}
								tickFormatter={(value) =>
									`$${value.toFixed(2)}`
								}
								className="text-xs"
							/>
							<Tooltip
								content={({ active, payload }) => {
									if (active && payload?.[0]) {
										const data = payload[0].payload;
										return (
											<div className="rounded-lg bg-background p-2 shadow-md border">
												<div className="font-medium">
													${data.price.toFixed(2)}
												</div>
												<div className="text-xs text-muted-foreground">
													{historicalFilter ===
														"today" &&
													chartMode === "historical"
														? new Date(
																data.timestamp
														  ).toLocaleTimeString(
																[],
																{
																	hour:
																		"2-digit",
																	minute:
																		"2-digit",
																	hour12: false,
																}
														  )
														: new Date(
																data.timestamp
														  ).toLocaleDateString(
																[],
																{
																	year:
																		"numeric",
																	month:
																		"short",
																	day:
																		"numeric",
																}
														  )}
												</div>
												{data.isPredicted && (
													<div className="text-xs text-warning">
														{data.method} Prediction
													</div>
												)}
											</div>
										);
									}
									return null;
								}}
							/>
							{chartMode === "prediction" &&
								predictionType === "CAGR" && (
									<ReferenceLine
										x={lastKnownDate}
										stroke="hsl(var(--muted-foreground))"
										strokeDasharray="3 3"
										label={{
											value: "Current",
											position: "insideTop",
										}}
									/>
								)}

							{chartMode === "historical" && (
								<Area
									type="monotone"
									dataKey="price"
									stroke="hsl(var(--primary))"
									fill="url(#colorPrice)"
									fillOpacity={0.1}
								/>
							)}

							{chartMode === "prediction" &&
								predictionType === "CAGR" && (
									<Area
										type="monotone"
										dataKey="price"
										data={[
											...chartData.filter(
												(d) => !("isPredicted" in d)
											),
											chartData.find(
												(d) =>
													!("isPredicted" in d) &&
													d.timestamp ===
														lastKnownDate
											),
										].filter(Boolean)}
										stroke="hsl(var(--primary))"
										fill="url(#colorPrice)"
										fillOpacity={0.3}
										connectNulls
									/>
								)}
							{chartMode === "prediction" &&
								predictionType === "CAGR" && (
									<Area
										type="monotone"
										dataKey="price"
										stroke="hsl(var(--chart-1))"
										data={[
											chartData.find(
												(d) =>
													!("isPredicted" in d) &&
													d.timestamp ===
														lastKnownDate
											),
											...chartData.filter(
												(d) => "isPredicted" in d
											),
										].filter(Boolean)}
										fill="url(#colorPrediction)"
										fillOpacity={0.3}
										connectNulls
									/>
								)}

							{chartMode === "prediction" &&
								predictionType === "MovingAverage" && (
									<Area
										type="monotone"
										dataKey="price"
										data={chartData.filter(
											(d) => !("isPredicted" in d)
										)}
										stroke="hsl(var(--primary))"
										fill="url(#colorPrice)"
										fillOpacity={0.3}
										connectNulls
									/>
								)}

							{chartMode === "prediction" &&
								predictionType === "MovingAverage" && (
									<Area
										type="monotone"
										dataKey="price"
										data={chartData.filter(
											(d) => "isPredicted" in d
										)}
										stroke="hsl(var(--chart-1))"
										fill="url(#colorPrediction)"
										fillOpacity={0.3}
										connectNulls
									/>
								)}
							{chartMode === "prediction" &&
								predictionType === "MovingAverage" && (
									<Line
										type="monotone"
										dataKey="sma"
										stroke="hsl(var(--chart-2))"
										strokeWidth={2}
										dot={false}
										strokeDasharray="5 5"
									/>
								)}
						</ComposedChart>
					</ResponsiveContainer>
				)}
			</CardContent>
			<CardFooter>
				<FilterTime mode={chartMode} type={predictionType} />
			</CardFooter>
		</Card>
	);
};
