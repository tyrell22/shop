"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user/profile")
        const data = await response.json()
        setIsAuthenticated(data.success)
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Just set loading to false immediately to prevent redirections
    setIsLoading(false)
    // Then check auth status in background
    checkAuth()
  }, [])

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive",
      })
      return
    }

    // For simplicity, we'll just redirect to checkout with the first item
    // In a real app, you might want to handle multiple items differently
    
    // Navigate to the checkout page - this should work for both logged in and guest users
    router.push(`/checkout?productId=${items[0].product.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-yellow-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-yellow-400">Your Cart</h1>
            {items.length > 0 && (
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Looks like you haven't added any packages to your cart yet.</p>
                <Link href="/packages">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Browse Packages</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="border-2 border-yellow-400 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Cart Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-800 rounded-lg"
                      >
                        <div className="flex-1 mb-4 md:mb-0">
                          <h3 className="text-lg font-medium text-white">{item.product.name}</h3>
                          <p className="text-sm text-gray-400">{item.product.description}</p>
                          <p className="text-yellow-400 font-bold mt-1">
                            ${typeof item.product.price === "number" ? item.product.price.toFixed(2) : "0.00"}
                            <span className="text-gray-400 font-normal">
                              {item.product.duration_days === 30
                                ? " / month"
                                : item.product.duration_days === 365
                                  ? " / year"
                                  : ` / ${item.product.duration_days} days`}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none border-gray-700"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-12 rounded-none border-x-0 border-gray-700 bg-gray-800 text-center text-white"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none border-gray-700"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="border-2 border-yellow-400 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="font-medium text-white">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tax:</span>
                      <span className="font-medium text-white">$0.00</span>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total:</span>
                      <span className="font-bold text-xl text-yellow-400">${totalPrice.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300" onClick={handleCheckout}>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}