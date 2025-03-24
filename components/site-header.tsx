"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, ShoppingCart, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"

export function SiteHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { totalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Packages" },
    { href: "/features", label: "Features" },
    { href: "/support", label: "Support" }
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-black">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/crisptvlogo.png" alt="Crisp TV Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-yellow-400">Crisp TV</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-yellow-400 transition-colors hover:text-yellow-300"
            >
              {link.label}
            </Link>
          ))}
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
                <Link href="/dashboard" className="hidden md:block">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hidden md:block">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      <User className="w-5 h-5" />
                      <span className="sr-only">Account</span>
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden md:block">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Get Started</Button>
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="md:hidden border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] bg-black border-l border-gray-800 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-yellow-400">Menu</h2>
                        <SheetClose className="rounded-full border border-gray-700 p-1 text-gray-400 hover:text-white">
                          <X className="h-4 w-4" />
                        </SheetClose>
                      </div>
                    </div>
                    <div className="flex-1 py-4">
                      <nav className="space-y-2 px-2">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center py-2 px-3 rounded-md text-yellow-400 hover:bg-gray-900"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                    <div className="border-t border-gray-800 p-4 space-y-2">
                      {isAuthenticated ? (
                        <Link href="/dashboard" className="w-full">
                          <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300">Dashboard</Button>
                        </Link>
                      ) : (
                        <>
                          <Link href="/login" className="w-full">
                            <Button
                              variant="outline"
                              className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                            >
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/register" className="w-full">
                            <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300">
                              Get Started
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  )
}