import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserRole } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DetailerDashboard() {
    const { organizationId, userId, role } = await getUserRole()

    // Check if user has detailer role
    if (role !== "org:detailer" && role !== "org:admin") {
        return redirect("/dashboard")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Detailer Dashboard</h1>
                <p className="text-muted-foreground">Manage your appointments and availability</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>My Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>View and manage your assigned appointments.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Update your working hours and availability.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

