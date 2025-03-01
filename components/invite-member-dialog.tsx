"use client"

import { useState } from "react"
import { useOrganization } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

const inviteFormSchema = z.object({
    emailAddress: z.string().email("Please enter a valid email address"),
    role: z.enum(["org:admin", "org:detailer", "org:client"], {
        required_error: "Please select a role",
    }),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

export function InviteMemberDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { organization, isLoaded } = useOrganization()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteFormSchema),
        defaultValues: {
            emailAddress: "",
            role: "org:detailer",
        },
    })

    async function onSubmit(data: InviteFormValues) {
        if (!organization) return

        setIsSubmitting(true)
        try {
            await organization.inviteMember({
                emailAddress: data.emailAddress,
                role: data.role,
            })
            toast.success("Invitation sent successfully")
            form.reset()
            onOpenChange(false)
        } catch (error) {
            console.error("Error inviting member:", error)
            toast.error("Failed to send invitation")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>Send an invitation to join your auto detailing business.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="emailAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>The email address of the person you want to invite.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="org:admin">Admin</SelectItem>
                                            <SelectItem value="org:detailer">Detailer</SelectItem>
                                            <SelectItem value="org:client">Client</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>The role determines what permissions the user will have.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

