"use client"

import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"

export function LoginButton() {
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  return (
    <Button onClick={handleLogin} size="lg">
      Sign in with Google
    </Button>
  )
}

