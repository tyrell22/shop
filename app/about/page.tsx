import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                About Crisp TV
              </h1>
              <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
                Premium IPTV service with thousands of channels worldwide
              </p>
            </div>
            
            <div className="grid gap-10 mx-auto max-w-4xl">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-yellow-400">Our Story</h2>
                <p className="text-gray-300">
                  Founded in 2022, Crisp TV was born from a vision to provide high-quality streaming entertainment 
                  to viewers around the world. What started as a small venture has quickly grown into one of the 
                  most reliable and comprehensive IPTV services available today.
                </p>
                <p className="text-gray-300">
                  Our team consists of passionate tech enthusiasts who are dedicated to delivering the best possible 
                  viewing experience. We continuously work to expand our channel offerings, improve stream quality, 
                  and enhance our user interface to ensure our subscribers get maximum value from our service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-yellow-400">Our Mission</h2>
                <p className="text-gray-300">
                  At Crisp TV, our mission is to make premium entertainment accessible to everyone, everywhere. 
                  We believe that geographical restrictions shouldn't limit your viewing options. That's why we 
                  offer thousands of channels from around the world, providing you with a diverse range of content 
                  in multiple languages.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-yellow-400">What Sets Us Apart</h2>
                <div className="grid gap-4 sm:grid-cols-2 mt-6">
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-medium text-yellow-400 mb-2">Quality</h3>
                    <p className="text-gray-300">
                      We offer HD, FHD, and 4K streaming options with minimal buffering, 
                      optimized for all your devices.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-medium text-yellow-400 mb-2">Reliability</h3>
                    <p className="text-gray-300">
                      Our service boasts an uptime of over 99.9%, ensuring your 
                      entertainment is always available when you want it.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-medium text-yellow-400 mb-2">Selection</h3>
                    <p className="text-gray-300">
                      With thousands of channels across sports, news, movies, 
                      TV shows, and more, there's always something to watch.
                    </p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-medium text-yellow-400 mb-2">Support</h3>
                    <p className="text-gray-300">
                      Our dedicated support team is available 24/7 to assist with 
                      any questions or technical issues you may encounter.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-yellow-400">Looking Forward</h2>
                <p className="text-gray-300">
                  As we continue to grow, we remain committed to improving our service and expanding our offerings. 
                  We're constantly working on new features, exploring emerging technologies, and finding ways to 
                  enhance the Crisp TV experience for our subscribers.
                </p>
                <p className="text-gray-300">
                  Thank you for choosing Crisp TV. We're excited to be part of your entertainment journey.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/packages">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300 px-6 py-3 text-lg">
                  Explore Our Packages
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