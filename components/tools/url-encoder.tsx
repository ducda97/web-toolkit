"use client"

import { useState } from "react"
import { Copy, Check, ArrowDownUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UrlEncoder() {
  const [inputText, setInputText] = useState<string>("")
  const [outputText, setOutputText] = useState<string>("")
  const [mode, setMode] = useState<string>("encode")
  const [copied, setCopied] = useState<boolean>(false)

  const processText = () => {
    try {
      if (mode === "encode") {
        setOutputText(encodeURIComponent(inputText))
      } else {
        setOutputText(decodeURIComponent(inputText))
      }
    } catch (error) {
      setOutputText(`Error: ${error}`)
    }
  }

  const handleCopy = () => {
    if (!outputText) return

    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSwap = () => {
    setInputText(outputText)
    setOutputText("")
    setMode(mode === "encode" ? "decode" : "encode")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-4 p-md-6">
          <div className="space-y-4">
            <div>
              <Tabs value={mode} onValueChange={setMode}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="encode">Encode URL</TabsTrigger>
                  <TabsTrigger value="decode">Decode URL</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="input-text">{mode === "encode" ? "Text to Encode" : "URL to Decode"}</Label>
              <Textarea
                id="input-text"
                placeholder={mode === "encode" ? "Enter text to encode..." : "Enter URL to decode..."}
                className="min-h-[200px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={processText} className="flex-1">
                {mode === "encode" ? "Encode" : "Decode"}
              </Button>
              <Button variant="outline" onClick={handleSwap} disabled={!outputText} className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4" />
                Swap
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 p-md-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="output-text">{mode === "encode" ? "Encoded URL" : "Decoded Text"}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!outputText}
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
              id="output-text"
              readOnly
              placeholder={mode === "encode" ? "Encoded URL will appear here..." : "Decoded text will appear here..."}
              className="min-h-[235px]"
              value={outputText}
            />

            {outputText && mode === "encode" && (
              <div className="text-sm text-muted-foreground">
                <p>Tip: Encoded URLs are safe to use in query parameters and form submissions.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
