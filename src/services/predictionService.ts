import {
	fetchCagrPrediction,
	fetchMovingAveragePrediction,
} from "@/lib/api/prediction";
import { CAGRData, MovingAverageData, TimeRange } from "@/types/gold";

export class PredictionService {
	static async getCagrPrediction(timeRange: TimeRange) {
		const response: CAGRData = await fetchCagrPrediction(timeRange);
		if (!response) {
			throw new Error("Failed to fetch prediction");
		}
		return response;
	}

	static async getMovingAveragePrediction(timeRange: TimeRange) {
		const response: MovingAverageData = await fetchMovingAveragePrediction(
			timeRange
		);
		if (!response) {
			throw new Error("Failed to fetch prediction");
		}
		return response;
	}
}
