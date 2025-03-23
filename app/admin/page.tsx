"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, CreditCard, Settings, Loader2, Edit, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { sendEmail, generateM3uUpdateEmail } from "@/lib/email-service"; // Add import

type DashboardStats = {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number | string;
  totalProducts: number;
  recentOrders: {
    id: number;
    total_amount: number | string;
    status: string;
    created_at: string;
    user_name: string;
    user_email: string;
  }[];
  activeSubscriptionsList: {
    id: number;
    user_id: number;
    product_id: number;
    start_date: string;
    end_date: string;
    status: string;
    user_name: string;
    product_name: string;
    m3u_url?: string;
  }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [m3uUrl, setM3uUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch dashboard statistics",
            variant: "destructive",
          });
          setStats({
            totalUsers: 0,
            activeSubscriptions: 0,
            totalRevenue: 0,
            totalProducts: 0,
            recentOrders: [],
            activeSubscriptionsList: [],
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard statistics",
          variant: "destructive",
        });
        setStats({
          totalUsers: 0,
          activeSubscriptions: 0,
          totalRevenue: 0,
          totalProducts: 0,
          recentOrders: [],
          activeSubscriptionsList: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const handleUpdateM3uUrl = async () => {
    if (!selectedSubscriptionId || !m3uUrl) return;

    try {
      const response = await fetch("/api/admin/subscriptions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: selectedSubscriptionId, m3uUrl }),
      });
      const data = await response.json();

      if (data.success) {
        const updatedSubscription = data.subscription;
        setStats((prev) =>
          prev
            ? {
                ...prev,
                activeSubscriptionsList: prev.activeSubscriptionsList.map((sub) =>
                  sub.id === selectedSubscriptionId ? { ...sub, m3u_url: m3uUrl } : sub
                ),
              }
            : prev
        );
        toast({ title: "Success", description: "M3U URL updated successfully" });

        // Find the subscription and user details for email
        const subscription = stats?.activeSubscriptionsList.find((sub) => sub.id === selectedSubscriptionId);
        if (subscription) {
          const user = await getUserById(subscription.user_id);
          const product = await getProductById(subscription.product_id);

          if (user && product) {
            const emailTemplate = generateM3uUpdateEmail(user.name, {
              subscriptionId: subscription.id,
              productName: product.name,
              startDate: new Date(subscription.start_date),
              endDate: new Date(subscription.end_date),
              m3uUrl,
            });
            const emailResult = await sendEmail(user.email, emailTemplate);
            if (!emailResult.success) {
              console.error("Email failed:", emailResult.message, emailResult.error);
              toast({
                title: "Email Warning",
                description: "M3U URL updated, but email failed to send.",
                variant: "destructive",
              });
            } else {
              console.log("M3U update email sent to:", user.email);
            }
          }
        }
      } else {
        toast({ title: "Error", description: data.message || "Failed to update M3U URL", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating M3U URL:", error);
      toast({ title: "Error", description: "Failed to update M3U URL", variant: "destructive" });
    } finally {
      setDialogOpen(false);
      setM3uUrl("");
      setSelectedSubscriptionId(null);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await response.json();

      if (data.success) {
        setStats((prev) =>
          prev
            ? {
                ...prev,
                activeSubscriptionsList: prev.activeSubscriptionsList.map((sub) =>
                  sub.id === subscriptionId ? { ...sub, status: "canceled" } : sub
                ),
                activeSubscriptions: prev.activeSubscriptions - 1,
              }
            : prev
        );
        toast({ title: "Success", description: "Subscription canceled successfully" });
      } else {
        toast({ title: "Error", description: data.message || "Failed to cancel subscription", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({ title: "Error", description: "Failed to cancel subscription", variant: "destructive" });
    }
  };

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
    );
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
                  ${stats?.totalRevenue ? Number(stats.totalRevenue).toFixed(2) : "0.00"}
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
                          <p className="font-medium text-yellow-400">${Number(order.total_amount).toFixed(2)}</p>
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

            <Card className="border-2 border-yellow-400 bg-gray-900 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-yellow-400">Active Subscriptions</CardTitle>
                <CardDescription className="text-gray-400">Manage current subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.activeSubscriptionsList && stats.activeSubscriptionsList.length > 0 ? (
                  <div className="space-y-4">
                    {stats.activeSubscriptionsList.map((sub) => (
                      <div key={sub.id} className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <div>
                          <p className="font-medium text-white">Subscription #{sub.id}</p>
                          <p className="text-sm text-gray-400">{sub.user_name} - {sub.product_name}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(sub.start_date), "MMM dd, yyyy")} -{" "}
                            {format(new Date(sub.end_date), "MMM dd, yyyy")}
                          </p>
                          {sub.m3u_url && <p className="text-xs text-gray-600 truncate">M3U: {sub.m3u_url}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                            onClick={() => {
                              setSelectedSubscriptionId(sub.id);
                              setM3uUrl(sub.m3u_url || "");
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Update Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                            onClick={() => handleCancelSubscription(sub.id)}
                            disabled={sub.status === "canceled"}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-gray-800 p-4">
                    <div className="text-center text-gray-400">No active subscriptions to display.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border-2 border-yellow-400 p-6 rounded-lg w-full max-w-md">
            <Dialog.Title className="text-yellow-400 text-xl font-bold">Update Subscription Details</Dialog.Title>
            <Dialog.Description className="text-gray-400 mt-2">
              Enter the M3U URL for Subscription #{selectedSubscriptionId}.
            </Dialog.Description>
            <div className="mt-4">
              <Input
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
                placeholder="Enter M3U URL"
                className="bg-black text-white border-gray-700 focus:border-yellow-400"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                onClick={handleUpdateM3uUrl}
                className="bg-yellow-400 text-black hover:bg-yellow-300"
                disabled={!m3uUrl}
              >
                Save
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
