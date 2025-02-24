import { LoginButton } from "@/components/login-button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="border-b bg-white dark:bg-gray-800 shadow-md">
        <div className="container flex h-16 items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notes App</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center space-y-6 py-20 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Welcome to Notes App
          </h2>
          <p className="mx-auto text-lg text-gray-600 dark:text-gray-300 sm:max-w-2xl">
            A secure and modern note-taking application. Sign in with Google to start creating your notes.
          </p>
          <LoginButton />
        </div>
      </main>
      <footer className="border-t bg-white dark:bg-gray-800 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 Notes App. All rights reserved.</p>
      </footer>
    </div>
  )
}
