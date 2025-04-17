"use client"

import { useState } from "react"
import { Copy, Check, Code, FileCode, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function CodeMinifier() {
  const [code, setCode] = useState<string>("")
  const [minifiedCode, setMinifiedCode] = useState<string>("")
  const [language, setLanguage] = useState<string>("html")
  const [copied, setCopied] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{ original: number; minified: number; reduction: number } | null>(null)

  const minifyCode = () => {
    setError(null)

    try {
      let result = ""

      if (language === "html") {
        result = minifyHTML(code)
      } else if (language === "css") {
        result = minifyCSS(code)
      } else if (language === "js") {
        result = minifyJS(code)
      }

      setMinifiedCode(result)

      // Calculate stats
      const originalSize = code.length
      const minifiedSize = result.length
      const reduction = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0

      setStats({
        original: originalSize,
        minified: minifiedSize,
        reduction: Math.round(reduction * 100) / 100,
      })
    } catch (err) {
      setError(`Failed to minify code: ${err}`)
      setMinifiedCode("")
      setStats(null)
    }
  }

  const minifyHTML = (html: string): string => {
    // Remove comments
    html = html.replace(/<!--[\s\S]*?-->/g, "")

    // Remove whitespace between tags
    html = html.replace(/>\s+</g, "><")

    // Remove whitespace at the beginning and end of the line
    html = html.replace(/^\s+|\s+$/gm, "")

    // Remove unnecessary whitespace
    html = html.replace(/\s{2,}/g, " ")

    return html.trim()
  }

  const minifyCSS = (css: string): string => {
    // Remove comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, "")

    // Remove whitespace
    css = css.replace(/\s+/g, " ")

    // Remove spaces around selectors
    css = css.replace(/\s*([{}:;,])\s*/g, "$1")

    // Remove trailing semicolons
    css = css.replace(/;}/g, "}")

    // Remove unnecessary zeros
    css = css.replace(/0\.(\d+)/g, ".$1")

    return css.trim()
  }

  const minifyJS = (js: string): string => {
    // This is a very basic minifier
    // For production, you'd want to use a library like terser

    // Remove comments
    js = js.replace(/\/\/.*$/gm, "") // Remove single-line comments
    js = js.replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments

    // Remove whitespace
    js = js.replace(/\s+/g, " ")

    // Remove spaces around operators
    js = js.replace(/\s*([=+\-*/%&|^!<>{}[\]();:,.])\s*/g, "$1")

    // Fix issues with minus signs
    js = js.replace(/(\w+)-(\w+)/g, "$1 - $2")

    return js.trim()
  }

  const handleCopy = () => {
    if (!minifiedCode) return

    navigator.clipboard.writeText(minifiedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
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

            <Button onClick={minifyCode} className="w-full">
              Minify Code
            </Button>

            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="minified-code">Minified Code</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!minifiedCode}
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
                id="minified-code"
                readOnly
                placeholder="Minified code will appear here..."
                className="min-h-[363px] font-mono text-sm"
                value={minifiedCode}
              />
            </div>

            {stats && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2 rounded-md bg-accent">
                  <div className="text-sm font-medium">Original</div>
                  <div className="text-lg">{stats.original} bytes</div>
                </div>
                <div className="p-2 rounded-md bg-accent">
                  <div className="text-sm font-medium">Minified</div>
                  <div className="text-lg">{stats.minified} bytes</div>
                </div>
                <div className="p-2 rounded-md bg-accent">
                  <div className="text-sm font-medium">Reduction</div>
                  <div className="text-lg">{stats.reduction}%</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
