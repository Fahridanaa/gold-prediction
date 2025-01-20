import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import type { TimeRange } from "@/types/gold";

function getDateRange(timeRange: TimeRange) {
	const end = new Date();
	const start = new Date();

	switch (timeRange) {
		case "today":
			start.setHours(0, 0, 0, 0);
			break;
		case "1w":
			start.setDate(start.getDate() - 7);
			break;
		case "1m":
			start.setMonth(start.getMonth() - 1);
			break;
		case "3m":
			start.setMonth(start.getMonth() - 3);
			break;
		case "6m":
			start.setMonth(start.getMonth() - 6);
			break;
		case "ytd":
			start.setMonth(0, 1);
			break;
		case "1y":
			start.setFullYear(start.getFullYear() - 1);
			break;
		case "5y":
			start.setFullYear(start.getFullYear() - 5);
			break;
		case "all":
			start.setFullYear(start.getFullYear() - 100);
			break;
		default:
			start.setDate(start.getDate() - 1);
	}

	return {
		period1: Math.floor(start.getTime() / 1000),
		period2: Math.floor(end.getTime() / 1000),
	};
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const timeRange = searchParams.get("range") as TimeRange;
		const { period1, period2 } = getDateRange(timeRange);

		const result = await yahooFinance.quote("GC=F");
		const chartResult = await yahooFinance.chart("GC=F", {
			period1,
			period2,
			interval:
				timeRange === "today"
					? "1m"
					: timeRange === "1w"
					? "15m"
					: timeRange === "1m"
					? "60m"
					: "1d",
		});

		if (!chartResult?.quotes || chartResult.quotes.length === 0) {
			return NextResponse.json(
				{
					error: "No data available",
					debug: { timeRange, period1, period2 },
				},
				{ status: 404 }
			);
		}

		const response = {
			currentPrice: result.regularMarketPrice || 0,
			historicalData: chartResult.quotes
				.filter((quote) => quote && quote.date && quote.close)
				.map((quote) => {
					const timestamp = new Date(quote.date).getTime();
					const close =
						quote.close !== null
							? Number(quote.close.toFixed(2))
							: 0;
					const open = Number(quote.open?.toFixed(2)) || close;
					const high = Number(quote.high?.toFixed(2)) || close;
					const low = Number(quote.low?.toFixed(2)) || close;
					const volume = Number(quote.volume) || 0;
					const change = open
						? Number((((close - open) / open) * 100).toFixed(2))
						: 0;

					return {
						timestamp,
						price: close,
						change,
						volume,
						high,
						low,
						open,
						close,
					};
				})
				.filter((data) => !isNaN(data.timestamp) && !isNaN(data.price)), // Filter invalid entries
		};

		return NextResponse.json(response);
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch gold price",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
