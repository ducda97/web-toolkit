"use client"

import { useState } from "react"
import { Copy, Check, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CaseConverter() {
  const [inputText, setInputText] = useState<string>("")
  const [outputText, setOutputText] = useState<string>("")
  const [caseType, setCaseType] = useState<string>("uppercase")
  const [copied, setCopied] = useState<boolean>(false)

  const convertCase = () => {
    let result = ""

    switch (caseType) {
      case "uppercase":
        result = inputText.toUpperCase()
        break
      case "lowercase":
        result = inputText.toLowerCase()
        break
      case "titlecase":
        result = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        break
      case "sentencecase":
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        break
      case "alternatingcase":
        result = inputText
          .split("")
          .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
          .join("")
        break
      case "inversecase":
        result = inputText
          .split("")
          .map((char) => {
            if (char === char.toUpperCase()) {
              return char.toLowerCase()
            }
            return char.toUpperCase()
          })
          .join("")
        break
      default:
        result = inputText
    }

    setOutputText(result)
  }

  const handleCopy = () => {
    if (!outputText) return

    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Input Text</Label>
              <Textarea
                id="input-text"
                placeholder="Enter text to convert..."
                className="min-h-[200px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Case Type</Label>
              <RadioGroup value={caseType} onValueChange={setCaseType} className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="uppercase" id="uppercase" />
                  <Label htmlFor="uppercase">UPPERCASE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lowercase" id="lowercase" />
                  <Label htmlFor="lowercase">lowercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="titlecase" id="titlecase" />
                  <Label htmlFor="titlecase">Title Case</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sentencecase" id="sentencecase" />
                  <Label htmlFor="sentencecase">Sentence case</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alternatingcase" id="alternatingcase" />
                  <Label htmlFor="alternatingcase">AlTeRnAtInG cAsE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inversecase" id="inversecase" />
                  <Label htmlFor="inversecase">iNVERSE cASE</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={convertCase} className="w-full">
              Convert Text
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="output-text">Converted Text</Label>
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

            {inputText && !outputText ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <ArrowDown className="h-8 w-8 mb-2 animate-bounce" />
                <p>Click "Convert Text" to see the result</p>
              </div>
            ) : (
              <Textarea
                id="output-text"
                readOnly
                placeholder="Converted text will appear here..."
                className="min-h-[200px]"
                value={outputText}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
