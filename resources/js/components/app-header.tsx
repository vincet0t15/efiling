import { Link, usePage } from '@inertiajs/react';
import { FileText, FolderGit2, LayoutGrid, Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import documentTypes from '@/routes/document-types';
import documents from '@/routes/documents';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Documents',
        href: documents.index(),
        icon: FileText,
    },
    {
        title: 'Document Types',
        href: documentTypes.index(),
        icon: FolderGit2,
    },
];


export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            <div className="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/95 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-9 w-9"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-72 flex-col bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-950"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>
                                <SheetHeader className="mb-4 flex flex-row items-center justify-start gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
                                    <AppLogoIcon className="h-8 w-8" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                                            E-Filing
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            System
                                        </p>
                                    </div>
                                </SheetHeader>
                                <div className="flex flex-1 flex-col space-y-2">
                                    {mainNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                                isCurrentUrl(item.href)
                                                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                                                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className={cn(
                                                    'h-5 w-5 transition-colors duration-200',
                                                    isCurrentUrl(item.href)
                                                        ? 'text-primary dark:text-primary'
                                                        : 'text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                                                )} />
                                            )}
                                            <span>{item.title}</span>
                                            {isCurrentUrl(item.href) && (
                                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center gap-2 mr-4"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden h-full flex-1 items-center justify-center lg:flex ml-8">
                        <ul className="flex h-full items-center gap-1">
                            {mainNavItems.map((item) => (
                                <li key={item.title} className="relative h-full">
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex h-full items-center gap-2 px-4 text-sm font-medium transition-all duration-200',
                                            isCurrentUrl(item.href)
                                                ? 'text-primary'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {item.icon && (
                                            <item.icon className="h-4 w-4" />
                                        )}
                                        {item.title}
                                        {isCurrentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="ml-auto flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <Avatar className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-neutral-800">
                                        <AvatarImage
                                            src={auth.user?.avatar}
                                            alt={auth.user?.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                                            {getInitials(auth.user?.name ?? '')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="end">
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-neutral-200/50 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="mx-auto flex h-11 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
