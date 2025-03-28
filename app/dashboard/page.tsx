"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, CreditCard, Settings, User, Trash2, Eye, Copy, Menu, ChevronRight } from "lucide-react"; 
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { SiteHeader } from "@/components/site-header";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

type UserType = {
  id: number;
  name: string;
  email: string;
};

type Subscription = {
  id: number;
  product_id: number;
  start_date: string;
  end_date: string;
  status: string;
  product_name: string;
  product_price: number | string;
  m3u_url?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [expiredSubscriptions, setExpiredSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await fetch("/api/user/profile");
        const profileData = await profileResponse.json();

        if (profileData.success) {
          setUser(profileData.user);

          const activeResponse = await fetch("/api/subscriptions?filter=active");
          const activeData = await activeResponse.json();
          if (activeData.success) setActiveSubscriptions(activeData.subscriptions);

          const expiredResponse = await fetch("/api/subscriptions?filter=expired");
          const expiredData = await expiredResponse.json();
          if (expiredData.success) setExpiredSubscriptions(expiredData.subscriptions);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router, toast]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        toast({ title: "Logged out", description: "You have been logged out successfully." });
        router.push("/login");
      }
    } catch (error) {
      toast({ title: "Logout failed", description: "An error occurred during logout.", variant: "destructive" });
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
        setActiveSubscriptions((prev) =>
          prev.map((sub) => (sub.id === subscriptionId ? { ...sub, status: "canceled" } : sub))
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

  const handleCopyM3uUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Copied!",
        description: "M3U URL has been copied to your clipboard.",
      });
    }).catch((err) => {
      console.error("Failed to copy M3U URL:", err);
      toast({
        title: "Error",
        description: "Failed to copy M3U URL. Please copy it manually.",
        variant: "destructive",
      });
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-yellow-400">Loading...</div>
      </div>
    );
  }
  
  const navigationItems = [
    { href: "/dashboard", icon: <Package className="h-5 w-5" />, label: "My Subscriptions", active: true },
    { href: "/dashboard/profile", icon: <User className="h-5 w-5" />, label: "Profile", active: false }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <div className="container px-4 py-6 md:px-6 flex flex-col md:flex-row md:gap-6">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between border-yellow-400 text-yellow-400"
              >
                <span className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Dashboard Navigation
                </span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] bg-black border-r border-gray-800 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-yellow-400">Dashboard</h2>
                    <SheetClose className="rounded-full border border-gray-700 p-1 text-gray-400 hover:text-white">
                      <X className="h-4 w-4" />
                    </SheetClose>
                  </div>
                </div>
                <div className="flex-1 py-4">
                  <nav className="space-y-1 px-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center py-2 px-3 rounded-md ${
                          item.active
                            ? "bg-gray-800 text-yellow-400"
                            : "text-gray-400 hover:bg-gray-900 hover:text-yellow-400"
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="border-t border-gray-800 p-4">
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block sticky top-24 h-[calc(100vh-6rem)] w-[240px] shrink-0 overflow-y-auto border-r border-gray-800 pr-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2 text-yellow-400">
              <Package className="h-4 w-4" />
              My Subscriptions
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-yellow-400">
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-3 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 px-3 py-2"
            >
              Logout
            </Button>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 w-full">
          <Tabs defaultValue="active" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-gray-800">
                <TabsTrigger value="active" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                  Active
                </TabsTrigger>
                <TabsTrigger value="expired" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                  Expired
                </TabsTrigger>
              </TabsList>
              <Link href="/packages">
                <Button className="w-full sm:w-auto bg-yellow-400 text-black hover:bg-yellow-300">Buy Subscription</Button>
              </Link>
            </div>
            
            <TabsContent value="active" className="mt-6">
              <Card className="border-2 border-yellow-400 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Active Subscriptions</CardTitle>
                  <CardDescription className="text-gray-400">Your current active Crisp TV subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeSubscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {activeSubscriptions.map((subscription) => (
                        <div key={subscription.id} className="rounded-md border border-gray-800 p-4">
                          <div className="flex flex-col gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-yellow-400">{subscription.product_name}</h3>
                              <p className="text-sm text-gray-400 mt-1">
                                Valid from {formatDate(subscription.start_date)} to {formatDate(subscription.end_date)}
                              </p>
                              <div className="flex items-center mt-2">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  {subscription.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                                onClick={() => {
                                  setSelectedSubscription(subscription);
                                  setDialogOpen(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                                onClick={() => handleCancelSubscription(subscription.id)}
                                disabled={subscription.status === "canceled"}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-gray-800 p-4">
                      <div className="text-center text-gray-400">You don't have any active subscriptions yet.</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="expired" className="mt-6">
              <Card className="border-2 border-yellow-400 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Expired Subscriptions</CardTitle>
                  <CardDescription className="text-gray-400">Your expired Crisp TV subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  {expiredSubscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {expiredSubscriptions.map((subscription) => (
                        <div key={subscription.id} className="rounded-md border border-gray-800 p-4">
                          <div className="flex flex-col gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-300">{subscription.product_name}</h3>
                              <p className="text-sm text-gray-400 mt-1">Expired on {formatDate(subscription.end_date)}</p>
                              <div className="flex items-center mt-2">
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                  Expired
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Link href={`/packages?renew=${subscription.product_id}`}>
                                <Button className="w-full sm:w-auto bg-yellow-400 text-black hover:bg-yellow-300">Renew</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-gray-800 p-4">
                      <div className="text-center text-gray-400">You don't have any expired subscriptions.</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Modal for Subscription Details */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border-2 border-yellow-400 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
            <Dialog.Title className="text-yellow-400 text-xl font-bold">Subscription Details</Dialog.Title>
            <Dialog.Description className="text-gray-400 mt-2">
              Details for Subscription #{selectedSubscription?.id}.
            </Dialog.Description>
            {selectedSubscription && (
              <div className="mt-4 space-y-3 text-gray-300">
                <p><strong>Subscription ID:</strong> #{selectedSubscription.id}</p>
                <p><strong>Package:</strong> {selectedSubscription.product_name}</p>
                <p><strong>Price:</strong> ${Number(selectedSubscription.product_price).toFixed(2)}</p>
                <p><strong>Start Date:</strong> {formatDate(selectedSubscription.start_date)}</p>
                <p><strong>End Date:</strong> {formatDate(selectedSubscription.end_date)}</p>
                <p><strong>Status:</strong> {selectedSubscription.status}</p>
                {selectedSubscription.m3u_url && (
                  <div className="space-y-2">
                    <p><strong>M3U URL:</strong></p>
                    <div className="bg-black p-3 rounded-md border border-gray-700 break-all text-sm">
                      {selectedSubscription.m3u_url}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      onClick={() => handleCopyM3uUrl(selectedSubscription.m3u_url!)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                  Close
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}