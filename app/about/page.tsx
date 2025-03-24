// app/about/page.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SEOMetadata } from "@/components/seo-metadata"
import { Check, Clock, Globe, Shield, Users, Award, Tv, Headphones } from "lucide-react"
import { generateLocalBusinessSchema } from "@/lib/structured-data"

export default function AboutPage() {
  // Generate structured data for local business
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <>
      <SEOMetadata 
        title="About Crisp TV | Premium IPTV Service Provider"
        description="Learn about Crisp TV, a leading premium IPTV service provider offering thousands of HD channels worldwide with reliable streaming and 24/7 customer support."
        canonical="/about"
        keywords={["about crisp tv", "iptv provider", "premium tv service", "iptv company", "streaming service"]}
        structuredData={localBusinessSchema}
      />

      <div className="flex min-h-screen flex-col bg-black text-white">
        <SiteHeader />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400">
                    About Crisp TV
                  </h1>
                  <p className="max-w-[800px] mx-auto text-gray-300 text-xl md:text-2xl">
                    A Premium IPTV Service With Global Reach
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="w-full py-12 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-yellow-400 px-3 py-1 text-sm font-semibold text-black">
                    Our Story
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                    A Passion for Quality Entertainment
                  </h2>
                  <p className="text-gray-300 md:text-lg">
                    Founded in 2020, Crisp TV was born out of a passion to provide high-quality entertainment options to viewers around the world. Our founders recognized a gap in the market for reliable, high-definition streaming services that offered extensive channel selection at affordable prices.
                  </p>
                  <p className="text-gray-300 md:text-lg">
                    Starting with just a few hundred channels and a small team of dedicated professionals, we've grown to offer thousands of channels in multiple languages, serving customers across the globe. Our commitment to quality, reliability, and customer satisfaction has helped us become a leading name in the IPTV industry.
                  </p>
                </div>
                <div className="relative rounded-xl border-2 border-yellow-400 overflow-hidden aspect-square bg-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tv className="w-24 h-24 text-yellow-400 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Mission Section */}
          <section className="w-full py-12 md:py-24 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Our Mission
                </h2>
                <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                  To provide the most comprehensive and reliable IPTV service, delivering world-class entertainment to our customers at competitive prices.
                </p>
              </div>
              
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center text-center bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="rounded-full bg-yellow-400/10 p-4 mb-4">
                    <Tv className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    Premium Content
                  </h3>
                  <p className="text-gray-300">
                    We curate thousands of high-quality channels and on-demand content from around the world to ensure our customers have access to the best entertainment options.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="rounded-full bg-yellow-400/10 p-4 mb-4">
                    <Shield className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    Reliability & Stability
                  </h3>
                  <p className="text-gray-300">
                    Our advanced infrastructure ensures minimal buffering and downtime, providing a smooth viewing experience comparable to traditional cable or satellite TV.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="rounded-full bg-yellow-400/10 p-4 mb-4">
                    <Headphones className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    Customer Support
                  </h3>
                  <p className="text-gray-300">
                    Our dedicated support team is available 24/7 to help with any questions or technical issues, ensuring our customers always have assistance when they need it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="w-full py-12 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Why Choose Crisp TV?
                </h2>
                <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                  Experience the difference with our premium IPTV service
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 rounded-full bg-yellow-400 p-1">
                    <Check className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Extensive Channel Selection</h3>
                    <p className="text-gray-300">Over 3,000 channels from various countries and categories, ensuring there's always something for everyone.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 rounded-full bg-yellow-400 p-1">
                    <Check className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">HD & 4K Quality</h3>
                    <p className="text-gray-300">Experience crystal-clear video quality with our HD, FHD, and 4K streaming options.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 rounded-full bg-yellow-400 p-1">
                    <Check className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Multi-Device Support</h3>
                    <p className="text-gray-300">Watch on Smart TVs, smartphones, tablets, computers, and streaming devices with our flexible service.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 rounded-full bg-yellow-400 p-1">
                    <Check className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">VOD Library</h3>
                    <p className="text-gray-300">Access our extensive video-on-demand library with the latest movies and TV shows.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 rounded-full bg-yellow-400 p-1">
                    <Check className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Competitive Pricing</h3>
                    <p className="text-gray-300">Enjoy premium entertainment at a fraction of the cost of traditional cable or satellite TV.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 rounded-full bg-yellow-400 p-1">
                    <Check className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Regular Updates</h3>
                    <p className="text-gray-300">We continuously update our channel list and improve our service based on customer feedback.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Reach Section */}
          <section className="w-full py-12 md:py-24 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="relative rounded-xl border-2 border-yellow-400 overflow-hidden aspect-video bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="w-24 h-24 text-yellow-400 opacity-50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                    Global Reach, Local Focus
                  </h2>
                  <p className="text-gray-300 md:text-lg">
                    Crisp TV serves customers across the globe, with viewers in over 50 countries enjoying our services daily. We understand the importance of local content, which is why we offer channels from various regions and in multiple languages.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <span className="text-3xl font-bold text-yellow-400">50+</span>
                      <p className="text-gray-300">Countries Served</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <span className="text-3xl font-bold text-yellow-400">3,000+</span>
                      <p className="text-gray-300">Channels Available</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <span className="text-3xl font-bold text-yellow-400">15+</span>
                      <p className="text-gray-300">Languages</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <span className="text-3xl font-bold text-yellow-400">24/7</span>
                      <p className="text-gray-300">Customer Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-12 md:py-24 bg-gradient-to-t from-gray-900 to-black">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  Ready to Experience Crisp TV?
                </h2>
                <p className="max-w-[700px] text-gray-300 md:text-xl">
                  Join thousands of satisfied customers enjoying premium IPTV service at affordable prices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link href="/packages">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-6 text-lg">
                      View Packages
                    </Button>
                  </Link>
                  <Link href="/support">
                    <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-6 text-lg">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  )
}