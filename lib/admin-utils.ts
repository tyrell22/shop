// Helper function to check if user is admin
export async function isAdmin(userId: number): Promise<boolean> {
  try {
    // For now, we'll consider user with ID 1 as admin
    // In a real app, you would check if the user has admin role in the database
    return userId === 1
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

