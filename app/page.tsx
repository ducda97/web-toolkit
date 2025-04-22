"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import ToolCard from "@/components/tool-card"
import { toolCategories, allTools } from "@/lib/tools"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tools based on search query
  const filteredTools =
    searchQuery.trim() === ""
      ? null // No filtering when search is empty
      : allTools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tool.features &&
              tool.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase()))),
        )

  return (
    <div className="container mx-auto px-2 px-md-6">
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Web Toolkit</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of useful tools for developers, designers, and content creators. All processing happens in your
            browser - no data is sent to any server.
          </p>
        </div>

        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search for tools..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {filteredTools ? (
        // Show search results
        <section>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground">No tools found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        // Show all categories when not searching
        <div className="space-y-12">
          {toolCategories.map((category) => (
            <section key={category.id}>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
