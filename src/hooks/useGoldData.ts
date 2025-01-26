import useSWR, { mutate } from "swr";
import { useEffect } from "react";
import { useGoldStore } from "./useGoldStore";
import { GoldPriceService } from "@/services/goldPriceService";
import { PredictionService } from "@/services/predictionService";
import type { TimeRange, CAGRTimeRange } from "@/types/gold";

const isMarketOpen = () => {
	const now = new Date();
	const day = now.getDay();
	const hour = now.getUTCHours();

	if (day === 0) return false;

	if (day === 6 && hour >= 13) return false;

	return true;
};

const fetchCAGRPrediction = async (filter: CAGRTimeRange) => {
	return await PredictionService.getCagrPrediction(filter);
};

const fetchMovingAveragePrediction = async (filter: TimeRange) => {
	return await PredictionService.getMovingAveragePrediction(filter);
};

const fetcher = async (filter: TimeRange) => {
	const response = await GoldPriceService.getPrice(filter);
	return (
		response?.historicalData?.sort(
			(a: { timestamp: number }, b: { timestamp: number }) =>
				a.timestamp - b.timestamp
		) || []
	);
};

export function useGoldData() {
	const {
		setHistoricalData,
		updateRealtimeData,
		setDailyHistory,
		setPredictionData,
		setStats,
		setMarketStatus,
		setError,
		setLoading,
		setPredictionSummary,
		setHistoricalFilter,
		historicalFilter,
		predictionFilters,
		predictionData,
	} = useGoldStore();

	const { data, error } = useSWR(
		`gold-price-${historicalFilter}`,
		() => fetcher(historicalFilter),
		{
			refreshInterval: 0,
			revalidateOnFocus: false,
			onSuccess: (data) => {
				setHistoricalData(data);
				setLoading(false);
			},
			onError: (err) => {
				setError(err as Error);
				setLoading(false);
			},
			shouldRetryOnError: false,
		}
	);

	useEffect(() => {
		async function fetchDailyHistory() {
			try {
				const data = await GoldPriceService.getDailyHistory();
				const sortedData = data.sort(
					(a: { date: string }, b: { date: string }) =>
						new Date(b.date).getTime() - new Date(a.date).getTime()
				);
				setDailyHistory(sortedData);
			} catch (error) {
				console.error("Failed to fetch daily history:", error);
				setError(error as Error);
			}
		}

		fetchDailyHistory();
	}, [setDailyHistory, setError]);

	const { isLoading: isPredictionLoading } = useSWR(
		`prediction-${predictionFilters.CAGR}`,
		() => fetchCAGRPrediction(predictionFilters.CAGR),
		{
			revalidateOnFocus: false,
			onSuccess: (data) => {
				setPredictionData({ ...predictionData, CAGR: data.prediction });
				setPredictionSummary(data.prediction_summary);
				const newFilter = predictionFilters.CAGR === "1w" ? "3m" : "5y";
				setHistoricalFilter(newFilter);
				setLoading(false);
			},
			onError: (err) => {
				setError(err);
				setLoading(false);
			},
			shouldRetryOnError: false,
		}
	);

	const { isLoading: isMALoading } = useSWR(
		`ma-prediction-${predictionFilters.MovingAverage}`,
		() => fetchMovingAveragePrediction(predictionFilters.MovingAverage),
		{
			revalidateOnFocus: false,
			onSuccess: (data) => {
				setPredictionData({
					...predictionData,
					MovingAverage: data.data,
				});
				setHistoricalFilter(predictionFilters.MovingAverage);
				setLoading(false);
			},
			onError: (err) => {
				setError(err);
				setLoading(false);
			},
		}
	);

	useEffect(() => {
		const checkMarket = () => {
			const marketOpen = isMarketOpen();
			setMarketStatus(marketOpen);
		};

		checkMarket();
		const interval = setInterval(checkMarket, 60000);

		return () => clearInterval(interval);
	}, [setMarketStatus]);

	useEffect(() => {
		if (isPredictionLoading || isMALoading) {
			setLoading(true);
		}
	}, [isMALoading, isPredictionLoading, setLoading]);

	useEffect(() => {
		if (!isMarketOpen()) return;
		const eventSource = new EventSource("/api/gold/stream");

		eventSource.onmessage = async (event) => {
			try {
				const newData = JSON.parse(event.data);
				updateRealtimeData(newData);
				setStats(newData);

				await mutate(`gold-price-${historicalFilter}`);
			} catch (err) {
				console.error("Error processing SSE data:", err);
			}
		};

		eventSource.onerror = () => {
			console.error("SSE connection error");
			eventSource.close();
			setError(new Error("Real-time connection lost"));
		};

		return () => eventSource.close();
	}, [historicalFilter, setError, setStats, updateRealtimeData]);

	return {
		data,
		error,
	};
}
