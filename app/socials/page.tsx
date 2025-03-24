import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Facebook, Twitter, Instagram, Youtube, ChevronLeft } from "lucide-react";

export default function SocialsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex items-center mb-8">
              <Link href="/" className="flex items-center text-yellow-400 hover:text-yellow-300">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>>
            
            <div className="flex flex-col items-center justify-center space-y-10 text-center max-w-3xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                  Our Social Media Presence
                </h1>
                <p className="text-xl text-gray-300">
                  We're currently working on establishing our social media presence to better connect with our community.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
              </div>
              
              <div className="bg-gray-900 p-8 rounded-lg border-2 border-yellow-400 w-full">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-3xl font-bold text-black">!</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Coming Soon</h2>
                <p className="text-gray-300 mb-6">
                  Our team is working hard to create engaging content and build our social media platforms. 
                  Stay tuned for updates, announcements, troubleshooting tips, and exclusive offers!
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Facebook className="h-10 w-10 text-yellow-400 mb-2" />
                    <span className="text-white">Facebook</span>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Twitter className="h-10 w-10 text-yellow-400 mb-2" />
                    <span className="text-white">Twitter</span>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Instagram className="h-10 w-10 text-yellow-400 mb-2" />
                    <span className="text-white">Instagram</span>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Youtube className="h-10 w-10 text-yellow-400 mb-2" />
                    <span className="text-white">YouTube</span>
                    <span className="text-xs text-gray-400">Coming Soon</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-yellow-400">Get Notified</h2>
                <p className="text-gray-300">
                  Want to be the first to know when we launch our social media platforms? 
                  Leave your contact information and we'll keep you updated.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-md flex-1 text-white"
                    required
                  />
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                    Notify Me
                  </Button>
                </form>
              </div>
              
              <div className="pt-6">
                <p className="text-gray-300">
                  In the meantime, you can always reach us through our <Link href="/support" className="text-yellow-400 hover:underline">support page</Link>.
                </p>