import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Video, FileText } from "lucide-react"
import Link from "next/link"

export default function LibraryPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background backdrop-blur-sm" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              MNKY Library
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Explore our curated collection of articles, videos, and resources to deepen your understanding
              and expand your knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Articles</CardTitle>
                    <CardDescription>
                      In-depth analysis and thought pieces
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between">
                      <Link href="/library/articles">
                        Browse Articles
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                {/* Add more article cards */}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Library</CardTitle>
                    <CardDescription>
                      Watch and learn with our video content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between">
                      <Link href="/library/videos">
                        Browse Videos
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                {/* Add more video cards */}
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>
                      Downloadable content and guides
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between">
                      <Link href="/library/resources">
                        Browse Resources
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                {/* Add more resource cards */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Quick Access</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Button variant="outline" size="lg" className="h-32 flex-col gap-4">
              <BookOpen className="h-8 w-8" />
              Latest Articles
            </Button>
            <Button variant="outline" size="lg" className="h-32 flex-col gap-4">
              <Video className="h-8 w-8" />
              Featured Videos
            </Button>
            <Button variant="outline" size="lg" className="h-32 flex-col gap-4">
              <FileText className="h-8 w-8" />
              Popular Resources
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 