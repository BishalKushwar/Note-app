import { auth } from "@/lib/firebase"
import { redirect } from "next/navigation"

export async function POST() {
  await auth.signOut()
  redirect("/")
}

