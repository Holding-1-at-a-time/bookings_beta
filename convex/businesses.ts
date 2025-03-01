import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getUserId, verifyOrgAccess } from "./auth"

export const create = mutation({
    args: {
        name: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zipCode: v.string(),
        phone: v.string(),
        email: v.string(),
        description: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const userId = await getUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const organizationId = await ctx.db
            .query("organizationUsers")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first()
            .then((org) => org?.organizationId)

        if (!organizationId) {
            throw new Error("User is not associated with any organization")
        }

        const businessId = await ctx.db.insert("businesses", {
            ...args,
            organizationId,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        return businessId
    },
})

export const getById = query({
    args: { businessId: v.id("businesses") },
    async handler(ctx, args) {
        const business = await ctx.db.get(args.businessId)
        if (!business) {
            return null
        }

        // Verify the user has access to this business
        await verifyOrgAccess(ctx, business.organizationId)

        return business
    },
})

export const update = mutation({
    args: {
        businessId: v.id("businesses"),
        name: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        zipCode: v.optional(v.string()),
        phone: v.optional(v.string()),
        email: v.optional(v.string()),
        description: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const { businessId, ...updates } = args

        const business = await ctx.db.get(businessId)
        if (!business) {
            throw new Error("Business not found")
        }

        // Verify the user has access to this business
        await verifyOrgAccess(ctx, business.organizationId)

        await ctx.db.patch(businessId, {
            ...updates,
            updatedAt: new Date().toISOString(),
        })

        return businessId
    },
})
