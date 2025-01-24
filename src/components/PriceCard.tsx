import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HTMLAttributes } from "react";

interface PriceCardProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	price: number;
	subtitle?: string;
}

export function PriceCard({
	title,
	price,
	subtitle,
	className,
}: PriceCardProps) {
	return (
		<Card
			className={`flex flex-col items-center lg:items-stretch rounded-lg border p-4 ${className}`}
		>
			<CardHeader className="p-0">
				<CardTitle>
					<h3 className="text-xl">{title}</h3>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 flex-1 flex flex-col items-center justify-center">
				<div className="text-xl lg:text-3xl font-bold text-center">
					${price.toFixed(2)}
				</div>
				{subtitle && (
					<p className="text-xs text-muted-foreground">{subtitle}</p>
				)}
			</CardContent>
		</Card>
	);
}
