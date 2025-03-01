import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define route matchers
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/terms",
  "/privacy",
])

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])
const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isDetailerRoute = createRouteMatcher(["/detailer(.*)"])
const isClientRoute = createRouteMatcher(["/client(.*)"])

// Organization sync options
const organizationSyncOptions = {
  organizationPatterns: ["/org/:slug", "/org/:slug/(.*)"],
  personalAccountPatterns: ["/account", "/account/(.*)"],
}

export default clerkMiddleware(
  async (auth, request) => {
    const { userId, orgId, sessionClaims } = await auth()

    // Always allow public routes
    if (isPublicRoute(request)) {
      return NextResponse.next()
    }

    // Protect all non-public routes
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url)
      signInUrl.searchParams.set("redirect_url", request.url)
      return NextResponse.redirect(signInUrl)
    }

    // Handle protected routes
    if (isProtectedRoute(request)) {
      // Additional checks can be added here if needed
      return NextResponse.next()
    }

    // Handle admin routes
    if (isAdminRoute(request)) {
      const isAdmin = sessionClaims?.userRole === "org:admin"
      if (!isAdmin) {
        return new NextResponse("Unauthorized", { status: 403 })
      }
      return NextResponse.next()
    }

    // Handle detailer routes
    if (isDetailerRoute(request)) {
      const isDetailer = sessionClaims?.userRole === "org:detailer" || sessionClaims?.userRole === "org:admin"
      if (!isDetailer) {
        return new NextResponse("Unauthorized", { status: 403 })
      }
      return NextResponse.next()
    }

    // Handle client routes
    if (isClientRoute(request)) {
      const isClient = sessionClaims?.userRole === "org:client" || sessionClaims?.userRole === "org:admin"
      if (!isClient) {
        return new NextResponse("Unauthorized", { status: 403 })
      }
      return NextResponse.next()
    }

    // If no specific rules matched, allow the request
    return NextResponse.next()
  },
  {
    debug: process.env.NODE_ENV === "development",
    organizationSyncOptions,
  },
)

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}