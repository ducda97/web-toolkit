"use client"

import { useState, useEffect } from "react"
import { Clock, BookOpen, Hash, AlignJustify } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  readingTime: number
}

export default function WordCounter() {
  const [text, setText] = useState<string>("")
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  })

  useEffect(() => {
    analyzeText(text)
  }, [text])

  const analyzeText = (text: string) => {
    // Count characters
    const characters = text.length

    // Count characters without spaces
    const charactersNoSpaces = text.replace(/\s/g, "").length

    // Count words
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length

    // Count sentences
    const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length

    // Count paragraphs
    const paragraphs = text === "" ? 0 : text.split(/\n+/).filter((s) => s.trim().length > 0).length

    // Calculate reading time (average reading speed: 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(words / 200))

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    })
  }

  const handleClear = () => {
    setText("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-input">Enter Text</Label>
                <Button variant="outline" size="sm" onClick={handleClear} disabled={!text} className="h-8">
                  Clear
                </Button>
              </div>
              <Textarea
                id="text-input"
                placeholder="Type or paste your text here..."
                className="min-h-[400px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Text Statistics</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Hash className="h-4 w-4" />
                    </div>
                    <span>Characters</span>
                  </div>
                  <span className="text-xl font-medium">{stats.characters}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Hash className="h-4 w-4" />
                    </div>
                    <span>Characters (no spaces)</span>
                  </div>
                  <span className="text-xl font-medium">{stats.charactersNoSpaces}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <AlignJustify className="h-4 w-4" />
                    </div>
                    <span>Words</span>
                  </div>
                  <span className="text-xl font-medium">{stats.words}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span>Sentences</span>
                  </div>
                  <span className="text-xl font-medium">{stats.sentences}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <AlignJustify className="h-4 w-4" />
                    </div>
                    <span>Paragraphs</span>
                  </div>
                  <span className="text-xl font-medium">{stats.paragraphs}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span>Reading Time</span>
                  </div>
                  <span className="text-xl font-medium">{stats.readingTime} min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
