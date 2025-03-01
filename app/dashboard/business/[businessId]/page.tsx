import { BusinessDashboard } from "@/components/business/business-dashboard"
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"

export default async function BusinessDashboardPage({
    params,
}: {
    params: { businessId: string }
}) {
    const business = await fetchQuery(api.businesses.getById, {
        businessId: params.businessId,
    })

    if (!business) {
        return <div>Business not found</div>
    }

    return <BusinessDashboard business={business} />
}

