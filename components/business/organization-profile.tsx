"use client"

import { OrganizationProfile as ClerkOrganizationProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export function OrganizationProfile() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <div className="mx-auto max-w-4xl p-4">
      <ClerkOrganizationProfile
        appearance={{
          baseTheme: isDarkMode ? dark : undefined,
          elements: {
            card: "shadow-md rounded-lg border border-border",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-muted-foreground",
          },
        }}
        path="/organization-profile"
        routing="path"
      />
    </div>
  )
}

