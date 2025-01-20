import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { isActivePath } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible";
import {
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
	SidebarMenu,
} from "@/components/ui/sidebar";

type MenuItemProps = {
	title: string;
	icon?: React.ComponentType;
	items?: Array<{ title: string; url: string }>;
};

export function CollapsibleSidebarMenuItem({
	title,
	icon: Icon,
	items,
}: MenuItemProps) {
	const pathname = usePathname();
	const isGroupActive = items?.some((item) =>
		isActivePath(pathname, item.url)
	);

	return (
		<SidebarMenu>
			<Collapsible asChild className="group/collapsible">
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton
							tooltip={title}
							className={
								isGroupActive
									? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
									: ""
							}
						>
							{Icon && <Icon />}
							<span>{title}</span>
							{items && (
								<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
							)}
						</SidebarMenuButton>
					</CollapsibleTrigger>
					{items && (
						<CollapsibleContent>
							<SidebarMenuSub>
								{items.map((subItem) => {
									const isActive = isActivePath(
										pathname,
										subItem.url
									);
									return (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton
												asChild
												className={
													isActive
														? "bg-primary text-primary-foreground"
														: ""
												}
											>
												<Link href={subItem.url}>
													<span>{subItem.title}</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									);
								})}
							</SidebarMenuSub>
						</CollapsibleContent>
					)}
				</SidebarMenuItem>
			</Collapsible>
		</SidebarMenu>
	);
}
