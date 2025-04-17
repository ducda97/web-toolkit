"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Download, ArrowLeftRight, Code, FileCode, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified"
  lineNumber1?: number
  lineNumber2?: number
  content: string
}

export default function CodeCompare() {
  const [code1, setCode1] = useState<string>("")
  const [code2, setCode2] = useState<string>("")
  const [language, setLanguage] = useState<string>("javascript")
  const [diffResult, setDiffResult] = useState<DiffLine[]>([])
  const [diffView, setDiffView] = useState<string>("split")
  const [copied, setCopied] = useState<string | null>(null)

  // Sample code for each language
  const sampleCode = {
    javascript: {
      code1: `function calculateTotal(items) {
  return items
    .map(item => item.price * item.quantity)
    .reduce((total, value) => total + value, 0);
}

// Calculate the order total
const orderItems = [
  { name: 'Widget', price: 9.99, quantity: 2 },
  { name: 'Gadget', price: 14.95, quantity: 1 }
];
const total = calculateTotal(orderItems);
console.log(\`Order total: \${total}\`);`,
      code2: `function calculateTotal(items) {
  return items
    .map(item => item.price * item.quantity)
    .reduce((total, value) => total + value, 0);
}

// Apply discount if available
function applyDiscount(total, discountCode) {
  if (discountCode === 'SAVE10') {
    return total * 0.9;
  }
  return total;
}

// Calculate the order total
const orderItems = [
  { name: 'Widget', price: 9.95, quantity: 2 },
  { name: 'Gadget', price: 14.95, quantity: 1 }
];
const total = calculateTotal(orderItems);
const discountedTotal = applyDiscount(total, 'SAVE10');
console.log(\`Order total: \${discountedTotal}\`);`,
    },
    html: {
      code1: `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h2>About Us</h2>
    <p>This is a paragraph about our company.</p>
  </main>
  <footer>
    <p>&copy; 2023 My Website</p>
  </footer>
</body>
</html>`,
      code2: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Updated Website</title>
  <link rel="stylesheet" href="styles.css">
  <script src="main.js" defer></script>
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/blog">Blog</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section>
      <h2>About Us</h2>
      <p>This is a paragraph about our company and our mission.</p>
      <button id="learn-more">Learn More</button>
    </section>
  </main>
  <footer>
    <p>&copy; 2023 My Website. All rights reserved.</p>
  </footer>
</body>
</html>`,
    },
    css: {
      code1: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background-color: #333;
  color: white;
  padding: 10px 0;
}

.button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
      code2: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}`,
    },
  }

  // Load sample code when language changes
  useEffect(() => {
    if (language in sampleCode) {
      setCode1(sampleCode[language as keyof typeof sampleCode].code1)
      setCode2(sampleCode[language as keyof typeof sampleCode].code2)
    }
  }, [language])

  // Compare code when inputs change
  useEffect(() => {
    if (code1 && code2) {
      compareCode()
    }
  }, [code1, code2, diffView])

  const compareCode = () => {
    // Split code into lines
    const lines1 = code1.split("\n")
    const lines2 = code2.split("\n")

    // Simple line-by-line diff
    if (diffView === "split") {
      // For split view, we need to align lines side by side
      const result: DiffLine[] = []
      const maxLines = Math.max(lines1.length, lines2.length)

      for (let i = 0; i < maxLines; i++) {
        const line1 = i < lines1.length ? lines1[i] : ""
        const line2 = i < lines2.length ? lines2[i] : ""

        if (line1 === line2) {
          result.push({
            type: "unchanged",
            lineNumber1: i + 1,
            lineNumber2: i + 1,
            content: line1,
          })
        } else if (line1 === "" && line2 !== "") {
          result.push({
            type: "added",
            lineNumber2: i + 1,
            content: line2,
          })
        } else if (line1 !== "" && line2 === "") {
          result.push({
            type: "removed",
            lineNumber1: i + 1,
            content: line1,
          })
        } else {
          result.push({
            type: "modified",
            lineNumber1: i + 1,
            lineNumber2: i + 1,
            content: line1 + " → " + line2,
          })
        }
      }

      setDiffResult(result)
    } else {
      // For unified view, we show additions and deletions in sequence
      const result: DiffLine[] = []
      let line1Index = 0
      let line2Index = 0

      while (line1Index < lines1.length || line2Index < lines2.length) {
        if (line1Index < lines1.length && line2Index < lines2.length && lines1[line1Index] === lines2[line2Index]) {
          // Unchanged line
          result.push({
            type: "unchanged",
            lineNumber1: line1Index + 1,
            lineNumber2: line2Index + 1,
            content: lines1[line1Index],
          })
          line1Index++
          line2Index++
        } else {
          // Check for removed lines
          if (line1Index < lines1.length) {
            result.push({
              type: "removed",
              lineNumber1: line1Index + 1,
              content: lines1[line1Index],
            })
            line1Index++
          }

          // Check for added lines
          if (line2Index < lines2.length) {
            result.push({
              type: "added",
              lineNumber2: line2Index + 1,
              content: lines2[line2Index],
            })
            line2Index++
          }
        }
      }

      setDiffResult(result)
    }
  }

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSwap = () => {
    const temp = code1
    setCode1(code2)
    setCode2(temp)
  }

  const handleDownload = () => {
    // Create a formatted diff output
    let diffOutput = `Code Comparison - ${new Date().toLocaleString()}\n\n`
    diffOutput += `Language: ${language}\n\n`
    diffOutput += `--- Original\n+++ Modified\n\n`

    diffResult.forEach((line) => {
      if (line.type === "unchanged") {
        diffOutput += `  ${line.content}\n`
      } else if (line.type === "added") {
        diffOutput += `+ ${line.content}\n`
      } else if (line.type === "removed") {
        diffOutput += `- ${line.content}\n`
      } else if (line.type === "modified") {
        const [oldContent, newContent] = line.content.split(" → ")
        diffOutput += `- ${oldContent}\n+ ${newContent}\n`
      }
    })

    // Create and download the file
    const blob = new Blob([diffOutput], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `code-diff-${language}-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getLanguageIcon = () => {
    switch (language) {
      case "javascript":
        return <FileCode className="h-4 w-4" />
      case "html":
        return <Code className="h-4 w-4" />
      case "css":
        return <FileJson className="h-4 w-4" />
      default:
        return <Code className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-40">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  {getLanguageIcon()}
                  <SelectValue placeholder="Select language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={diffView} onValueChange={setDiffView}>
            <TabsList>
              <TabsTrigger value="split">Split View</TabsTrigger>
              <TabsTrigger value="unified">Unified View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSwap} className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Swap
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Diff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="code-1">Original Code</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(code1, "code1")}
                  className="flex items-center gap-2 h-8"
                >
                  {copied === "code1" ? (
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
                id="code-1"
                value={code1}
                onChange={(e) => setCode1(e.target.value)}
                placeholder={`Enter original ${language} code...`}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="code-2">Modified Code</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(code2, "code2")}
                  className="flex items-center gap-2 h-8"
                >
                  {copied === "code2" ? (
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
                id="code-2"
                value={code2}
                onChange={(e) => setCode2(e.target.value)}
                placeholder={`Enter modified ${language} code...`}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Comparison Result</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(diffResult.map((line) => line.content).join("\n"), "diff")}
                className="flex items-center gap-2 h-8"
              >
                {copied === "diff" ? (
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

            {diffView === "split" ? (
              <div className="border rounded-md overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="bg-muted/30 p-2 border-b font-medium text-sm">Original</div>
                    <div className="p-0">
                      <pre className="font-mono text-sm p-0 m-0">
                        <code>
                          {diffResult.map((line, index) => (
                            <div
                              key={`left-${index}`}
                              className={cn(
                                "px-4 py-0.5 flex",
                                line.type === "added" && "opacity-50 bg-muted",
                                line.type === "removed" && "bg-red-100 dark:bg-red-900/20",
                                line.type === "modified" && "bg-yellow-100 dark:bg-yellow-900/20",
                              )}
                            >
                              <span className="w-8 inline-block text-muted-foreground select-none">
                                {line.lineNumber1 || ""}
                              </span>
                              <span className="flex-1">
                                {line.type === "modified" ? line.content.split(" → ")[0] : line.content}
                              </span>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </ResizablePanel>
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="bg-muted/30 p-2 border-b font-medium text-sm">Modified</div>
                    <div className="p-0">
                      <pre className="font-mono text-sm p-0 m-0">
                        <code>
                          {diffResult.map((line, index) => (
                            <div
                              key={`right-${index}`}
                              className={cn(
                                "px-4 py-0.5 flex",
                                line.type === "removed" && "opacity-50 bg-muted",
                                line.type === "added" && "bg-green-100 dark:bg-green-900/20",
                                line.type === "modified" && "bg-yellow-100 dark:bg-yellow-900/20",
                              )}
                            >
                              <span className="w-8 inline-block text-muted-foreground select-none">
                                {line.lineNumber2 || ""}
                              </span>
                              <span className="flex-1">
                                {line.type === "modified" ? line.content.split(" → ")[1] : line.content}
                              </span>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted/30 p-2 border-b font-medium text-sm">Unified Diff</div>
                <div className="p-0">
                  <pre className="font-mono text-sm p-0 m-0">
                    <code>
                      {diffResult.map((line, index) => (
                        <div
                          key={index}
                          className={cn(
                            "px-4 py-0.5 flex",
                            line.type === "unchanged" && "",
                            line.type === "added" && "bg-green-100 dark:bg-green-900/20",
                            line.type === "removed" && "bg-red-100 dark:bg-red-900/20",
                            line.type === "modified" && "bg-yellow-100 dark:bg-yellow-900/20",
                          )}
                        >
                          <span className="w-12 inline-block text-muted-foreground select-none">
                            {line.type === "added"
                              ? "+" + (line.lineNumber2 || "")
                              : line.type === "removed"
                                ? "-" + (line.lineNumber1 || "")
                                : " " + (line.lineNumber1 || "")}
                          </span>
                          <span className="flex-1">{line.content}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
