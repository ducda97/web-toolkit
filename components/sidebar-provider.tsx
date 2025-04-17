"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SidebarContextType = {
  isCollapsed: boolean
  toggleCollapsed: () => void
  isMobileOpen: boolean
  toggleMobileOpen: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleCollapsed = () => setIsCollapsed((prev) => !prev)
  const toggleMobileOpen = () => setIsMobileOpen((prev) => !prev)

  // Close mobile sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapsed, isMobileOpen, toggleMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
