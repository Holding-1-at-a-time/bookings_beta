import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { verifyOrgAccess, getUserId } from "./auth"
import { roles } from "./roles"

export const getByOrganization = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    async handler(ctx, args) {
        // Verify the user has access to this organization
        const { role } = await verifyOrgAccess(ctx, args.organizationId)

        let appointmentsQuery = ctx.db
            .query("appointments")
            .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))

        // Apply date filters if provided
        if (args.startDate && args.endDate) {
            appointmentsQuery = ctx.db
                .query("appointments")
                .withIndex("by_organization_and_time", (q) =>
                    q.eq("organizationId", args.organizationId).gte("startTime", args.startDate).lte("startTime", args.endDate),
                )
        }

        // For detailers, only show their own appointments unless they're also an admin
        if (role === roles.DETAILER) {
            const userId = await getUserId(ctx)

            if (!userId) return []

            appointmentsQuery = appointmentsQuery.filter((q) => q.eq(q.field("detailerId"), userId))
        }

        // For clients, only show their own appointments
        if (role === roles.CLIENT) {
            const userId = await getUserId(ctx)

            if (!userId) return []

            appointmentsQuery = appointmentsQuery.filter((q) => q.eq(q.field("clientId"), userId))
        }

        const appointments = await appointmentsQuery.collect()

        return appointments
    },
})

export const getByClient = query({
    args: {
        clientId: v.optional(v.id("users")),
    },
    async handler(ctx, args) {
        const userId = await getUserId(ctx)

        if (!userId) {
            return []
        }

        // If specific clientId provided, verify access
        const clientId = args.clientId || userId

        // If querying for another user, verify admin access
        if (clientId !== userId) {
            const appointment = await ctx.db
                .query("appointments")
                .withIndex("by_client", (q) => q.eq("clientId", clientId))
                .first()

            if (appointment) {
                await verifyOrgAccess(ctx, appointment.organizationId, [roles.ADMIN, roles.DETAILER])
            }
        }

        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_client", (q) => q.eq("clientId", clientId))
            .collect()

        return appointments
    },
})

export const create = mutation({
    args: {
        organizationId: v.id("organizations"),
        serviceId: v.id("services"),
        clientId: v.optional(v.id("users")),
        detailerId: v.optional(v.id("users")),
        startTime: v.string(),
        endTime: v.string(),
        notes: v.optional(v.string()),
    },
    async handler(ctx, args) {
        // Check for conflicting appointments
        const conflictingAppointment = await ctx.db
            .query("appointments")
            .withIndex("by_organization", q => q.eq("organizationId", args.organizationId))
            .filter(q => 
                (q.eq(q.field("detailerId"), args.detailerId) || q.eq(q.field("clientId"), args.clientId))
                && q.lt(q.field("endTime"), args.startTime)
                && q.gt(q.field("startTime"), args.endTime)
            )
            .first();
        
        if (conflictingAppointment) {
            throw new Error("Time slot conflicts with existing appointment");
        }
    async handler(ctx, args) {
        // Check for conflicting appointments
        const conflictingAppointment = await ctx.db
            .query("appointments")
            .withIndex("by_organization", q => q.eq("organizationId", args.organizationId))
            .filter(q => 
                (q.eq(q.field("detailerId"), args.detailerId) || q.eq(q.field("clientId"), args.clientId))
                && q.lt(q.field("endTime"), args.startTime)
                && q.gt(q.field("startTime"), args.endTime)
            )
            .first();
        
        if (conflictingAppointment) {
            throw new Error("Time slot conflicts with existing appointment");
        }
    async handler(ctx, args) {
        // Verify the user has access to this organization
        const { userId, role } = await verifyOrgAccess(ctx, args.organizationId)

        // If user is a client, they can only book for themselves
        // If admin or detailer, they can book for any client
        const clientId = args.clientId || userId

        if (role === roles.CLIENT && clientId !== userId) {
            throw new Error("Clients can only book appointments for themselves")
        }

        // Create the appointment
        if (new Date(args.startTime) >= new Date(args.endTime)) {
            throw new Error("Start time must be before end time");
        }
        if (new Date(args.startTime) >= new Date(args.endTime)) {
            throw new Error("Start time must be before end time");
        }
        const appointmentId = await ctx.db.insert("appointments", {
            organizationId: args.organizationId,
            serviceId: args.serviceId,
            clientId,
            detailerId: args.detailerId,
            startTime: args.startTime,
            endTime: args.endTime,
            status: "scheduled",
            notes: args.notes,
        })

        return appointmentId
    },
})

export const update = mutation({
    args: {
        appointmentId: v.id("appointments"),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
        status: v.optional(v.string()),
        detailerId: v.optional(v.id("users")),
        notes: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const { appointmentId, ...updates } = args

        const appointment = await ctx.db.get(appointmentId)

        if (!appointment) {
            throw new Error("Appointment not found")
        }

        // Verify user has access to this appointment
        const { userId, role } = await verifyOrgAccess(ctx, appointment.organizationId)

        // Clients can only update their own appointments and cannot change the detailer
        if (role === roles.CLIENT) {
            if (appointment.clientId !== userId) {
                throw new Error("You can only update your own appointments")
            }

            if (updates.detailerId) {
                throw new Error("Clients cannot change the assigned detailer")
            }

            // Clients can only change status to cancelled
            if (updates.status && updates.status !== "cancelled") {
                throw new Error("Clients can only cancel appointments")
            }
        }

        // Detailers can only update their own appointments or unassigned ones
        if (role === roles.DETAILER) {
            if (appointment.detailerId && appointment.detailerId !== userId && updates.detailerId !== userId) {
                throw new Error("You can only update your own appointments or claim unassigned ones")
            }
        }

        await ctx.db.patch(appointmentId, updates)

        return appointmentId
    },
})

export const cancel = mutation({
    args: {
        appointmentId: v.id("appointments"),
        cancellationReason: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const appointment = await ctx.db.get(args.appointmentId)

        if (!appointment) {
            throw new Error("Appointment not found")
        }

        // Verify user has access to this appointment
        const { userId, role } = await verifyOrgAccess(ctx, appointment.organizationId)

        // Clients can only cancel their own appointments
        if (role === roles.CLIENT && appointment.clientId !== userId) {
            throw new Error("You can only cancel your own appointments")
        }

        // Update the appointment status to cancelled
        await ctx.db.patch(args.appointmentId, {
            status: "cancelled",
            notes: args.cancellationReason
                ? `${appointment.notes || ""}\n\nCancellation reason: ${args.cancellationReason}`
                : appointment.notes,
        })

        return args.appointmentId
    },
})