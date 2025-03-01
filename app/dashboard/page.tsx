import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart, Calendar, Clock, Settings, Users } from "lucide-react"
import Link from "next/link"
import { getUserRole } from "@/lib/auth"
import { getOrganization } from "@/lib/organizations"

export default async function DashboardPage() {
    // Here we'll check for organization and redirect to appropriate dashboard
    // For now, redirect to a placeholder dashboard page
    const { organizationId, userId, role } = await getUserRole()

    if (!organizationId) {
        // If no organization, redirect to create org page
        return redirect("/create-organization")
    }

    const org = await getOrganization(organizationId)

    // Role-based redirects would happen here in a full implementation

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{org?.name || "Dashboard"}</h1>
                <p className="text-muted-foreground">Welcome to your {role || "dashboard"} dashboard.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">No appointments scheduled yet</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">You are the only team member</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Services</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Add services to start booking</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">No revenue generated yet</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Get started with these common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-between">
                            Add Service <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between">
                            Invite Team Member <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between">
                            Configure Schedule <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                        <CardDescription>Upcoming appointments for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-[120px] text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>No appointments scheduled for today</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Setup Progress</CardTitle>
                        <CardDescription>Complete these steps to finish setup</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                                <span className="flex-1">Create Organization</span>
                                <span className="text-green-500">✓</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-muted mr-2"></div>
                                <span className="flex-1">Set Business Hours</span>
                                <Link href="/dashboard/settings">
                                    <Button variant="link" size="sm" className="h-auto p-0">
                                        Configure
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-muted mr-2"></div>
                                <span className="flex-1">Add Services</span>
                                <Link href="/dashboard/services">
                                    <Button variant="link" size="sm" className="h-auto p-0">
                                        Add
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}