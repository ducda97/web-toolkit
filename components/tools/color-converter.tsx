"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import debounce from 'lodash/debounce'

interface ColorValues {
  hex: string
  rgb: string
  hsl: string
  hsv: string
  hwb: string
  cmyk: string
}

const hexToRgb = (hex: string): string => {
  // Remove the # if present
  hex = hex.replace('#', '')

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgb(${r}, ${g}, ${b})`
}

const rgbToHsl = (rgb: string): string => {
  // Extract RGB values
  const matches = rgb.match(/\d+/g)
  if (!matches) throw new Error('Invalid RGB format')
  
  let [r, g, b] = matches.map(Number)
  
  // Convert RGB to [0,1] range
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const lPercent = Math.round(l * 100)

  return `hsl(${h}, ${s}%, ${lPercent}%)`
}

const rgbToHsv = (rgb: string): string => {
  // Extract RGB values
  const matches = rgb.match(/\d+/g)
  if (!matches) throw new Error('Invalid RGB format')
  
  let [r, g, b] = matches.map(Number)
  
  // Convert RGB to [0,1] range
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const v = max

  if (max !== min) {
    const d = max - min
    s = max === 0 ? 0 : d / max
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const vPercent = Math.round(v * 100)

  return `hsv(${h}, ${s}%, ${vPercent}%)`
}

const rgbToHwb = (rgb: string): string => {
  // Extract RGB values
  const matches = rgb.match(/\d+/g)
  if (!matches) throw new Error('Invalid RGB format')
  
  let [r, g, b] = matches.map(Number)
  
  // Convert RGB to [0,1] range
  r /= 255
  g /= 255
  b /= 255

  const w = Math.min(r, g, b)
  const v = Math.max(r, g, b)
  const b1 = 1 - v

  // Convert HSV to HWB
  let h = 0
  if (v !== w) {
    const f = 1 - w / v
    const d = v - w
    
    switch (v) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360)
  const wPercent = Math.round(w * 100)
  const bPercent = Math.round(b1 * 100)

  return `hwb(${h}, ${wPercent}%, ${bPercent}%)`
}

const rgbToCmyk = (rgb: string): string => {
  // Extract RGB values
  const matches = rgb.match(/\d+/g)
  if (!matches) throw new Error('Invalid RGB format')
  
  let [r, g, b] = matches.map(Number)
  
  // Convert RGB to [0,1] range
  r /= 255
  g /= 255
  b /= 255

  const k = 1 - Math.max(r, g, b)
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

  // Convert to percentages
  const cPercent = Math.round(c * 100)
  const mPercent = Math.round(m * 100)
  const yPercent = Math.round(y * 100)
  const kPercent = Math.round(k * 100)

  return `cmyk(${cPercent}%, ${mPercent}%, ${yPercent}%, ${kPercent}%)`
}

export default function ColorConverter() {
  const [hexInput, setHexInput] = useState<string>("#3b82f6")
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: "#3b82f6",
    rgb: "rgb(59, 130, 246)",
    hsl: "hsl(217, 91%, 60%)",
    hsv: "hsv(217, 76%, 96%)",
    hwb: "hwb(217, 23%, 4%)",
    cmyk: "cmyk(76%, 47%, 0%, 4%)",
  })
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Tách logic chuyển đổi màu thành một hàm riêng
  const convertColor = useCallback((color: string) => {
    try {
      const rgb = hexToRgb(color)
      const hsl = rgbToHsl(rgb)
      const hsv = rgbToHsv(rgb)
      const hwb = rgbToHwb(rgb)
      const cmyk = rgbToCmyk(rgb)

      setColorValues({
        hex: color,
        rgb,
        hsl,
        hsv,
        hwb,
        cmyk,
      })
      setError(null)
    } catch (err) {
      setError("Invalid color format")
    }
  }, [])

  // Sử dụng debounce cho việc chuyển đổi màu
  const debouncedConversion = useCallback(
    debounce((color: string) => {
      convertColor(color)
    }, 100),
    [convertColor]
  )

  // Xử lý input text
  const handleHexInputChange = (value: string) => {
    // Luôn cập nhật giá trị input ngay lập tức để UI mượt
    setHexInput(value)
    
    // Chuẩn hóa giá trị
    let normalizedValue = value
    if (!normalizedValue.startsWith('#')) {
      normalizedValue = '#' + normalizedValue
    }
    
    // Kiểm tra độ dài tối đa
    if (normalizedValue.length > 7) return

    // Validate và chuyển đổi nếu là hex hợp lệ
    if (/^#[0-9a-f]{3,6}$/i.test(normalizedValue)) {
      debouncedConversion(normalizedValue.toLowerCase())
    } else if (normalizedValue.length === 7) {
      setError("Please enter a valid HEX color")
    }
  }

  // Xử lý color picker
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setHexInput(newColor)
    setError(null)
    
    const rgb = hexToRgb(newColor)
    const hsl = rgbToHsl(rgb)
    const hsv = rgbToHsv(rgb)
    const hwb = rgbToHwb(rgb)
    const cmyk = rgbToCmyk(rgb)

    setColorValues({
      hex: newColor,
      rgb,
      hsl,
      hsv,
      hwb,
      cmyk,
    })
  }

  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleRandomColor = useCallback(() => {
    const randomHex = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
    setHexInput(randomHex)
    convertColor(randomHex) // Gọi convertColor trực tiếp vì đây là action đơn lẻ
  }, [convertColor])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hex-input">HEX Color</Label>
              <div className="flex gap-2">
                <Input
                  id="hex-input"
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                />
                <div className="relative">
                  <input
                    type="color"
                    value={hexInput}
                    onChange={handleColorPickerChange}
                    className="h-10 w-14 cursor-pointer rounded-md border border-input bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[4px] [&::-moz-color-swatch]:rounded-[4px]"
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleRandomColor} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Random Color
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label>Color Preview</Label>
              <div
                className="mt-2 h-32 rounded-md border"
                style={{ backgroundColor: error ? "#CCCCCC" : colorValues.hex }}
              />
            </div>

            <div className="space-y-4">
              <Label>Color Values</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <span className="text-sm font-medium">HEX</span>
                    <div className="text-lg font-mono">{colorValues.hex}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(colorValues.hex, "hex")}>
                    {copied === "hex" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <span className="text-sm font-medium">RGB</span>
                    <div className="text-lg font-mono">{colorValues.rgb}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(colorValues.rgb, "rgb")}>
                    {copied === "rgb" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <span className="text-sm font-medium">HSL</span>
                    <div className="text-lg font-mono">{colorValues.hsl}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(colorValues.hsl, "hsl")}>
                    {copied === "hsl" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <span className="text-sm font-medium">HSV</span>
                    <div className="text-lg font-mono">{colorValues.hsv}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(colorValues.hsv, "hsv")}>
                    {copied === "hsv" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <span className="text-sm font-medium">HWB</span>
                    <div className="text-lg font-mono">{colorValues.hwb}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(colorValues.hwb, "hwb")}>
                    {copied === "hwb" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <span className="text-sm font-medium">CMYK</span>
                    <div className="text-lg font-mono">{colorValues.cmyk}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(colorValues.cmyk, "cmyk")}>
                    {copied === "cmyk" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






