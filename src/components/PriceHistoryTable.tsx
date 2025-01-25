import { useGoldStore } from "@/hooks/useGoldStore";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ROWS_PER_PAGE = 10;

export function PriceHistoryTable() {
	const { dailyHistory, loading } = useGoldStore();
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(dailyHistory.length / ROWS_PER_PAGE);
	const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
	const paginatedData = dailyHistory.slice(
		startIndex,
		startIndex + ROWS_PER_PAGE
	);

	if (loading) {
		return <div className="p-4 text-center">Loading...</div>;
	}

	return (
		<div>
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
					{paginatedData.map((row) => (
						<TableRow key={row.date}>
							<TableCell>
								{new Date(row.date).toLocaleDateString("id-ID")}
							</TableCell>
							<TableCell className="text-right">
								${row.close.toFixed(2)}
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
									((row.close - row.open) / row.open) * 100 >=
									0
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{((row.close - row.open) / row.open) * 100 >= 0
									? "+"
									: ""}
								{(
									((row.close - row.open) / row.open) *
									100
								).toFixed(2)}
								%
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage((prev) => Math.max(prev - 1, 1))
					}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<div className="text-sm">
					Page {currentPage} of {totalPages}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
