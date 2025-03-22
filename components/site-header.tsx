"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"

export function SiteHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    setIsClient(true)
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user/profile")
        const data = await response.json()
        setIsAuthenticated(data.success)
      } catch (error) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-black">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/crisptvlogo.png" alt="Crisp TV Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-yellow-400">Crisp TV</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-yellow-400 transition-colors hover:text-yellow-300">
            Home
          </Link>
          <Link
            href="/packages"
            className="text-sm font-medium text-yellow-400 transition-colors hover:text-yellow-300"
          >
            Packages
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium text-yellow-400 transition-colors hover:text-yellow-300"
          >
            Features
          </Link>
          <Link href="/support" className="text-sm font-medium text-yellow-400 transition-colors hover:text-yellow-300">
            Support
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isClient && (
            <>
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    <User className="w-5 h-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </Link>
              )}
              {!isAuthenticated && (
                <Link href="/register">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Get Started</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

