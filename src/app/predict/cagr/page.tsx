"use client";

import { InfoCard } from "@/components/InfoCard";
import { GoldPriceChart } from "@/components/GoldPriceChart";
import { PriceCard } from "@/components/PriceCard";
import { Badge } from "@/components/ui/badge";
import { useGoldStore } from "@/hooks/useGoldStore";
import { getPredictionEndDate, getPredictionPeriodText } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";

const CagrPage = () => {
	const { predictionSummary, loading, historicalFilter } = useGoldStore();

	return (
		<main className="p-4 mx-auto">
			<header className="text-2xl font-semibold mb-2">
				Prediksi Compound Average Growth Rate
				<Separator
					orientation="horizontal"
					className="h-0.5 bg-primary mb-4"
				/>
			</header>

			<article className="mb-4">
				<InfoCard description="Compounded annual growth rate (CAGR) adalah tingkat pertumbuhan per tahun selama rentang periode waktu tertentu. Prediksi CAGR bagus digunakan jika harga pertumbuhan emas memiliki tingkat grafik naik yang stabil atau konsisten. Prediksi CAGR ini juga bisa digunakan untuk melihat tren grafik yang sedang terjadi." />
			</article>

			<article className="flex flex-col gap-4">
				<header className="flex flex-col gap-2">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						Prediksi Laba
						<Badge
							variant="outline"
							className="text-xs font-normal"
						>
							{getPredictionPeriodText(historicalFilter)} Kedepan
						</Badge>
					</h2>
					<p className="text-sm text-muted-foreground">
						Sampai {getPredictionEndDate(historicalFilter)}
					</p>
				</header>

				<section className="min-h-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
					<PriceCard
						title="Lowest Price"
						price={predictionSummary.lowest_price}
						subtitle={loading ? "Loading..." : undefined}
					/>
					<PriceCard
						title="Highest Price"
						price={predictionSummary.highest_price}
						subtitle={loading ? "Loading..." : undefined}
					/>
					<PriceCard
						title="Average Price"
						price={predictionSummary.average_price}
						subtitle={loading ? "Loading..." : undefined}
						className="col-span-1 md:col-span-2 lg:col-span-1"
					/>
				</section>

				<section>
					<GoldPriceChart
						chartMode="prediction"
						predictionType="CAGR"
					/>
				</section>
			</article>
		</main>
	);
};

export default CagrPage;
