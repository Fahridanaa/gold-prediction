import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TrendIndicator {
	color: string;
	label: string;
}

interface InfoCardProps {
	title?: string;
	description: string;
	indicators?: TrendIndicator[];
	className?: string;
}

export function InfoCard({
	title = "Note",
	description,
	indicators = [
		{ color: "bg-green-400", label: "Trend sedang naik." },
		{
			color: "bg-orange-400",
			label:
				"Harga turun lebih dari 10%, waktu yang pas untuk mencicil investasi.",
		},
		{ color: "bg-red-400", label: "Trend sedang turun." },
	],
	className,
}: InfoCardProps) {
	return (
		<Card className={`p-4 ${className}`}>
			<CardHeader className="inline-block p-2">
				<Badge variant="default" className="bg-gray-500 text-white">
					{title}
				</Badge>
			</CardHeader>
			<CardContent className="p-2">
				<p className="font-semibold">{description}</p>
				<div className="inline-block mt-2 text-sm text-muted-foreground">
					{indicators.map((indicator, index) => (
						<div key={index} className="flex items-center gap-2">
							<div
								className={`min-w-6 h-4 inline-block ${indicator.color}`}
							></div>
							<span>{indicator.label}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
