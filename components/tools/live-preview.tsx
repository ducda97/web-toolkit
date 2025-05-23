"use client"

import { useState, useEffect } from "react"
import { Play, Copy, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function LivePreview() {
  const [html, setHtml] = useState<string>(`<!DOCTYPE html>
<html>
<head>
  <title>Live Preview</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a live preview of your HTML, CSS, and JavaScript code.</p>
  <button id="demo-button">Click Me!</button>
</body>
</html>`)

  const [css, setCss] = useState<string>(`body {
  font-family: system-ui, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

h1 {
  color: #3b82f6;
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2563eb;
}`)

  const [js, setJs] = useState<string>(`document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('demo-button');
  
  if (button) {
    button.addEventListener('click', function() {
      alert('Button clicked!');
    });
  }
});`)

  const [preview, setPreview] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("html")
  const [copied, setCopied] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [key, setKey] = useState<number>(0) // Add this line

  useEffect(() => {
    const initializePreview = () => {
      const bodyContent = html
        .replace(/<(!DOCTYPE|html|head|body)[^>]*>/gi, '')
        .replace(/<\/(html|head|body)>/gi, '')
        .trim();

      const combinedCode = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>${css}</style>
          </head>
          <body>
            ${bodyContent}
            <script>${js}</script>
          </body>
        </html>
      `.trim();

      setPreview(combinedCode);
      setKey(prev => prev + 1); // Force iframe to remount
    };

    initializePreview();
  }, [html, css, js, autoRefresh]);

  const handleCopy = (type: string) => {
    let content = ""

    switch (type) {
      case "html":
        content = html
        break
      case "css":
        content = css
        break
      case "js":
        content = js
        break
      case "all":
        content = `<!-- HTML -->
${html}

/* CSS */
${css}

// JavaScript
${js}`
        break
    }

    navigator.clipboard.writeText(content)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([preview], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "preview.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>

          {!autoRefresh && (
            <Button size="sm" onClick={() => {
              const bodyContent = html
                .replace(/<(!DOCTYPE|html|head|body)[^>]*>/gi, '')
                .replace(/<\/(html|head|body)>/gi, '')
                .trim();

              const combinedCode = `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>${css}</style>
                  </head>
                  <body>
                    ${bodyContent}
                    <script>${js}</script>
                  </body>
                </html>
              `.trim();

              setPreview(combinedCode);
              setKey(prev => prev + 1);
            }}>
              Update Preview
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleCopy("all")} className="flex items-center gap-2">
            {copied === "all" ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy All
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download HTML
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border bg-background">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="html" className="flex-1">
                    HTML
                  </TabsTrigger>
                  <TabsTrigger value="css" className="flex-1">
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="js" className="flex-1">
                    JavaScript
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="html" className="flex-1 p-4 pt-0">
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="html-editor">HTML</Label>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy("html")} className="h-8">
                    {copied === "html" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  id="html-editor"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="flex-1 h-full min-h-[500px] font-mono text-sm resize-none"
                />
              </TabsContent>

              <TabsContent value="css" className="flex-1 p-4 pt-0">
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="css-editor">CSS</Label>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy("css")} className="h-8">
                    {copied === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  id="css-editor"
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className="flex-1 h-full min-h-[500px] font-mono text-sm resize-none"
                />
              </TabsContent>

              <TabsContent value="js" className="flex-1 p-4 pt-0">
                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="js-editor">JavaScript</Label>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy("js")} className="h-8">
                    {copied === "js" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  id="js-editor"
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  className="flex-1 h-full min-h-[500px] font-mono text-sm resize-none"
                />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="border-b px-4 py-3 bg-background">
              <Label>Preview</Label>
            </div>
            <div className="flex-1 bg-white rounded-md mt-[50px] mr-4">
              <iframe 
                key={key} // Add this line
                title="Preview" 
                srcDoc={preview} 
                className="w-full h-full border-0 min-h-[500px]" 
                sandbox="allow-scripts"
               
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}




