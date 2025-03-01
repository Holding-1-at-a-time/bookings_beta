import { ConvexError } from "convex/values"
import type { MutationCtx, QueryCtx } from "convex/server"

// Helper function to get the current user ID from Clerk JWT
export async function getUserId(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
        return null
    }

    // Find the user in our database by their Clerk ID
    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first()

    if (!user) {
        return null
    }

    return user._id
}

// Helper function to get the current organization ID from Clerk JWT
export async function getOrgId(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
        return null
    }

    // Get the organization ID from the JWT
    const orgId = identity.tokenIdentifier.split(":")?.[2]

    if (!orgId) {
        return null
    }

    // Find the organization in our database by its Clerk ID
    const organization = await ctx.db
        .query("organizations")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", orgId))
        .first()

    if (!organization) {
        return null
    }

    return organization._id
}

// Helper function to check if a user has a specific role in an organization
export async function hasRole(ctx: QueryCtx | MutationCtx, organizationId: string, requiredRoles: string[]) {
    const userId = await getUserId(ctx)

    if (!userId) {
        return false
    }

    const membership = await ctx.db
        .query("organizationUsers")
        .withIndex("by_user_and_organization", (q) => q.eq("userId", userId).eq("organizationId", organizationId))
        .first()

    if (!membership) {
        return false
    }

    return requiredRoles.includes(membership.role)
}

// Helper function to verify a user has access to an organization
export async function verifyOrgAccess(ctx: QueryCtx | MutationCtx, organizationId: string, requiredRoles?: string[]) {
    const userId = await getUserId(ctx)

    if (!userId) {
        throw new ConvexError("Unauthorized: Not logged in")
    }

    // If no specific roles required, just check membership
    if (!requiredRoles || requiredRoles.length === 0) {
        const membership = await ctx.db
            .query("organizationUsers")
            .withIndex("by_user_and_organization", (q) => q.eq("userId", userId).eq("organizationId", organizationId))
            .first()

        if (!membership) {
            throw new ConvexError("Unauthorized: Not a member of this organization")
        }

        return { userId, organizationId, role: membership.role }
    }

    // Check for specific roles
    const hasRequiredRole = await hasRole(ctx, organizationId, requiredRoles)

    if (!hasRequiredRole) {
        throw new ConvexError(`Unauthorized: Required role(s) ${requiredRoles.join(", ")}`)
    }

    return { userId, organizationId, role: requiredRoles[0] }
}

