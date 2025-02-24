"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Notes } from "@/components/notes"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="border-b bg-white dark:bg-gray-800 shadow-md">
        <div className="container flex h-16 items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Notes</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="hover:bg-red-500 dark:hover:bg-red-700 transition-all"
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6 px-4 sm:px-6 lg:px-8">
          <Notes />
        </div>
      </main>
      <footer className="border-t bg-white dark:bg-gray-800 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 Notes App. All rights reserved.</p>
      </footer>
    </div>
  )
}
