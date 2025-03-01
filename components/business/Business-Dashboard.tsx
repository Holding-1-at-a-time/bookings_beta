"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, DollarSign, Users, Clock } from "lucide-react"
import { Button } from "../ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"

interface BusinessDashboardProps {
    business: Doc<"businesses">
}

export function BusinessDashboard({ business }: BusinessDashboardProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const services = useQuery(api.services.getByBusiness, { businessId: business._id }) || []
    const appointments = useQuery(api.appointments.getByBusiness, { businessId: business._id }) || []

    const totalRevenue = appointments.reduce((sum, appointment) => sum + (appointment.price || 0), 0)
    const completedAppointments = appointments.filter((appointment) => appointment.status === "completed")
    const averageServiceTime =
        completedAppointments.reduce((sum, appointment) => sum + (appointment.duration || 0), 0) /
        (completedAppointments.length || 1)

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{business.name} Dashboard</h1>
                <Button asChild>
                    <Link href={`/business/${business._id}/edit`}>Edit Business</Link>
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{appointments.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{services.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Service Time</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{averageServiceTime.toFixed(0)} min</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="services">
                    <Card>
                        <CardHeader>
                            <CardTitle>Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {services.map((service) => (
                                    <li key={service._id} className="flex justify-between items-center">
                                        <span>{service.name}</span>
                                        <span>${service.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appointments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {appointments.slice(0, 5).map((appointment) => (
                                    <li key={appointment._id} className="flex justify-between items-center">
                                        <span>{new Date(appointment.startTime).toLocaleString()}</span>
                                        <span>{appointment.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}