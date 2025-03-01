import { OrganizationProfile } from "@clerk/nextjs"

export default function CreateOrganizationPage() {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Create Your Auto Detailing Business</h1>
                <OrganizationProfile
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-lg rounded-lg border border-border",
                        },
                    }}
                />
            </div>
        </div>
    )
}

