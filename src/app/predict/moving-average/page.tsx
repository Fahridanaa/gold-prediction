"use client";

import { InfoCard } from "@/components/InfoCard";
import { PriceChart } from "@/components/PriceChart";
import { Badge } from "@/components/ui/badge";
import { getPredictionEndDate, getPredictionPeriodText } from "@/lib/utils";
import { TimeRange } from "@/types/gold";
import { Separator } from "@radix-ui/react-separator";
import React, { useState } from "react";

const MovingAveragePage: React.FC = () => {
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

export default MovingAveragePage;
