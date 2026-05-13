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
import { cn } from '@/lib/utils';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className={cn(
                                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                isCurrentUrl(item.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-muted'
                            )}
                        >
                            <Link href={item.href} prefetch>
                                <div className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200',
                                    isCurrentUrl(item.href)
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                                )}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                </div>
                                <span>{item.title}</span>
                                {isCurrentUrl(item.href) && (
                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
