import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, ChartBarIncreasingIcon, ChevronDown, Settings } from "lucide-react"

import offices from "@/routes/offices"
import documentTypes from "@/routes/document-types"
import { NavItem } from "@/types"

export function SettingsDropdown({ items = [] }: { items: NavItem[] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48" align="start">
                <DropdownMenuLabel>Management</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {items.map((item) => (
                        <DropdownMenuItem asChild>

                            <Link key={item.title} href={item.href}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>

                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}