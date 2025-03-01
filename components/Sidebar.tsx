"use client";

import Link from 'next/link';
import type React from 'react';
import {
    Calendar,
    CreditCard,
    LayoutDashboard,
    Settings,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrganization, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { buttonVariants } from './ui/Button';
import LoadingSpinnerOne from './LoadingSpinnerOne';



interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items?: {
        href: string
        title: string
        icon: React.ReactNode
        roles?: string[]
    }[]
}

export function Sidebar({ className, ...props }: SidebarNavProps) {
    const pathname = usePathname()
    const { isLoaded, organization } = useOrganization()
    const { user } = useUser()
    const role = organization?.membership?.role

    // Define navigation items with role-based access
    const items = [
        {
            href: "/dashboard",
            title: "Dashboard",
            icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            roles: ["org:admin", "org:detailer", "org:client"],
        },
        {
            href: "/dashboard/admin",
            title: "Admin",
            icon: <Settings className="mr-2 h-4 w-4" />,
            roles: ["org:admin"],
        },
        {
            href: "/dashboard/detailer",
            title: "Detailer",
            icon: <Calendar className="mr-2 h-4 w-4" />,
            roles: ["org:admin", "org:detailer"],
        },
        {
            href: "/dashboard/appointments",
            title: "Appointments",
            icon: <Calendar className="mr-2 h-4 w-4" />,
            roles: ["org:admin", "org:detailer", "org:client"],
        },
        {
            href: "/dashboard/clients",
            title: "Clients",
            icon: <Users className="mr-2 h-4 w-4" />,
            roles: ["org:admin", "org:detailer"],
        },
        {
            href: "/dashboard/billing",
            title: "Billing",
            icon: <CreditCard className="mr-2 h-4 w-4" />,
            roles: ["org:admin"],
        },
    ]

    const filteredItems = items.filter((item) => !item.roles || !role || item.roles.includes(role))

    if (!isLoaded) {
        return <LoadingSpinnerOne />
    }

    return (
        <nav className={cn("w-[250px] flex-col border-r bg-background hidden md:flex", className)} {...props}>
            <div className="px-4 py-4">
                <h2 className="px-2 text-lg font-semibold tracking-tight">{organization?.name || "Smart Booking's"}</h2>
            </div>
            <div className="space-y-1 px-2">
                {filteredItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                            "justify-start",
                        )}
                    >
                        {item.icon}
                        {item.title}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

