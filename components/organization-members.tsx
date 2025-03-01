"use client"

import { useOrganization, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, UserPlus } from "lucide-react"
import { useState } from "react"
import { InviteMemberDialog } from "./invite-member-dialog"

export function OrganizationMembers() {
    const { organization, isLoaded } = useOrganization()
    const { user } = useUser()
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

    if (!isLoaded) {
        return <OrganizationMembersSkeleton />
    }

    const members = organization?.memberships || []
    const isAdmin = organization?.membership?.role === "org:admin"

    const getRoleName = (role: string) => {
        switch (role) {
            case "org:admin":
                return "Admin"
            case "org:detailer":
                return "Detailer"
            case "org:client":
                return "Client"
            default:
                return role
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team members and their roles.</CardDescription>
                </div>
                {isAdmin && (
                    <Button size="sm" className="flex items-center gap-1" onClick={() => setInviteDialogOpen(true)}>
                        <UserPlus className="h-4 w-4" />
                        <span>Invite</span>
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={member.publicUserData?.imageUrl} alt={member.publicUserData?.firstName || ""} />
                                    <AvatarFallback>{member.publicUserData?.firstName?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {member.publicUserData?.firstName} {member.publicUserData?.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{member.publicUserData?.identifier}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{getRoleName(member.role)}</Badge>
                                {isAdmin && member.publicUserData?.userId !== user?.id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    organization?.updateMembership({
                                                        userId: member.publicUserData?.userId || "",
                                                        role: "org:admin",
                                                    })
                                                }}
                                            >
                                                Make Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    organization?.updateMembership({
                                                        userId: member.publicUserData?.userId || "",
                                                        role: "org:detailer",
                                                    })
                                                }}
                                            >
                                                Make Detailer
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    organization?.updateMembership({
                                                        userId: member.publicUserData?.userId || "",
                                                        role: "org:client",
                                                    })
                                                }}
                                            >
                                                Make Client
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => {
                                                    organization?.removeMember(member.publicUserData?.userId || "")
                                                }}
                                            >
                                                Remove Member
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    ))}
                    {members.length === 0 && (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-sm text-muted-foreground">No team members yet</p>
                        </div>
                    )}
                </div>
            </CardContent>
            <InviteMemberDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
        </Card>
    )
}

function OrganizationMembersSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="mt-1 h-4 w-48" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

