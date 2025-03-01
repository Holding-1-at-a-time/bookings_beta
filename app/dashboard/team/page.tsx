import { OrganizationMembers } from "@/components/organization-members"
import { PendingInvitations } from "@/components/pending-invitations"
import { getUserRole } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TeamPage() {
    const { organizationId, role } = await getUserRole()

    if (!organizationId) {
        return redirect("/create-organization")
    }

    // Only admins can access the team management page
    if (role !== "org:admin") {
        return redirect("/dashboard")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                <p className="text-muted-foreground">Manage your team members and their roles.</p>
            </div>

            <div className="grid gap-6">
                <OrganizationMembers />
                <PendingInvitations />
            </div>
        </div>
    )
}

