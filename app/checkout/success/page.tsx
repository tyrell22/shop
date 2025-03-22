"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        router.push("/packages")
        return
      }

      try {
        // In a real app, you would verify the session with your backend
        // For this demo, we'll just simulate a successful verification
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setOrderDetails({
          status: "success",
          message: "Your payment was successful and your subscription has been activated.",
        })
      } catch (error) {
        console.error("Error verifying session:", error)
        toast({
          title: "Verification Failed",
          description: "There was an error verifying your payment.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifySession()
  }, [sessionId, router, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-yellow-400">Verifying your payment...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-black">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/crisptvlogo.png" alt="Crisp TV Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-yellow-400">Crisp TV</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-md border-2 border-yellow-400 bg-gray-900">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-yellow-400">Payment Successful!</CardTitle>
              <CardDescription className="text-gray-400">Your subscription has been activated</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">
                Thank you for your purchase. Your IPTV subscription is now active and ready to use.
              </p>
              <div className="rounded-md bg-green-100/10 p-4 border border-green-500/30 mb-4">
                <p className="text-green-500 text-sm">{orderDetails?.message || "Your payment was successful."}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Go to Dashboard</Button>
              </Link>
              <Link href="/dashboard/watch">
                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  Start Watching
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

