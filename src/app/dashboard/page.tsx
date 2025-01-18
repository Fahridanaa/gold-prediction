"use client";

import React from "react";
import { PriceCard } from "@/components/PriceCard";
import { PriceChart } from "@/components/PriceChart";
import { PriceHistoryTable } from "@/components/PriceHistoryTable";

export default function Home() {
	return (
		<main className="p-4 sm:p-6 lg:p-8  mx-auto">
			<div className="flex flex-col lg:flex-row gap-4">
				<section className="flex-1 min-w-0 rounded-lg">
					<PriceChart className="w-full" />
				</section>
				<aside className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-80">
					<PriceCard title="Buy Price" price={12345.67} />
					<PriceCard title="Sell Price" price={8234.56} />
					<PriceCard title="Daily High" price={2345.67} />
					<PriceCard title="Daily Low" price={567.89} />
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
