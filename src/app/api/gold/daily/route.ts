import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {
	try {
		const result = await yahooFinance.historical("GC=F", {
			period1: new Date("1970-01-01"),
			period2: new Date(),
			interval: "1d",
		});

		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch historical data",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
