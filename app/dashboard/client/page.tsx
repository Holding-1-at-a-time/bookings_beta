import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserRole } from "@/lib/auth"

export default async function ClientDashboard() {
    const { organizationId, userId, role } = await getUserRole()

    // This would check if user is a client in a real implementation
    // For now, we'll just show the client dashboard

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
                <p className="text-muted-foreground">Manage your auto detailing appointments</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>My Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>View and manage your upcoming appointments.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Book Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Schedule a new auto detailing service.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

