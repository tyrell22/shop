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
import { Package, User } from "lucide-react"; // Add icons for sidebar

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-yellow-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 md:py-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Sidebar Navigation */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-gray-800 py-6 pr-2 md:sticky md:block lg:py-10">
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
              className="flex items-center gap-3 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 px-3 py-2"
            >
              Logout
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden p-4 md:p-0">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">My Profile</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">Update your account details</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      disabled={isSaving}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-300" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">Change Password</CardTitle>
                <CardDescription className="text-gray-400">Update your password</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-gray-200">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      disabled={isChangingPassword}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-gray-200">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      disabled={isChangingPassword}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-200">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`border-gray-700 bg-gray-800 text-white ${passwordError ? "border-red-500" : ""}`}
                      disabled={isChangingPassword}
                      required
                    />
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
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
