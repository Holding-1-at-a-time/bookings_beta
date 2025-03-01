import type { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { api } from "@/convex/_generated/api"
import { fetchMutation } from "convex/nextjs"

export async function POST(req: Request) {
    // Get the Svix headers for verification
    const svix_id = headers().get("svix-id")
    const svix_timestamp = headers().get("svix-timestamp")
    const svix_signature = headers().get("svix-signature")

    // If there are no Svix headers, return 400
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Missing svix headers", { status: 400 })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

    if (!webhookSecret) {
        return new NextResponse("Webhook secret not set", { status: 500 })
    }

    // Verify the webhook
    let event: WebhookEvent

    try {
        const wh = new Webhook(webhookSecret)
        event = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("Error verifying webhook:", err)
        return new NextResponse("Error verifying webhook", { status: 400 })
    }

    // Handle the webhook event
    try {
        const eventType = event.type

        switch (eventType) {
            case "user.created":
                await fetchMutation(api.users.create, {
                    clerkId: event.data.id,
                    email: event.data.email_addresses[0]?.email_address || "",
                    firstName: event.data.first_name || "",
                    lastName: event.data.last_name || "",
                    imageUrl: event.data.image_url || "",
                })
                break
            case "user.updated":
                await fetchMutation(api.users.update, {
                    clerkId: event.data.id,
                    email: event.data.email_addresses[0]?.email_address,
                    firstName: event.data.first_name,
                    lastName: event.data.last_name,
                    imageUrl: event.data.image_url,
                })
                break
            case "user.deleted":
                await fetchMutation(api.users.remove, {
                    clerkId: event.data.id,
                })
                break
            case "organization.created":
                await fetchMutation(api.organizations.create, {
                    clerkId: event.data.id,
                    name: event.data.name,
                    slug: event.data.slug || "",
                    imageUrl: event.data.image_url || "",
                })
                break
            case "organization.updated":
                await fetchMutation(api.organizations.update, {
                    clerkId: event.data.id,
                    name: event.data.name,
                    slug: event.data.slug,
                    imageUrl: event.data.image_url,
                })
                break
            case "organization.deleted":
                await fetchMutation(api.organizations.remove, {
                    clerkId: event.data.id,
                })
                break
            case "organizationMembership.created":
                {
                    const user = await fetchMutation(api.users.getByClerkId, {
                        clerkId: event.data.public_user_data.user_id,
                    })

                    const organization = await fetchMutation(api.organizations.getByClerkId, {
                        clerkId: event.data.organization.id,
                    })

                    if (user && organization) {
                        await fetchMutation(api.organizations.addMember, {
                            userId: user._id,
                            organizationId: organization._id,
                            role: event.data.role,
                        })
                    }
                }
                break
            case "organizationMembership.deleted":
                {
                    const user = await fetchMutation(api.users.getByClerkId, {
                        clerkId: event.data.public_user_data.user_id,
                    })

                    const organization = await fetchMutation(api.organizations.getByClerkId, {
                        clerkId: event.data.organization.id,
                    })

                    if (user && organization) {
                        await fetchMutation(api.organizations.removeMember, {
                            userId: user._id,
                            organizationId: organization._id,
                        })
                    }
                }
                break
            default:
                console.log(`Unhandled webhook event: ${eventType}`)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error handling webhook:", error)
        return new NextResponse("Error handling webhook", { status: 500 })
    }
}

