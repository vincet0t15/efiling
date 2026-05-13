import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sidebar-primary-foreground shadow-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-sidebar-foreground">
                    E-Filing
                </span>
                <span className="truncate text-xs font-medium text-sidebar-foreground/70">
                    System
                </span>
            </div>
        </>
    );
}
