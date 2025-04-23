"use client"

import { useState } from "react"
import { Copy, Check, FileJson, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState<string>("")
  const [outputJson, setOutputJson] = useState<string>("")
  const [mode, setMode] = useState<string>("format")
  const [copied, setCopied] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const processJson = () => {
    setError(null)

    try {
      // First, parse the JSON to validate it
      const parsedJson = JSON.parse(inputJson)

      if (mode === "format") {
        // Format with 2 spaces indentation
        setOutputJson(JSON.stringify(parsedJson, null, 2))
      } else {
        // Minify
        setOutputJson(JSON.stringify(parsedJson))
      }
    } catch (err) {
      setError(`Invalid JSON: ${err}`)
      setOutputJson("")
    }
  }

  const handleCopy = () => {
    if (!outputJson) return

    navigator.clipboard.writeText(outputJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSampleJson = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      isActive: true,
      address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345",
      },
      phoneNumbers: [
        {
          type: "home",
          number: "555-1234",
        },
        {
          type: "work",
          number: "555-5678",
        },
      ],
    }

    setInputJson(JSON.stringify(sample))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-4 p-md-6">
          <div className="space-y-4">
            <div>
              <Tabs value={mode} onValueChange={setMode}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="format" className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    Format JSON
                  </TabsTrigger>
                  <TabsTrigger value="minify" className="flex items-center gap-2">
                    <Minimize2 className="h-4 w-4" />
                    Minify JSON
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="input-json">Input JSON</Label>
                <Button variant="ghost" size="sm" onClick={handleSampleJson} className="h-8">
                  Load Sample
                </Button>
              </div>
              <Textarea
                id="input-json"
                placeholder="Paste your JSON here..."
                className="min-h-[300px] font-mono text-sm"
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
              />
            </div>

            <Button onClick={processJson} className="w-full">
              {mode === "format" ? "Format JSON" : "Minify JSON"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 p-md-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="output-json">{mode === "format" ? "Formatted JSON" : "Minified JSON"}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!outputJson}
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
              id="output-json"
              readOnly
              placeholder={
                mode === "format" ? "Formatted JSON will appear here..." : "Minified JSON will appear here..."
              }
              className="min-h-[340px] font-mono text-sm"
              value={outputJson}
            />

            {outputJson && mode === "minify" && (
              <div className="text-sm text-muted-foreground">
                <p>Tip: Minified JSON is more compact and uses less bandwidth when transmitting data.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
