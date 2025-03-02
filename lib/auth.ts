import { auth, currentUser } from "@clerk/nextjs"
import { clerkClient } from "@clerk/nextjs"

export async function getUserRole() {
    const { userId, orgId } = auth()

    if (!userId || !orgId) {
        return { userId, organizationId: null, role: null }
    }

    try {
        const user = await clerkClient.users.getUser(userId)
        const orgMembership = user.organizationMemberships.find((mem) => mem.organization.id === orgId)

        return {
            userId,
            organizationId: orgId,
            role: orgMembership?.role || null,
        }
    } catch (error) {
        console.error("Error fetching user role:", error)
        return { userId, organizationId: orgId, role: null }
    }
}

export async function getCurrentUserDetails() {
    const user = await currentUser()
    const { orgId } = auth()

    if (!user) {
        return null
    }

    // Get the organization membership if available
    const organizationMembership = user.organizationMemberships?.find((mem) => mem.organization.id === orgId)

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        organizationId: orgId || null,
        role: organizationMembership?.role || null,
    }
}

