"use client"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center">
        <div className="lg:hidden w-8"></div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="flex items-center justify-end space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
