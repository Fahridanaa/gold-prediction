import { usePathname } from "next/navigation";
import Link from "next/link";
import { isActivePath } from "@/lib/utils";
import {
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenu,
} from "@/components/ui/sidebar";

type MenuItemProps = {
	title: string;
	url: string;
	icon?: React.ComponentType;
};

export function SidebarMenuItemComponent({
	title,
	url,
	icon: Icon,
}: MenuItemProps) {
	const pathname = usePathname();
	const isActive = isActivePath(pathname, url);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					className={
						isActive ? "bg-primary text-primary-foreground" : ""
					}
				>
					<Link href={url}>
						{Icon && <Icon />}
						<span>{title}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
