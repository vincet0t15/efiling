import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="w-5 h-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 flex-1 text-left text-sm">
                <div className="flex items-center tracking-wide">
                    <span className="text-blue-600 font-bold text-3xl italic">e</span>
                    <span className="text-orange-500 font-bold text-3xl text-wide">FILING</span>
                </div>
            </div>
        </>

    );
}
