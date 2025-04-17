"use client"

import type { ReactNode } from "react"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"

interface MainContentProps {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-[70px]" : "lg:pl-[250px]",
      )}
    >
      {children}
    </div>
  )
}
