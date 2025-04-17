import Link from "next/link"
import { Github, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-4 md:py-4 bg-card">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} WebToolkit. All rights reserved.</p>
          <p>All processing happens in your browser - no data is sent to any server.</p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>

          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Contact</span>
          </Link>

          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>

          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
