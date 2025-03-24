"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tv, ArrowLeft, Maximize, Volume2, VolumeX, Menu } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"

export default function WatchPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const channelId = searchParams.get("channel") || "1"

  useEffect(() => {
    // Simulate loading the stream
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [channelId])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        })
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Link href="/dashboard" className="flex items-center text-yellow-400 hover:text-yellow-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <Card className="border-2 border-yellow-400 bg-gray-900 overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-yellow-400">Loading stream...</div>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Tv className="h-24 w-24 text-yellow-400 opacity-50" />
                      </div>
                      <div className="absolute bottom-4 right-4 flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-black/50 border-gray-700 text-white hover:bg-black/70"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-black/50 border-gray-700 text-white hover:bg-black/70"
                          onClick={toggleFullscreen}
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="border-2 border-yellow-400 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Channel Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">Channel {channelId}</h3>
                      <p className="text-gray-400">Sample IPTV channel for demonstration purposes.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        HD
                      </div>
                      <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        English
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Channel Guide - Tabs Outside Card for Better Mobile UI */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Channel Guide</h2>
                <Tabs 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="favorites"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger
                      value="recent"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Card className="border-2 border-yellow-400 bg-gray-900">
                <CardContent className="p-4">
                  {/* Tab Content */}
                  {activeTab === "all" && (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((channel) => (
                        <Link
                          key={channel}
                          href={`/dashboard/watch?channel=${channel}`}
                          className={`flex items-center justify-between rounded-md p-2 hover:bg-gray-800 ${
                            channelId === channel.toString() ? "bg-gray-800 border-l-4 border-yellow-400" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded bg-gray-700 flex items-center justify-center mr-3">
                              <span className="text-xs text-white">{channel}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">Channel {channel}</div>
                              <div className="text-xs text-gray-400">Entertainment</div>
                            </div>
                          </div>
                          {channelId === channel.toString() && (
                            <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === "favorites" && (
                    <div className="text-center text-gray-400 py-8">No favorite channels yet.</div>
                  )}
                  
                  {activeTab === "recent" && (
                    <div className="text-center text-gray-400 py-8">No recently watched channels.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}