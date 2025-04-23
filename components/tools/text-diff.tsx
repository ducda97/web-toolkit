"use client"

import { useState } from "react"
import { Copy, Check, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TextDiff() {
  const [text1, setText1] = useState<string>("")
  const [text2, setText2] = useState<string>("")
  const [diffResult, setDiffResult] = useState<string>("")
  const [diffView, setDiffView] = useState<string>("inline")
  const [copied, setCopied] = useState<boolean>(false)

  const compareTexts = () => {
    // Split texts into lines
    const lines1 = text1.split("\n")
    const lines2 = text2.split("\n")

    if (diffView === "inline") {
      // Simple inline diff
      let result = ""

      // Find the maximum length
      const maxLength = Math.max(lines1.length, lines2.length)

      for (let i = 0; i < maxLength; i++) {
        const line1 = i < lines1.length ? lines1[i] : ""
        const line2 = i < lines2.length ? lines2[i] : ""

        if (line1 === line2) {
          result += `${i + 1}: ${line1}\n`
        } else {
          result += `${i + 1}: - ${line1}\n${i + 1}: + ${line2}\n`
        }
      }

      setDiffResult(result)
    } else {
      // Side-by-side diff
      let result = "Line | Text 1 | Text 2\n"
      result += "-----|--------|-------\n"

      // Find the maximum length
      const maxLength = Math.max(lines1.length, lines2.length)

      for (let i = 0; i < maxLength; i++) {
        const line1 = i < lines1.length ? lines1[i] : ""
        const line2 = i < lines2.length ? lines2[i] : ""

        if (line1 === line2) {
          result += `${i + 1} | ${line1} | ${line2}\n`
        } else {
          result += `${i + 1} | ${line1} | ${line2} (DIFF)\n`
        }
      }

      setDiffResult(result)
    }
  }

  const handleCopy = () => {
    if (!diffResult) return

    navigator.clipboard.writeText(diffResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSwap = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-4 p-md-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-1">Text 1</Label>
              </div>
              <Textarea
                id="text-1"
                placeholder="Enter first text..."
                className="min-h-[216px]"
                value={text1}
                onChange={(e) => setText1(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 p-md-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="text-2">Text 2</Label>
                <Button variant="outline" size="sm" onClick={handleSwap} className="flex items-center gap-2 h-8">
                  <ArrowLeftRight className="h-4 w-4" />
                  Swap
                </Button>
              </div>
              <Textarea
                id="text-2"
                placeholder="Enter second text..."
                className="min-h-[200px]"
                value={text2}
                onChange={(e) => setText2(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={diffView} onValueChange={setDiffView}>
          <TabsList>
            <TabsTrigger value="inline">Inline View</TabsTrigger>
            <TabsTrigger value="side-by-side">Side-by-Side View</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={compareTexts}>Compare Texts</Button>
      </div>

      <Card>
        <CardContent className="p-4 p-md-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="diff-result">Difference Result</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!diffResult}
                className="flex items-center gap-2 h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="diff-result"
              readOnly
              placeholder="Difference result will appear here..."
              className="min-h-[300px] font-mono text-sm"
              value={diffResult}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
