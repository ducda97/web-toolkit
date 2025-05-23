export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About DucDA Toolkit</h1>

        <div className="prose prose-blue dark:prose-invert max-w-none">
          <p className="lead">
            DucDA Toolkit is a collection of free, browser-based tools designed to help developers, designers, and content
            creators with everyday tasks.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a set of simple, effective, and accessible web tools that work entirely in your
            browser. No downloads, no accounts, and no data sent to servers - just useful utilities at your fingertips.
          </p>

          <h2>Privacy First</h2>
          <p>
            We believe in privacy-first tools. All processing happens directly in your browser, and we don't track your
            usage or store any of your data. Your files and content never leave your device.
          </p>

          <h2>Open Source</h2>
          <p>
            DucDA Toolkit is open source and built with modern web technologies. We welcome contributions from the
            community to improve existing tools or add new ones.
          </p>

          <h2>Features</h2>
          <ul>
            <li>
              <strong>Image Tools:</strong> Convert, resize, and manipulate images directly in your browser.
            </li>
            <li>
              <strong>Code Tools:</strong> Format, minify, and preview HTML, CSS, and JavaScript code.
            </li>
            <li>
              <strong>Text Tools:</strong> Manipulate text with case conversion, word counting, and text comparison.
            </li>
            <li>
              <strong>Web Tools:</strong> Work with URLs, JSON, and generate QR codes.
            </li>
          </ul>

          <h2>Technology</h2>
          <p>DucDA Toolkit is built with:</p>
          <ul>
            <li>Next.js - React framework</li>
            <li>Tailwind CSS - Utility-first CSS framework</li>
            <li>shadcn/ui - Reusable UI components</li>
            <li>Client-side processing - All tools run in your browser</li>
          </ul>

          <h2>Contact</h2>
          <p>
            Have suggestions, feedback, or found a bug? We'd love to hear from you! Please reach out through our GitHub
            repository or contact form.
          </p>
        </div>
      </div>
    </div>
  )
}
