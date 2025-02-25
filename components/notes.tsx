"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  createdAt: any
  userId: string
  recommendation?: string // New field for AI recommendations
}

export function Notes() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [generatingRecommendation, setGeneratingRecommendation] = useState(false)

  useEffect(() => {
    if (!user || !db) return
    try {
      const q = query(collection(db, "notes"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[]
        setNotes(notesData)
        setLoading(false)
      })
      return () => unsubscribe()
    } catch (error) {
      console.error("Error fetching notes:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to load notes. Please try again later.",
        variant: "destructive",
      })
    }
  }, [user, toast])

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db || !newNote.title || !newNote.content) return
    try {
      await addDoc(collection(db, "notes"), {
        ...newNote,
        userId: user.uid,
        createdAt: new Date(),
      })
      setNewNote({ title: "", content: "" })
      toast({
        title: "Success",
        description: "Note created successfully",
      })
    } catch (error) {
      console.error("Error creating note:", error)
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!db) return
    try {
      await deleteDoc(doc(db, "notes", noteId))
      toast({
        title: "Success",
        description: "Note deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateAiRecommendation = async (noteId: string, noteContent: string) => {
    if (!noteContent.trim()) return
    setGeneratingRecommendation(true)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: noteContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recommendation")
      }

      const data = await response.json()

      // Update the note in Firestore with the recommendation
      await updateDoc(doc(db, "notes", noteId), {
        recommendation: data.recommendation,
      })

      toast({
        title: "Success",
        description: "AI recommendation generated and saved successfully",
      })
    } catch (error) {
      console.error("Error generating AI recommendation:", error)
      toast({
        title: "Error",
        description: "Failed to generate or save AI recommendation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGeneratingRecommendation(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreateNote} className="space-y-4">
        <Input
          placeholder="Note title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="Note content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          required
        />
        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{note.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{note.content}</p>
              {note.recommendation && (
                <div className="mt-4 p-2 border rounded-md bg-secondary">
                  <p className="text-xs font-medium">AI Recommendation:</p>
                  <p className="text-sm">{note.recommendation}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAiRecommendation(note.id, note.content)}
                disabled={generatingRecommendation}
              >
                {generatingRecommendation ? "Generating..." : "Get AI Recommendation"}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete note</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}