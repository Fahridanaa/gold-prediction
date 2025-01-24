import { TimeRange } from "@/types/gold";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isActivePath(currentPath: string, itemPath: string) {
	if (itemPath === "/" && currentPath === "/") {
		return true;
	}
	return currentPath.startsWith(itemPath) && itemPath !== "/";
}

export function getStartDate(range: string): Date {
	const now = new Date();
	switch (range) {
		case "today":
			return new Date(now.setHours(0, 0, 0, 0));
		case "1w":
			return new Date(now.setDate(now.getDate() - 7));
		case "1m":
			return new Date(now.setMonth(now.getMonth() - 1));
		default:
			return new Date(now.setHours(0, 0, 0, 0));
	}
}

export function getPredictionEndDate(range: TimeRange): string {
	const now = new Date();

	switch (range) {
		case "1w":
			now.setDate(now.getDate() + 7);
			break;
		case "1m":
			now.setMonth(now.getMonth() + 1);
			break;
		case "3m":
			now.setMonth(now.getMonth() + 3);
			break;
		case "6m":
			now.setMonth(now.getMonth() + 6);
			break;
		default:
			now.setDate(now.getDate() + 7);
	}

	return now.toLocaleDateString("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function getPredictionPeriodText(range: TimeRange): string {
	switch (range) {
		case "1w":
			return "7 Hari";
		case "1m":
			return "1 Bulan";
		case "3m":
			return "3 Bulan";
		case "6m":
			return "6 Bulan";
		default:
			return "7 Hari";
	}
}
