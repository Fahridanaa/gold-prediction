import yahooFinance from "yahoo-finance2";
import type { GoldPriceData } from "@/types/gold";

export async function GET() {
	const encoder = new TextEncoder();
	let isStreamClosed = false;
	const INTERVAL = 60000;
	let lastValidData: GoldPriceData | null = null;

	const stream = new ReadableStream({
		start(controller) {
			const sendData = async () => {
				if (isStreamClosed) return;

				try {
					const result = await yahooFinance.quote("GC=F");

					if (
						!result ||
						typeof result.regularMarketPrice === "undefined"
					) {
						throw new Error("Invalid quote data received");
					}

					const now = Date.now();
					const normalizedTimestamp =
						Math.floor(now / INTERVAL) * INTERVAL;

					const data = {
						price: Number(result.regularMarketPrice) || 0,
						change: Number(result.regularMarketChangePercent) || 0,
						volume: Number(result.regularMarketVolume) || 0,
						high:
							Number(result.regularMarketDayHigh) ||
							result.regularMarketPrice,
						low:
							Number(result.regularMarketDayLow) ||
							result.regularMarketPrice,
						open:
							Number(result.regularMarketOpen) ||
							result.regularMarketPrice,
						close: Number(result.regularMarketPrice) || 0,
						timestamp: normalizedTimestamp,
					};

					// Store last valid data
					lastValidData = data;

					if (!isStreamClosed) {
						controller.enqueue(
							encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
						);
					}
				} catch (error) {
					console.error("Stream error:", error);
					if (lastValidData && !isStreamClosed) {
						controller.enqueue(
							encoder.encode(
								`data: ${JSON.stringify(lastValidData)}\n\n`
							)
						);
					}
				}
			};

			sendData();

			const intervalId = setInterval(sendData, INTERVAL);

			return () => {
				isStreamClosed = true;
				clearInterval(intervalId);
			};
		},
		cancel() {
			isStreamClosed = true;
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
