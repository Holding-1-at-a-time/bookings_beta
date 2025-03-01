import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Clock,
  Shield,
  Users
} from 'lucide-react';
import { type PropsWithChildren } from 'react';
import React from 'react';
import { Button } from '../components/ui/Button';


export default function Home() {
  const Home: React.FC<PropsWithChildren> = ({ children }) => {

    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex">
              <Link href="/" className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Smart Booking&apos;s</span>
              </Link>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    AI-Powered Scheduling for Auto Detailing Businesses
                  </h1>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    Streamline your auto detailing business with smart booking technology that optimizes schedules and
                    delights customers.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link href="/sign-up">
                    <Button size="lg" className="gap-1">
                      Start Free Trial <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Features Built for Your Business
                  </h2>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    Everything you need to manage your auto detailing schedule efficiently.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <Calendar className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Smart Scheduling</h3>
                  <p className="text-center text-muted-foreground">
                    AI-driven appointment booking that optimizes your schedule and prevents double-booking.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <Users className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Multi-Tenant Architecture</h3>
                  <p className="text-center text-muted-foreground">
                    Secure isolation between businesses with dedicated dashboards and configurations.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <Shield className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Role-Based Access</h3>
                  <p className="text-center text-muted-foreground">
                    Granular permissions for admins, detailers, and clients with secure authentication.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <Clock className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Real-Time Updates</h3>
                  <p className="text-center text-muted-foreground">
                    Live schedule adjustments and instant notifications for all users.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t py-6 md:py-8">
          <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © 2023 Smart Booking&apos;s. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-sm text-muted-foreground underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground underline">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}