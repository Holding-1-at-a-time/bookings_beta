import { BusinessEditForm } from "@/components/business/business-edit-form"
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"

export default async function BusinessEditPage({
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

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Edit Business</h1>
            <BusinessEditForm business={business} />
        </div>
    )
}

