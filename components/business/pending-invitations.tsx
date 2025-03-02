"use client"

import { useOrganization } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Mail, RefreshCw, XCircle } from "lucide-react"

export function PendingInvitations() {
    const { organization, isLoaded } = useOrganization()

    if (!isLoaded) {
        return <PendingInvitationsSkeleton />
    }

    const pendingInvitations = organization?.pendingInvitations || []

    const handleRevoke = async (invitationId: string) => {
        try {
            await organization?.revokePendingInvitation(invitationId)
            toast.success("Invitation revoked successfully")
        } catch (error) {
            console.error("Error revoking invitation:", error)
            toast.error("Failed to revoke invitation")
        }
    }

    const handleResend = async (invitationId: string) => {
        try {
            await organization?.resendPendingInvitation(invitationId)
            toast.success("Invitation resent successfully")
        } catch (error) {
            console.error("Error resending invitation:", error)
            toast.error("Failed to resend invitation")
        }
    }

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
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Manage invitations that have been sent but not yet accepted.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingInvitations.map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{invitation.emailAddress}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{getRoleName(invitation.role)}</Badge>
                                        <p className="text-xs text-muted-foreground">
                                            Sent: {new Date(invitation.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleResend(invitation.id)}>
                                    <RefreshCw className="mr-2 h-3 w-3" />
                                    Resend
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRevoke(invitation.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <XCircle className="mr-2 h-3 w-3" />
                                    Revoke
                                </Button>
                            </div>
                        </div>
                    ))}
                    {pendingInvitations.length === 0 && (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-sm text-muted-foreground">No pending invitations</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function PendingInvitationsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="mt-1 h-4 w-48" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-20" />
                                <Skeleton className="h-9 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

