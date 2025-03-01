import type React from "react"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { OrganizationSwitcher } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId, orgId } = auth()

    if (!userId) {
        redirect("/sign-in")
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center">
                        <OrganizationSwitcher
                            hidePersonal
                            appearance={{
                                elements: {
                                    rootBox: "w-[200px]",
                                },
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "h-8 w-8",
                                },
                            }}
                            afterSignOutUrl="/"
                        />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
        </div>
    )
}

