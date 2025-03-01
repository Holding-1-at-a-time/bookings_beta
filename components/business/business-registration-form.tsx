"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const businessFormSchema = z.object({
    name: z.string().min(2, "Business name must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    email: z.string().email("Invalid email address"),
    description: z.string().optional(),
})

type BusinessFormValues = z.infer<typeof businessFormSchema>

export function BusinessRegistrationForm() {
    const router = useRouter()
    const createBusiness = useMutation(api.businesses.create)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<BusinessFormValues>({
        resolver: zodResolver(businessFormSchema),
        defaultValues: {
            name: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            phone: "",
            email: "",
            description: "",
        },
    })

    async function onSubmit(data: BusinessFormValues) {
        setIsSubmitting(true)
        try {
            const businessId = await createBusiness(data)
            toast.success("Business registered successfully!")
            router.push(`/dashboard/business/${businessId}`)
        } catch (error) {
            console.error("Error registering business:", error)
            toast.error("Failed to register business. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your business name" {...field} />
                            </FormControl>
                            <FormDescription>This is the name that will be displayed to your customers.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your business address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter city" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter state" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter ZIP code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter email address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter a brief description of your business" {...field} />
                            </FormControl>
                            <FormDescription>This description will be shown to potential customers.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register Business"}
                </Button>
            </form>
        </Form>
    )
}

