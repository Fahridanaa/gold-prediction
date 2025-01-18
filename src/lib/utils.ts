import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isActivePath(currentPath: string, itemPath: string) {
	if (itemPath === "/dashboard" && currentPath === "/dashboard") {
		return true;
	}
	return currentPath.startsWith(itemPath) && itemPath !== "/dashboard";
}
