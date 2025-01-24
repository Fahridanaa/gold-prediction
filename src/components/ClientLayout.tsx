"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className="flex flex-1 min-h-screen overflow-hidden">
				<AppSidebar />
				<div className="flex flex-col flex-1 w-full min-w-0">
					<div className="mt-2">
						<SidebarTrigger />
					</div>
					<div className="flex-1 overflow-auto">{children}</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
