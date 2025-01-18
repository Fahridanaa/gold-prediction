import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface PriceHistory {
	date: string;
	last: number;
	open: number;
	high: number;
	low: number;
	volume: number;
	change: number;
}

const dummyData: PriceHistory[] = Array.from({ length: 10 }, (_, i) => {
	const date = new Date();
	date.setDate(date.getDate() - i);
	const basePrice = 2740.34;

	return {
		date: date.toISOString(),
		last: basePrice + (Math.random() - 0.5) * 20,
		open: basePrice + (Math.random() - 0.5) * 20,
		high: basePrice + Math.random() * 20,
		low: basePrice - Math.random() * 20,
		volume: Math.floor(Math.random() * 1000000),
		change: (Math.random() - 0.5) * 4,
	};
});

export function PriceHistoryTable() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Tanggal</TableHead>
					<TableHead className="text-right">Terakhir</TableHead>
					<TableHead className="text-right">Pembukaan</TableHead>
					<TableHead className="text-right">Tertinggi</TableHead>
					<TableHead className="text-right">Terendah</TableHead>
					<TableHead className="text-right">Vol.</TableHead>
					<TableHead className="text-right">Perubahan%</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{dummyData.map((row) => (
					<TableRow key={row.date}>
						<TableCell>
							{new Date(row.date).toLocaleDateString("id-ID")}
						</TableCell>
						<TableCell className="text-right">
							${row.last.toFixed(2)}
						</TableCell>
						<TableCell className="text-right">
							${row.open.toFixed(2)}
						</TableCell>
						<TableCell className="text-right">
							${row.high.toFixed(2)}
						</TableCell>
						<TableCell className="text-right">
							${row.low.toFixed(2)}
						</TableCell>
						<TableCell className="text-right">
							{row.volume.toLocaleString()}
						</TableCell>
						<TableCell
							className={`text-right ${
								row.change >= 0
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							{row.change >= 0 ? "+" : ""}
							{row.change.toFixed(2)}%
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
