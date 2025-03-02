import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getUserId } from "./auth"

export const get = query({
    args: { userId: v.optional(v.id("users")) },
    async handler(ctx, args) {
        const currentUserId = await getUserId(ctx)

        if (!currentUserId) {
            return null
        }

        const userId = args.userId || currentUserId

        // If querying for another user, verify they're in the same organization
        if (userId !== currentUserId) {
            const currentUserOrgs = await ctx.db
                .query("organizationUsers")
                .withIndex("by_user", (q) => q.eq("userId", currentUserId))
                .collect()

            const targetUserOrgs = await ctx.db
                .query("organizationUsers")
                .withIndex("by_user", (q) => q.eq("userId", userId))
                .collect()

            // Check if they share any organizations
            const sharedOrg = currentUserOrgs.some((currentUserOrg) =>
                targetUserOrgs.some((targetUserOrg) => targetUserOrg.organizationId === currentUserOrg.organizationId),
            )

            if (!sharedOrg) {
                return null
            }
        }

        const user = await ctx.db.get(userId)

        if (!user) {
            return null
        }

        return user
    },
})

export const getByClerkId = query({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        return await ctx.db
                    .query("users")
                    .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
                    .first();

    },
})

export const create = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (existingUser) {
            return existingUser._id
        }

        return await ctx.db.insert("users", {
                    clerkId: args.clerkId,
                    email: args.email,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    imageUrl: args.imageUrl,
                });

    },
})

export const update = mutation({
    args: {
        clerkId: v.string(),
        email: v.optional(v.string()),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const { clerkId, ...updates } = args

        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
            .first()

        if (!existingUser) {
            throw new Error("User not found")
        }

        await ctx.db.patch(existingUser._id, updates)

        return existingUser._id
    },
})

export const remove = mutation({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()

        if (!existingUser) {
            return null
        }

        // Remove user from all organizations
        const memberships = await ctx.db
            .query("organizationUsers")
            .withIndex("by_user", (q) => q.eq("userId", existingUser._id))
            .collect()

        for (const membership of memberships) {
            await ctx.db.delete(membership._id)
        }

        // Delete the user
        await ctx.db.delete(existingUser._id)

        return existingUser._id
    },
})

