import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            <Link href={item.href} prefetch>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover:bg-blue-100 dark:bg-neutral-800 dark:group-hover:bg-blue-900/30">
                                    {item.icon && (
                                        <item.icon className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-blue-600 dark:text-neutral-400 dark:group-hover:text-blue-400" />
                                    )}
                                </div>
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
