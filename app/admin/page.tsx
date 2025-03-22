"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, CreditCard, Settings, Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type DashboardStats = {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  totalProducts: number
  recentOrders: {
    id: number
    total_amount: number
    status: string
    created_at: string
    user_name: string
    user_email: string
  }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch dashboard statistics",
            variant: "destructive",
          })
          // Set default stats
          setStats({
            totalUsers: 0,
            activeSubscriptions: 0,
            totalRevenue: 0,
            totalProducts: 0,
            recentOrders: [],
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          title: "Error",
          description: "Failed to fetch dashboard statistics",
          variant: "destructive",
        })
        // Set default stats
        setStats({
          totalUsers: 0,
          activeSubscriptions: 0,
          totalRevenue: 0,
          totalProducts: 0,
          recentOrders: [],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mb-2" />
            <p className="text-yellow-400">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold text-yellow-400 mb-8">Admin Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-400">Total Users</CardTitle>
                <CardDescription className="text-gray-400">Active user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-400">Active Subscriptions</CardTitle>
                <CardDescription className="text-gray-400">Current active plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats?.activeSubscriptions || 0}</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-400">Total Revenue</CardTitle>
                <CardDescription className="text-gray-400">Lifetime earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : "0.00"}
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-400">Products</CardTitle>
                <CardDescription className="text-gray-400">Available packages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats?.totalProducts || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-8 md:grid-cols-2">
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Link href="/admin/products">
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300 justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Orders
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Site Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <div>
                          <p className="font-medium text-white">Order #{order.id}</p>
                          <p className="text-sm text-gray-400">{order.user_name}</p>
                          <p className="text-xs text-gray-500">{format(new Date(order.created_at), "MMM dd, yyyy")}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-yellow-400">${order.total_amount.toFixed(2)}</p>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-gray-800 p-4">
                    <div className="text-center text-gray-400">No recent activity to display.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

