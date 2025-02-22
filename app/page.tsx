import { LoginButton } from "@/components/login-button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-2xl font-bold">Notes App</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center space-y-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welcome to Notes App</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground">
            A secure and modern note-taking application. Sign in with Google to start creating your notes.
          </p>
          <LoginButton />
        </div>
      </main>
    </div>
  )
}

