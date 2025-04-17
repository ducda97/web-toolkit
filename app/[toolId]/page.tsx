import type React from "react"
import { notFound } from "next/navigation"
import { getToolById } from "@/lib/tools"
import ImageConverter from "@/components/tools/image-converter"
import ImageResizer from "@/components/tools/image-resizer"
import ColorConverter from "@/components/tools/color-converter"
import CodeFormatter from "@/components/tools/code-formatter"
import CodeMinifier from "@/components/tools/code-minifier"
import LivePreview from "@/components/tools/live-preview"
import CodeCompare from "@/components/tools/code-compare"
import CaseConverter from "@/components/tools/case-converter"
import WordCounter from "@/components/tools/word-counter"
import TextDiff from "@/components/tools/text-diff"
import UrlEncoder from "@/components/tools/url-encoder"
import JsonFormatter from "@/components/tools/json-formatter"
import QrGenerator from "@/components/tools/qr-generator"

export const dynamic = 'force-dynamic'

export default async function ToolPage({ params }: { params: { toolId: string } }) {
  const { toolId } = await params
  const tool = getToolById(toolId)
  if (!tool) {
    notFound()
  }

  const toolComponents: Record<string, React.ReactNode> = {
    "image-converter": <ImageConverter />,
    "image-resize": <ImageResizer />,
    "color-converter": <ColorConverter />,
    "code-formatter": <CodeFormatter />,
    "code-minifier": <CodeMinifier />,
    "live-preview": <LivePreview />,
    "code-compare": <CodeCompare />,
    "case-converter": <CaseConverter />,
    "word-counter": <WordCounter />,
    "text-diff": <TextDiff />,
    "url-encoder": <UrlEncoder />,
    "json-formatter": <JsonFormatter />,
    "qr-generator": <QrGenerator />,
  }

  const ToolComponent = toolComponents[tool.id]
  if (!ToolComponent) {
    notFound()
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <tool.icon className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">{tool.name}</h1>
        </div>
        <p className="text-muted-foreground">{tool.description}</p>
      </div>

      {ToolComponent}
    </div>
  )
}

