"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"

type Product = {
  id: number
  name: string
  description: string
  price: number
  duration_days: number
  features: string[]
}

export default function PackagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addItem } = useCart()

  const renewProductId = searchParams.get("renew")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user/profile")
        const data = await response.json()
        setIsAuthenticated(data.success)
      } catch (error) {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching products...")
      const response = await fetch("/api/products")
      const data = await response.json()
      console.log("Products API response:", data)

      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        const processedProducts = data.products.map((product) => ({
          ...product,
          price: typeof product.price === "string" ? Number.parseFloat(product.price) : Number(product.price),
          duration_days:
            typeof product.duration_days === "string"
              ? Number.parseInt(product.duration_days)
              : Number(product.duration_days),
          features:
            typeof product.features === "string"
              ? JSON.parse(product.features)
              : Array.isArray(product.features)
                ? product.features
                : [],
        }))
        setProducts(processedProducts)
      } else {
        console.log("No products returned, using sample data")
        setProducts([
          {
            id: 1,
            name: "Basic",
            description: "Perfect for casual viewers",
            price: 9.99,
            duration_days: 30,
            features: ["1000+ Channels", "HD Quality", "24/7 Support", "1 Device"],
          },
          {
            id: 2,
            name: "Standard",
            description: "Our most popular package",
            price: 14.99,
            duration_days: 30,
            features: ["2000+ Channels", "HD & FHD Quality", "24/7 Support", "2 Devices", "VOD Access"],
          },
          {
            id: 3,
            name: "Premium",
            description: "The ultimate viewing experience",
            price: 19.99,
            duration_days: 30,
            features: [
              "3000+ Channels",
              "HD, FHD & 4K Quality",
              "24/7 Priority Support",
              "4 Devices",
              "VOD & Series Access",
              "PPV Events",
            ],
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([
        {
          id: 1,
          name: "Basic",
          description: "Perfect for casual viewers",
          price: 9.99,
          duration_days: 30,
          features: ["1000+ Channels", "HD Quality", "24/7 Support", "1 Device"],
        },
        {
          id: 2,
          name: "Standard",
          description: "Our most popular package",
          price: 14.99,
          duration_days: 30,
          features: ["2000+ Channels", "HD & FHD Quality", "24/7 Support", "2 Devices", "VOD Access"],
        },
        {
          id: 3,
          name: "Premium",
          description: "The ultimate viewing experience",
          price: 19.99,
          duration_days: 30,
          features: [
            "3000+ Channels",
            "HD, FHD & 4K Quality",
            "24/7 Priority Support",
            "4 Devices",
            "VOD & Series Access",
            "PPV Events",
          ],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = (productId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in or sign up to subscribe to this package.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    router.push(`/checkout?productId=${productId}`)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-yellow-400">Loading packages...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                Choose Your Crisp TV Package
              </h1>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Select the perfect plan for your entertainment needs
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`flex flex-col p-6 bg-gray-900 rounded-lg border-2 ${
                  renewProductId === product.id.toString()
                    ? "border-green-500 shadow-lg shadow-green-500/20"
                    : "border-yellow-400"
                }`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-yellow-400">{product.name}</CardTitle>
                  <p className="text-sm text-gray-400">{product.description}</p>
                  <div className="mt-2 text-3xl font-bold text-white">
                    ${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}
                    <span className="text-sm font-normal text-gray-400">
                      {product.duration_days === 30
                        ? "/month"
                        : product.duration_days === 365
                          ? "/year"
                          : `/${product.duration_days} days`}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
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
                </CardContent>
                <CardFooter className="pt-4 flex flex-col gap-2">
                  <Button
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                    onClick={() => handleSubscribe(product.id)}
                  >
                    {renewProductId === product.id.toString() ? "Renew Subscription" : "Subscribe Now"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
