"use client";

import React, { useState } from "react";
import { PriceCard } from "@/components/PriceCard";
import { PriceChart } from "@/components/PriceChart";
import { PriceHistoryTable } from "@/components/PriceHistoryTable";
import { useGoldStats } from "@/hooks/useGoldStats";
import { TimeRange } from "@/types/gold";

export default function Home() {
	const {
		buyPrice,
		sellPrice,
		dailyHigh,
		dailyLow,
		loading,
	} = useGoldStats();

	const [selectedRange, setSelectedRange] = useState<TimeRange>("today");

	const timeRanges: { value: TimeRange; label: string }[] = [
		{ value: "today", label: "Today" },
		{ value: "1w", label: "1 Week" },
		{ value: "1m", label: "1 Month" },
		{ value: "3m", label: "3 Month" },
		{ value: "6m", label: "6 Month" },
		{ value: "ytd", label: "YTD" },
		{ value: "1y", label: "1 Year" },
		{ value: "5y", label: "5 Year" },
		{ value: "all", label: "All Time" },
	] as const;

	return (
		<main className="p-4 mx-auto">
			<header className="text-2xl font-semibold mb-2">
				Dashboard -
				<select className="ml-1 bg-transparent border-b border-primary px-2">
					<option value="gold">Gold</option>
				</select>
			</header>
			<div className="flex flex-col lg:flex-row gap-4">
				<section className="flex-1 min-w-0 rounded-lg">
					<PriceChart
						timeRanges={timeRanges}
						selectedRange={selectedRange}
						onRangeChange={setSelectedRange}
					/>
				</section>
				<aside className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-52">
					<PriceCard
						title="Buy Price"
						price={buyPrice}
						subtitle={loading ? "Loading..." : undefined}
					/>
					<PriceCard
						title="Sell Price"
						price={sellPrice}
						subtitle={loading ? "Loading..." : undefined}
					/>
					<PriceCard
						title="Daily High"
						price={dailyHigh}
						subtitle={loading ? "Loading..." : undefined}
					/>
					<PriceCard
						title="Daily Low"
						price={dailyLow}
						subtitle={loading ? "Loading..." : undefined}
					/>
				</aside>
			</div>

			<section className="mt-6 rounded-lg border">
				<div className="overflow-x-auto">
					<PriceHistoryTable />
				</div>
			</section>
		</main>
	);
}
