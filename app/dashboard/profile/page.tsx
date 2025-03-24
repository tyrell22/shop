"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { Package, User, ChevronRight, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordError("");
    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "Password Change Failed",
          description: data.message || "Failed to change password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "An error occurred while changing your password.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

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

  // Define navigation items for sidebar
  const navigationItems = [
    { href: "/dashboard", icon: <Package className="h-5 w-5" />, label: "My Subscriptions", active: false },
    { href: "/dashboard/profile", icon: <User className="h-5 w-5" />, label: "Profile", active: true }
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-yellow-400">Loading...</div>
      </div>
    );
  }

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
                  <User className="mr-2 h-5 w-5" />
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
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-yellow-400">
              <Package className="h-4 w-4" />
              My Subscriptions
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2 text-yellow-400">
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
          <div className="grid gap-6">
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">Update your profile information</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="bg-gray-800 text-white border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-gray-800 text-white border-gray-700"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-yellow-400 text-black hover:bg-yellow-300" 
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">Change Password</CardTitle>
                <CardDescription className="text-gray-400">Update your account password</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  {passwordError && (
                    <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                      {passwordError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-gray-200">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-800 text-white border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-gray-200">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-800 text-white border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-200">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-800 text-white border-gray-700"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-yellow-400 text-black hover:bg-yellow-300" 
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Changing Password..." : "Change Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}