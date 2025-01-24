"use client";

import { InfoCard } from "@/components/InfoCard";
import { PriceCard } from "@/components/PriceCard";
import { PriceChart } from "@/components/PriceChart";
import { Badge } from "@/components/ui/badge";
import { getPredictionEndDate, getPredictionPeriodText } from "@/lib/utils";
import { TimeRange } from "@/types/gold";
import { Separator } from "@radix-ui/react-separator";
import React, { useState } from "react";

const CagrPage: React.FC = () => {
	const [selectedRange, setSelectedRange] = useState<TimeRange>("1w");
	const timeRanges: { value: TimeRange; label: string }[] = [
		{ value: "1w", label: "1 Week" },
		{ value: "1m", label: "1 Month" },
		{ value: "3m", label: "3 Month" },
		{ value: "6m", label: "6 Month" },
	] as const;

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
							{getPredictionPeriodText(selectedRange)} Kedepan
						</Badge>
					</h2>
					<p className="text-sm text-muted-foreground">
						Sampai {getPredictionEndDate(selectedRange)}
					</p>
				</header>
				<section className="min-h-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
					<PriceCard title="Lowest Price" price={5000} />
					<PriceCard title="Highest Price" price={5000} />
					<PriceCard
						title="Average Price"
						price={5000}
						className="col-span-1 md:col-span-2 lg:col-span-1 "
					/>
				</section>
				<section>
					<PriceChart
						timeRanges={timeRanges}
						selectedRange={selectedRange}
						onRangeChange={setSelectedRange}
					/>
				</section>
			</article>
		</main>
	);
};

export default CagrPage;
