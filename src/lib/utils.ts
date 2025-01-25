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
		case "3m":
			return new Date(now.setMonth(now.getMonth() - 3));
		case "6m":
			return new Date(now.setMonth(now.getMonth() - 6));
		case "ytd":
			return new Date(now.setMonth(0, 1));
		case "1y":
			return new Date(now.setFullYear(now.getFullYear() - 1));
		case "5y":
			return new Date(now.setFullYear(now.getFullYear() - 5));
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
		case "1y":
			now.setFullYear(now.getFullYear() + 1);
			break;
		case "5y":
			now.setFullYear(now.getFullYear() + 5);
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
		case "1y":
			return "1 Tahun";
		case "5y":
			return "5 Tahun";
		default:
			return "7 Hari";
	}
}
