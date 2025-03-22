"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user/profile")
        const data = await response.json()

        if (data.success) {
          // User is already logged in, redirect to dashboard
          router.push("/dashboard")
        }
      } catch (error) {
        // Not logged in, stay on login page
        console.error("Auth check error:", error)
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Submitting login form...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (data.success) {
        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        })

        // Add a small delay before redirecting to ensure cookie is set
        setTimeout(() => {
          router.push("/dashboard")
        }, 500)
      } else {
        setError(data.message || "An error occurred during login.")
        toast({
          title: "Login failed",
          description: data.message || "An error occurred during login.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <img src="/images/crisptvlogo.png" alt="Crisp TV Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-yellow-400">Crisp TV</span>
          </Link>
          <Card className="w-full max-w-md border-2 border-yellow-400 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-400">Sign In</CardTitle>
              <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-700 bg-gray-800 text-white"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-200">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm text-yellow-400 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-700 bg-gray-800 text-white"
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="text-center text-sm text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-yellow-400 hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

