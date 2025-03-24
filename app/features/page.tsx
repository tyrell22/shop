// app/features/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tv, 
  Zap, 
  Globe, 
  Headphones, 
  Monitor, 
  Play, 
  Cloud, 
  Shield, 
  Smartphone, 
  Clock, 
  Check 
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SEOMetadata } from "@/components/seo-metadata";
import { generateFAQSchema } from "@/lib/structured-data";

export default function FeaturesPage() {
  // FAQ data for structured data
  const faqs = [
    {
      question: "What devices can I use with Crisp TV?",
      answer: "Crisp TV is compatible with a wide range of devices including Smart TVs, Android and iOS smartphones, tablets, Amazon Firestick, Roku, Apple TV, Android TV boxes, computers, and more. Any device that supports M3U playlists or IPTV apps can be used with our service."
    },
    {
      question: "How many channels does Crisp TV offer?",
      answer: "Crisp TV offers thousands of channels from around the world, with our premium package featuring over 3,000 channels across various categories including sports, news, entertainment, movies, kids programming, and international content."
    },
    {
      question: "Can I watch in HD or 4K quality?",
      answer: "Yes, Crisp TV provides HD, Full HD (1080p), and 4K streaming options depending on your package and the channel's source quality. Our premium package includes the highest quality streams available."
    },
    {
      question: "Do you offer multi-device support?",
      answer: "Yes, depending on your subscription package, you can use Crisp TV on multiple devices simultaneously. Our Basic plan supports 1 device, Standard supports 2 devices, and Premium supports up to 4 devices at the same time."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a limited free trial for new customers so you can test our service before committing to a subscription. Contact our support team to request a trial."
    }
  ];

  // Generate structured data for FAQ
  const faqSchema = generateFAQSchema(faqs);

  // Main features data
  const mainFeatures = [
    {
      icon: <Tv className="h-12 w-12 text-yellow-400" />,
      title: "Thousands of Channels",
      description: "Access a vast library of live TV channels from around the world, covering sports, news, entertainment, movies, and more.",
      details: "Our service includes channels from the US, UK, Canada, Europe, Asia, and more, with content in multiple languages to suit your preferences."
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-400" />,
      title: "High-Quality Streaming",
      description: "Enjoy HD, FHD, and 4K streaming options with minimal buffering, optimized for all your devices.",
      details: "Our advanced servers and CDN ensure smooth playback even during peak viewing hours, with adaptive quality depending on your internet connection."
    },
    {
      icon: <Globe className="h-12 w-12 text-yellow-400" />,
      title: "Global Accessibility",
      description: "Stream from anywhere with our reliable IPTV service, compatible with Smart TVs, phones, computers, and streaming devices.",
      details: "Whether you're at home or traveling, access your favorite channels without geographical restrictions through any internet connection."
    },
    {
      icon: <Headphones className="h-12 w-12 text-yellow-400" />,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated support team, ensuring your viewing experience is uninterrupted.",
      details: "Our experienced support team is available around the clock to assist with setup, troubleshooting, and any questions you may have about our service."
    },
  ];

  // Additional features by category
  const deviceFeatures = [
    { icon: <Monitor />, title: "Smart TVs", description: "Compatible with Samsung, LG, Sony, and other Smart TV brands" },
    { icon: <Play />, title: "Streaming Devices", description: "Works with Amazon Fire Stick, Roku, Apple TV, and Android TV boxes" },
    { icon: <Smartphone />, title: "Mobile Devices", description: "Available on iOS and Android smartphones and tablets" },
    { icon: <Globe />, title: "Web Browsers", description: "Watch directly in Chrome, Firefox, Safari, and other browsers" },
  ];

  const contentFeatures = [
    { icon: <Tv />, title: "Live TV", description: "Thousands of live channels across all categories" },
    { icon: <Play />, title: "Video on Demand", description: "Extensive library of movies and TV shows" },
    { icon: <Clock />, title: "Catch-up TV", description: "Watch programs you missed up to 7 days back" },
    { icon: <Globe />, title: "International Content", description: "Channels from all major countries and regions" },
  ];

  const technicalFeatures = [
    { icon: <Cloud />, title: "Cloud DVR", description: "Record your favorite shows to watch later" },
    { icon: <Zap />, title: "Low Latency", description: "Almost real-time streaming with minimal delays" },
    { icon: <Shield />, title: "Secure Connection", description: "Encrypted streaming for your privacy and security" },
    { icon: <Monitor />, title: "Multi-Device", description: "Use on multiple devices with a single subscription" },
  ];

  return (
    <>
      <SEOMetadata 
        title="Crisp TV Features | Premium IPTV Service Capabilities"
        description="Discover Crisp TV's premium IPTV features including thousands of HD channels, multi-device support, VOD content, and 24/7 customer service."
        canonical="/features"
        keywords={["iptv features", "hd channels", "multi-device", "streaming service", "video on demand", "live tv"]}
        structuredData={faqSchema}
      />

      <div className="flex min-h-screen flex-col bg-black text-white">
        <SiteHeader />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400">
                  Powerful Features for Ultimate Entertainment
                </h1>
                <p className="max-w-[800px] mx-auto text-gray-300 text-xl md:text-2xl">
                  Experience premium television like never before with Crisp TV's cutting-edge IPTV technology
                </p>
                <div className="flex justify-center mt-8">
                  <Link href="/packages">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-6 text-lg">
                      Explore Our Packages
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Main Features Section */}
          <section className="w-full py-12 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Why Choose Crisp TV?
                </h2>
                <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                  Our comprehensive IPTV service offers everything you need for an exceptional viewing experience.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {mainFeatures.map((feature, index) => (
                  <div key={index} className="flex flex-col h-full">
                    <Card className="flex flex-col h-full p-6 bg-gray-900 border-2 border-yellow-400 shadow-lg hover:shadow-yellow-400/20 transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="mb-4">{feature.icon}</div>
                        <CardTitle className="text-xl font-semibold text-yellow-400">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-gray-300">{feature.description}</p>
                        <p className="mt-4 text-sm text-gray-400">{feature.details}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Feature Categories Tabs Section */}
          <section className="w-full py-12 md:py-24 bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Explore Our Features
                </h2>
                <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                  Everything you need for the ultimate entertainment experience
                </p>
              </div>
              
              <Tabs defaultValue="devices" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger 
                    value="devices"
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                  >
                    Device Compatibility
                  </TabsTrigger>
                  <TabsTrigger 
                    value="content"
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                  >
                    Content Categories
                  </TabsTrigger>
                  <TabsTrigger 
                    value="technical"
                    className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                  >
                    Technical Features
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="devices" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {deviceFeatures.map((feature, index) => (
                      <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                          <div className="mb-2 text-yellow-400">{feature.icon}</div>
                          <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300">{feature.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {contentFeatures.map((feature, index) => (
                      <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                          <div className="mb-2 text-yellow-400">{feature.icon}</div>
                          <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300">{feature.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="technical" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {technicalFeatures.map((feature, index) => (
                      <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                          <div className="mb-2 text-yellow-400">{feature.icon}</div>
                          <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300">{feature.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full py-12 md:py-24 bg-black">
            <div className="container px-4 md:px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-yellow-400">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                  Get answers to common questions about our IPTV service
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-yellow-400 mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
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
                  <Link href="/register">
                    <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-6 text-lg">
                      Create Account
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
  );
}