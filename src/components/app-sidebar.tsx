import { GalleryVerticalEnd, Home, TrendingUp } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { CollapsibleSidebarMenuItem } from "./collapsible-menu-item";
import { SidebarMenuItemComponent } from "./sidebar-menu-item-component";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Predict",
		icon: TrendingUp,
		items: [
			{
				title: "CAGR",
				url: "/predict/cagr",
			},
			{
				title: "Moving Average",
				url: "/predict/moving-average",
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" side="left" {...props}>
			<SidebarHeader>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<GalleryVerticalEnd className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							Learn Gold
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent className="space-y-2">
						{items.map((item) => {
							if (item.items) {
								return (
									<CollapsibleSidebarMenuItem
										key={item.title}
										{...item}
									/>
								);
							} else {
								return (
									<SidebarMenuItemComponent
										key={item.title}
										{...item}
									/>
								);
							}
						})}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
