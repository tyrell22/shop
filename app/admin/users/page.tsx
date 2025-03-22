"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, UserX, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: number
  name: string
  email: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
      } else {
        // If API fails, use sample data
        setUsers([
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            created_at: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
      // Use sample data on error
      setUsers([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-black">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/crisptvlogo.png" alt="Crisp TV Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-yellow-400">Crisp TV</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-yellow-400">Manage Users</h1>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-700 bg-gray-800 text-white"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-yellow-400">Loading users...</div>
          ) : (
            <Card className="border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="px-4 py-2 text-left text-gray-400">ID</th>
                          <th className="px-4 py-2 text-left text-gray-400">Name</th>
                          <th className="px-4 py-2 text-left text-gray-400">Email</th>
                          <th className="px-4 py-2 text-left text-gray-400">Joined</th>
                          <th className="px-4 py-2 text-right text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-800">
                            <td className="px-4 py-4 text-white">{user.id}</td>
                            <td className="px-4 py-4 text-white">{user.name}</td>
                            <td className="px-4 py-4 text-white">{user.email}</td>
                            <td className="px-4 py-4 text-white">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                                >
                                  <Mail className="h-4 w-4" />
                                  <span className="sr-only">Email</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                  <UserX className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">No users found matching your search criteria.</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

