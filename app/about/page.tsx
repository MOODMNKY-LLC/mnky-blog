import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, Users, HelpCircle, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background backdrop-blur-sm" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              About MNKY BLOG
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover our story, mission, and the team behind MNKY BLOG. We're dedicated to creating
              a space for meaningful content and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Our Mission
                </CardTitle>
                <CardDescription>
                  Learn about our goals and values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href="/about/mission">
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Our Team
                </CardTitle>
                <CardDescription>
                  Meet the people behind MNKY BLOG
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href="/about/team">
                    Meet Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  FAQ
                </CardTitle>
                <CardDescription>
                  Common questions answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href="/about/faq">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact
                </CardTitle>
                <CardDescription>
                  Get in touch with us
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between">
                  <Link href="/about/contact">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Community First</h3>
              <p className="text-muted-foreground">
                Building meaningful connections and fostering engagement
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Quality Content</h3>
              <p className="text-muted-foreground">
                Creating valuable, insightful, and engaging content
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-muted-foreground">
                Embracing new ideas and pushing boundaries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-primary/10 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to Join Our Journey?</h2>
            <p className="text-muted-foreground mb-6">
              Be part of our growing community and help shape the future of MNKY BLOG
            </p>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 