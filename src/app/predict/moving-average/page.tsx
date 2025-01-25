"use client";

import { GoldPriceChart } from "@/components/GoldPriceChart";
import { InfoCard } from "@/components/InfoCard";
import { Badge } from "@/components/ui/badge";
import { useGoldStore } from "@/hooks/useGoldStore";
import { getPredictionEndDate, getPredictionPeriodText } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import React from "react";

const MovingAveragePage: React.FC = () => {
	const { predictionFilters } = useGoldStore();

	return (
		<main className="p-4 mx-auto">
			<header className="text-2xl font-semibold mb-2">
				Prediksi Moving Average
				<Separator
					orientation="horizontal"
					className="h-0.5 bg-primary mb-4"
				/>
			</header>
			<article className="mb-4">
				<InfoCard description="Moving Average adalah indikator yang banyak digunakan untuk memperhalus pergerakan harga dengan menghilangkan beberapa fluktuasi harga yang kurang relevan berdasarkan perhitungan harga lampau, sehingga terbentuk garis rata-rata pergerakan harga dalam periode waktu tertentu. Indikator ini memiliki fungsi utama yaitu untuk mengetahui tren yang sedang berlaku." />
			</article>
			<article className="flex flex-col gap-4">
				<header className="flex flex-col gap-2">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						Prediksi Moving Average
						<Badge
							variant="outline"
							className="text-xs font-normal"
						>
							{getPredictionPeriodText(
								predictionFilters.MovingAverage
							)}{" "}
							Kedepan
						</Badge>
					</h2>
					<p className="text-sm text-muted-foreground">
						Sampai{" "}
						{getPredictionEndDate(predictionFilters.MovingAverage)}
					</p>
				</header>
				<section>
					<GoldPriceChart
						chartMode="prediction"
						predictionType="MovingAverage"
					/>
				</section>
			</article>
		</main>
	);
};

export default MovingAveragePage;
