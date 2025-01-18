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
	...props
}: PriceCardProps) {
	return (
		<Card className="rounded-lg border p-4 max-w-80" {...props}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">${price.toFixed(2)}</div>
				{subtitle && (
					<p className="text-xs text-muted-foreground">{subtitle}</p>
				)}
			</CardContent>
		</Card>
	);
}
