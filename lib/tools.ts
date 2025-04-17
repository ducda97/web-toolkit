import {
  ImageIcon,
  FileImage,
  Palette,
  Code,
  Minimize2,
  Eye,
  Type,
  Hash,
  FileText,
  LinkIcon,
  FileJson,
  QrCode,
  GitCompare,
  Crop,
  Sliders,
} from "lucide-react"

export interface Tool {
  id: string
  name: string
  description: string
  icon: any
  features?: string[]
  category: string
}

export interface ToolCategory {
  id: string
  name: string
  tools: Tool[]
}

const imageTools: Tool[] = [
  {
    id: "image-cropper",
    name: "Image Cropper",
    description: "Crop and adjust images easily",
    icon: Crop,
    features: ["Free-form crop", "Aspect ratio presets", "Preview & download"],
    category: "image",
  },
  {
    id: "image-converter",
    name: "Image Format Converter",
    description: "Convert images between different formats",
    icon: ImageIcon,
    features: ["PNG, JPEG, WEBP, GIF", "Maintain quality", "Batch conversion"],
    category: "image",
  },
  {
    id: "image-resize",
    name: "Image Resizer",
    description: "Resize images to specific dimensions",
    icon: FileImage,
    features: ["Custom dimensions", "Maintain aspect ratio", "Presets available"],
    category: "image",
  },
  {
    id: "color-converter",
    name: "Color Converter",
    description: "Convert colors between different formats",
    icon: Palette,
    features: ["HEX, RGB, HSL", "Color picker", "Color preview"],
    category: "image",
  },
  {
    id: "image-filter",
    name: "Image Filter",
    description: "Apply filters and adjust image properties",
    icon: Sliders,
    features: ["Brightness", "Contrast", "Saturation", "Blur", "Preset filters"],
    category: "image",
  },
]

const codeTools: Tool[] = [
  {
    id: "code-formatter",
    name: "Code Formatter",
    description: "Format HTML, CSS, and JavaScript code",
    icon: Code,
    features: ["Proper indentation", "Syntax highlighting", "Multiple languages"],
    category: "code",
  },
  {
    id: "code-minifier",
    name: "Code Minifier",
    description: "Minify code for optimization",
    icon: Minimize2,
    features: ["HTML, CSS, JS", "Remove whitespace", "Reduce file size"],
    category: "code",
  },
  {
    id: "live-preview",
    name: "Live Preview",
    description: "Test HTML, CSS, and JS snippets in real-time",
    icon: Eye,
    features: ["Real-time preview", "Split view", "Save snippets"],
    category: "code",
  },
  {
    id: "code-compare",
    name: "Code Compare",
    description: "Compare two code snippets and highlight differences",
    icon: GitCompare,
    features: ["Side-by-side comparison", "Line-by-line diff", "Syntax highlighting"],
    category: "code",
  },
]

const textTools: Tool[] = [
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text to different cases",
    icon: Type,
    features: ["Uppercase", "Lowercase", "Title case", "Sentence case"],
    category: "text",
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, and reading time",
    icon: Hash,
    features: ["Word count", "Character count", "Reading time"],
    category: "text",
  },
  {
    id: "text-diff",
    name: "Text Diff",
    description: "Compare two text inputs and highlight differences",
    icon: FileText,
    features: ["Side-by-side comparison", "Highlight changes", "Line numbers"],
    category: "text",
  },
]

const webTools: Tool[] = [
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode or decode URLs",
    icon: LinkIcon,
    features: ["URL encoding", "URL decoding", "Batch processing"],
    category: "web",
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON",
    icon: FileJson,
    features: ["Format JSON", "Minify JSON", "Validate JSON"],
    category: "web",
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes from text or URLs",
    icon: QrCode,
    features: ["Customizable", "Download as image", "Multiple formats"],
    category: "web",
  },
]

export const toolCategories: ToolCategory[] = [
  {
    id: "image",
    name: "Image Tools",
    tools: imageTools,
  },
  {
    id: "code",
    name: "Code Tools",
    tools: codeTools,
  },
  {
    id: "text",
    name: "Text Tools",
    tools: textTools,
  },
  {
    id: "web",
    name: "Web Tools",
    tools: webTools,
  },
]

export const allTools = toolCategories.flatMap((category) => category.tools)

export function getToolById(id: string): Tool | undefined {
  return allTools.find((tool) => tool.id === id)
}


