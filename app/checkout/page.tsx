"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreditCard, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import { SiteHeader } from "@/components/site-header"

// Add this at the top of the file, after the imports
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.warn("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable")
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

type Product = {
  id: number
  name: string
  description: string
  price: number
  duration_days: number
  features: string[]
}

export default function CheckoutPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const productId = searchParams.get("productId")

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        router.push("/packages")
        return
      }

      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()

        if (data.success) {
          // Ensure price is a number
          const processedProduct = {
            ...data.product,
            price:
              typeof data.product.price === "string"
                ? Number.parseFloat(data.product.price)
                : Number(data.product.price),
            duration_days:
              typeof data.product.duration_days === "string"
                ? Number.parseInt(data.product.duration_days)
                : Number(data.product.duration_days),
            features: Array.isArray(data.product.features) ? data.product.features : [],
          }

          setProduct(processedProduct)
        } else {
          // If product not found, redirect to packages
          router.push("/packages")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        router.push("/packages")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId, router])

  const handleCheckout = async () => {
    if (!product) return

    setIsProcessing(true)

    try {
      // Create a Stripe checkout session
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        toast({
          title: "Checkout Failed",
          description: data.message || "There was an error processing your checkout.",
          variant: "destructive",
        })
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your checkout.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-yellow-400">Loading checkout...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-yellow-400 mb-4">Product not found</p>
          <Link href="/packages">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-300">View Packages</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Ensure price is a number for display
  const displayPrice = typeof product.price === "number" ? product.price.toFixed(2) : "0.00"

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <Link href="/packages" className="flex items-center text-yellow-400 hover:text-yellow-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Packages
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Card className="border-2 border-yellow-400 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Package:</span>
                    <span className="font-medium text-white">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Duration:</span>
                    <span className="font-medium text-white">
                      {product.duration_days === 30
                        ? "1 Month"
                        : product.duration_days === 365
                          ? "1 Year"
                          : `${product.duration_days} days`}
                    </span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="font-medium text-white">${displayPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tax:</span>
                    <span className="font-medium text-white">$0.00</span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total:</span>
                    <span className="font-bold text-xl text-yellow-400">${displayPrice}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-2 border-yellow-400 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Payment Information</CardTitle>
                  <CardDescription className="text-gray-400">Secure payment processing by Stripe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-gray-800 p-4">
                    <h3 className="text-lg font-medium text-white mb-2">Package Features:</h3>
                    <ul className="space-y-2">
                      {Array.isArray(product.features) &&
                        product.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-5 h-5 mr-2 text-yellow-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="rounded-md bg-yellow-400/10 p-4 border border-yellow-400/30">
                    <p className="text-yellow-400 text-sm">
                      You will be redirected to Stripe's secure payment page to complete your purchase.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ${displayPrice} with Stripe
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

