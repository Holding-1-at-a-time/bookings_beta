import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { verifyOrgAccess } from "./auth"
import { roles } from "./roles"

export const get = query({
    args: { organizationId: v.id("organizations") },
    async handler(ctx, args) {
        // Verify the user has access to this organization
        await verifyOrgAccess(ctx, args.organizationId)

        const organization = await ctx.db.get(args.organizationId)

        if (!organization) {
            return null
        }

        return organization
    },
})

export const getByClerkId = query({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        const organization = await ctx.db
            .query("organizations")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        return organization
    },
})

export const create = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        slug: v.string(),
        imageUrl: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const existingOrg = await ctx.db
            .query("organizations")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (existingOrg) {
            return existingOrg._id
        }

        return await ctx.db.insert("organizations", {
                    clerkId: args.clerkId,
                    name: args.name,
                    slug: args.slug,
                    imageUrl: args.imageUrl,
                });

    },
})

export const update = mutation({
    args: {
        clerkId: v.string(),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const { clerkId, ...updates } = args

        const existingOrg = await ctx.db
            .query("organizations")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .first()

        if (!existingOrg) {
            throw new Error("Organization not found")
        }

        await ctx.db.patch(existingOrg._id, updates)

        return existingOrg._id
    },
})

export const remove = mutation({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        const existingOrg = await ctx.db
            .query("organizations")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!existingOrg) {
            return null
        }

        // Remove all members from the organization
        const memberships = await ctx.db
            .query("organizationUsers")
            .withIndex("by_organization", (q) => q.eq("organizationId", existingOrg._id))
            .collect()

        for (const membership of memberships) {
            await ctx.db.delete(membership._id)
        }

        // Delete the organization
        await ctx.db.delete(existingOrg._id)

        return existingOrg._id
    },
})

export const addMember = mutation({
    args: {
        userId: v.id("users"),
        organizationId: v.id("organizations"),
        role: v.string(),
    },
    async handler(ctx, args) {
        const existingMembership = await ctx.db
            .query("organizationUsers")
            .withIndex("by_user_and_organization", (q) =>
                q.eq("userId", args.userId).eq("organizationId", args.organizationId),
            )
            .first()

        if (existingMembership) {
            // Update role if membership already exists
            await ctx.db.patch(existingMembership._id, { role: args.role })
            return existingMembership._id
        }

        return await ctx.db.insert("organizationUsers", {
                    userId: args.userId,
                    organizationId: args.organizationId,
                    role: args.role,
                });

    },
})

export const removeMember = mutation({
    args: {
        userId: v.id("users"),
        organizationId: v.id("organizations"),
    },
    async handler(ctx, args) {
        const membership = await ctx.db
            .query("organizationUsers")
            .withIndex("by_user_and_organization", (q) =>
                q.eq("userId", args.userId).eq("organizationId", args.organizationId),
            )
            .first()

        if (!membership) {
            return null
        }

        await ctx.db.delete(membership._id)

        return membership._id
    },
})

export const getMembers = query({
    args: { organizationId: v.id("organizations") },
    async handler(ctx, args) {
        // Verify the user has access to this organization
        await verifyOrgAccess(ctx, args.organizationId)

        const memberships = await ctx.db
            .query("organizationUsers")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
            .collect()

        // Get user details for each member
        return await Promise.all(
                    memberships.map(async (membership) => {
                        const user = await ctx.db.get(membership.userId)
                        return {
                            ...membership,
                            user,
                        }
                    }),
                );

    },
})

export const updateMemberRole = mutation({
    args: {
        organizationId: v.id("organizations"),
        userId: v.id("users"),
        role: v.string(),
    },
    async handler(ctx, args) {
        // Verify the user has admin access to this organization
        await verifyOrgAccess(ctx, args.organizationId, [roles.ADMIN])

        const membership = await ctx.db
            .query("organizationUsers")
            .withIndex("by_user_and_organization", (q) =>
                q.eq("userId", args.userId).eq("organizationId", args.organizationId),
            )
            .first()

        if (!membership) {
            throw new Error("Membership not found")
        }

        await ctx.db.patch(membership._id, { role: args.role })

        return membership._id
    },
})

