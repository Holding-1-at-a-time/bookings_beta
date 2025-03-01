import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserRole } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
    const { organizationId, userId, role } = await getUserRole()

    // Check if user has admin role
    if (role !== "org:admin") {
        return redirect("/dashboard")
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your auto detailing business</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Organization Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Manage your organization settings, users, and permissions.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Service Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Configure your services, pricing, and availability.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>View business insights and performance metrics.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

