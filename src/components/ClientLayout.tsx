"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

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
					<header className="flex h-14 items-center border-b bg-background/95 px-4 lg:px-6">
						<div className="flex items-center gap-4">
							<SidebarTrigger />
							<Separator orientation="vertical" className="h-4" />
							<nav aria-label="Breadcrumb Navigation">
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbPage>
												Home
											</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</nav>
						</div>
					</header>
					<div className="flex-1 overflow-auto">{children}</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
