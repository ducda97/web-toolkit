import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"
import { MainContent } from "@/components/main-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Web Toolkit - All-in-one Web Tools",
  description: "A collection of useful web tools for developers and designers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <MainContent>
                <Header />
                <main className="flex-1 px-4 py-8">{children}</main>
                <Footer />
              </MainContent>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'