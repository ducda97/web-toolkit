"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, Home, Info, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toolCategories } from "@/lib/tools"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar-provider"

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleCollapsed, isMobileOpen, toggleMobileOpen } = useSidebar()

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobileOpen) {
      toggleMobileOpen()
    }
  }, [pathname, isMobileOpen, toggleMobileOpen])

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileOpen}
          className="rounded-full shadow-md bg-background"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={toggleMobileOpen} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-full border-r bg-card transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[250px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center px-3 border-b">
            <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}>
              {!isCollapsed && <span>Web Toolkit</span>}
              {isCollapsed && <span className="text-xl">WT</span>}
            </Link>
            <div className="ml-auto">
              <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="hidden lg:flex">
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/" && "bg-accent text-accent-foreground",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <Home className="h-4 w-4" />
                {!isCollapsed && <span>Home</span>}
              </Link>

              {toolCategories.map((category) => (
                <div key={category.id} className="space-y-1 pt-2">
                  {!isCollapsed && (
                    <>
                      <div className="px-3 text-xs font-medium text-muted-foreground">{category.name}</div>
                      <Separator className="mb-1" />
                    </>
                  )}

                  {category.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.id}`}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === `/${tool.id}` && "bg-accent text-accent-foreground",
                        isCollapsed && "justify-center px-0",
                      )}
                      title={isCollapsed ? tool.name : undefined}
                    >
                      <tool.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{tool.name}</span>}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="pt-2">
                {!isCollapsed && (
                  <>
                    <div className="px-3 text-xs font-medium text-muted-foreground">About</div>
                    <Separator className="mb-1" />
                  </>
                )}

                <Link
                  href="/about"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === "/about" && "bg-accent text-accent-foreground",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  <Info className="h-4 w-4" />
                  {!isCollapsed && <span>About</span>}
                </Link>
              </div>
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
