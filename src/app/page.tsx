"use client";

import React from "react";
import { PriceCard } from "@/components/PriceCard";
import { PriceHistoryTable } from "@/components/PriceHistoryTable";
import { GoldPriceChart } from "@/components/GoldPriceChart";
import { useGoldStore } from "@/hooks/useGoldStore";

export default function Dashboard() {
	const { stats, loading } = useGoldStore();
	const { buyPrice, sellPrice, dailyHigh, dailyLow } = stats;

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
					<GoldPriceChart chartMode={"historical"} />
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
					<PriceHistoryTable/>
				</div>
			</section>
		</main>
	);
}
