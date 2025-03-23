import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tv, Zap, Globe, Headphones } from "lucide-react"; // Icons for features
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Tv className="h-12 w-12 text-yellow-400" />,
      title: "Thousands of Channels",
      description: "Access a vast library of live TV channels from around the world, covering sports, news, entertainment, and more.",
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-400" />,
      title: "High-Quality Streaming",
      description: "Enjoy HD, FHD, and 4K streaming options with minimal buffering, optimized for all your devices.",
    },
    {
      icon: <Globe className="h-12 w-12 text-yellow-400" />,
      title: "Global Availability",
      description: "Stream from anywhere with our reliable IPTV service, compatible with smart TVs, phones, and computers.",
    },
    {
      icon: <Headphones className="h-12 w-12 text-yellow-400" />,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated support team, ensuring your viewing experience is uninterrupted.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                Why Choose Crisp TV?
              </h1>
              <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                Discover the features that make Crisp TV the ultimate IPTV service for your entertainment needs.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-lg border-2 border-yellow-400">
                  <div className="mb-4">{feature.icon}</div>
                  <h2 className="text-xl font-semibold text-yellow-400 mb-2">{feature.title}</h2>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/packages">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-6 py-3 text-lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
