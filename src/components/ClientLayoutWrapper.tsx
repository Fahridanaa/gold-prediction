"use client";

import { useGoldData } from "@/hooks/useGoldData";
import dynamic from "next/dynamic";

const ClientLayout = dynamic(() => import("@/components/ClientLayout"), {
	ssr: false,
});

export default function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	useGoldData();
	return <ClientLayout>{children}</ClientLayout>;
}
