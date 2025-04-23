"use client"

import { useState } from "react"
import { Copy, Check, Code, FileCode, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function CodeFormatter() {
  const [code, setCode] = useState<string>("")
  const [formattedCode, setFormattedCode] = useState<string>("")
  const [language, setLanguage] = useState<string>("html")
  const [copied, setCopied] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const formatCode = () => {
    setError(null)

    try {
      let result = ""

      if (language === "html") {
        result = formatHTML(code)
      } else if (language === "css") {
        result = formatCSS(code)
      } else if (language === "js") {
        result = formatJS(code)
      }

      setFormattedCode(result)
    } catch (err) {
      setError(`Failed to format code: ${err}`)
      setFormattedCode("")
    }
  }

  const formatHTML = (html: string): string => {
    let formatted = ""
    let indent = 0

    // Remove existing whitespace
    html = html.replace(/\s+</g, "<").trim()

    // Process each character
    for (let i = 0; i < html.length; i++) {
      const char = html[i]

      if (char === "<") {
        // Check if this is a closing tag
        if (html[i + 1] === "/") {
          indent--
          formatted += "\n" + "  ".repeat(Math.max(0, indent)) + "<"
        } else {
          formatted += "\n" + "  ".repeat(indent) + "<"
          // Don't indent for self-closing tags or comments
          if (
            html.substring(i, i + 4) !== "<!--" &&
            html.substring(i, i + 2) !== "<!" &&
            html.substring(i + 1, i + 4) !== "img" &&
            html.substring(i + 1, i + 3) !== "br" &&
            html.substring(i + 1, i + 3) !== "hr" &&
            html.substring(i + 1, i + 5) !== "meta" &&
            html.substring(i + 1, i + 5) !== "link" &&
            html.substring(i + 1, i + 6) !== "input" &&
            html.indexOf("/>", i) - i > 10
          ) {
            indent++
          }
        }
      } else {
        formatted += char
      }
    }

    return formatted.trim()
  }

  const formatCSS = (css: string): string => {
    // Remove all whitespace
    css = css.replace(/\s+/g, " ").trim()

    // Add newlines and indentation
    css = css.replace(/\{/g, " {\n  ")
    css = css.replace(/;/g, ";\n  ")
    css = css.replace(/\}/g, "\n}\n\n")
    css = css.replace(/\n {2}\n/g, "\n")

    return css.trim()
  }

  const formatJS = (js: string): string => {
    // This is a very basic formatter
    // For production, you'd want to use a library like prettier
    let formatted = ""
    let indent = 0
    let inString = false
    let stringChar = ""

    // Process each character
    for (let i = 0; i < js.length; i++) {
      const char = js[i]

      // Handle strings
      if ((char === "'" || char === '"' || char === "`") && (i === 0 || js[i - 1] !== "\\")) {
        if (inString && stringChar === char) {
          inString = false
        } else if (!inString) {
          inString = true
          stringChar = char
        }
      }

      if (!inString) {
        if (char === "{" || char === "[") {
          formatted += char + "\n" + "  ".repeat(++indent)
        } else if (char === "}" || char === "]") {
          formatted += "\n" + "  ".repeat(--indent) + char
        } else if (char === ";") {
          formatted += char + "\n" + "  ".repeat(indent)
        } else if (char === "\n") {
          formatted += "\n" + "  ".repeat(indent)
        } else {
          formatted += char
        }
      } else {
        formatted += char
      }
    }

    return formatted.trim()
  }

  const handleCopy = () => {
    if (!formattedCode) return

    navigator.clipboard.writeText(formattedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-4 p-md-6">
          <div className="space-y-4">
            <div>
              <Label>Language</Label>
              <Tabs value={language} onValueChange={setLanguage} className="mt-2">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="html" className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    HTML
                  </TabsTrigger>
                  <TabsTrigger value="css" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="js" className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JavaScript
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="input-code">Input Code</Label>
              <Textarea
                id="input-code"
                placeholder={`Paste your ${language.toUpperCase()} code here...`}
                className="min-h-[300px] font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <Button onClick={formatCode} className="w-full">
              Format Code
            </Button>

            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 p-md-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="formatted-code">Formatted Code</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!formattedCode}
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
            <div className="relative">
              <Textarea
                id="formatted-code"
                readOnly
                placeholder="Formatted code will appear here..."
                className="min-h-[363px] font-mono text-sm"
                value={formattedCode}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
