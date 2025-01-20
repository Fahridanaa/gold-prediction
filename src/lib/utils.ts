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
