import Link from "next/link"
import type { Tool } from "@/lib/tools"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/${tool.id}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <tool.icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">{tool.name}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {tool.features && (
              <ul className="list-disc list-inside space-y-1">
                {tool.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
