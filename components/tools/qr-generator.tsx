"use client"

import { useState, useRef, useEffect } from "react"
import { Download, QrCode, Settings, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import QRCode from "qrcode"

export default function QrGenerator() {
  const [text, setText] = useState<string>("")
  const [size, setSize] = useState<number>(200)
  const [foregroundColor, setForegroundColor] = useState<string>("#000000")
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF")
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<string>("M")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [colorError, setColorError] = useState<string>("")

  useEffect(() => {
    if (text) {
      generateQRCode()
    }
  }, [text, size, foregroundColor, backgroundColor, errorCorrectionLevel])

  const validateHexColor = (color: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6})$/
    return hexRegex.test(color)
  }

  const handleColorChange = (color: string, setColor: (value: string) => void) => {
    if (validateHexColor(color)) {
      setColor(color)
      setColorError("")
    } else {
      setColorError("Please enter a valid hex color (e.g., #000000)")
    }
  }

  const generateQRCode = async () => {
    if (!text) return

    try {
      const options = {
        errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
        type: 'image/png',
        width: size,
        margin: 1,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        }
      }

      const url = await QRCode.toDataURL(text, options)
      setQrCodeUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const handleDownload = () => {
    if (!qrCodeUrl || !text) return

    const link = document.createElement("a")
    link.download = `qrcode-${text.substring(0, 20)}.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRandomColors = () => {
    const randomColor = () => {
      return (
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
      )
    }
    setForegroundColor(randomColor())
    setBackgroundColor(randomColor())
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text or URL</Label>
              <Input
                id="text"
                placeholder="Enter text or URL"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <Accordion type="single" collapsible defaultValue="settings">
              <AccordionItem value="settings">
                <AccordionTrigger className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  QR Code Settings
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Slider
                        id="size"
                        min={100}
                        max={500}
                        step={10}
                        value={[size]}
                        onValueChange={(value) => setSize(value[0])}
                      />
                      <div className="text-right text-sm text-muted-foreground">
                        {size}px
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="foreground-color">Foreground Color</Label>
                        <div className="flex gap-2">
                          <div 
                            className="h-9 w-9 rounded-md border" 
                            style={{ backgroundColor: foregroundColor }} 
                          />
                          <Input
                            id="foreground-color"
                            placeholder="#000000"
                            value={foregroundColor}
                            onChange={(e) => handleColorChange(e.target.value, setForegroundColor)}
                            className="font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="background-color">Background Color</Label>
                        <div className="flex gap-2">
                          <div 
                            className="h-9 w-9 rounded-md border" 
                            style={{ backgroundColor: backgroundColor }} 
                          />
                          <Input
                            id="background-color"
                            placeholder="#FFFFFF"
                            value={backgroundColor}
                            onChange={(e) => handleColorChange(e.target.value, setBackgroundColor)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {colorError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{colorError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="error-correction">Error Correction Level</Label>
                      <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                        <SelectTrigger id="error-correction">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={handleRandomColors}
                      className="w-full flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Random Colors
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <Label>QR Code Preview</Label>
            <div className="flex items-center justify-center p-4 min-h-[300px] border rounded-md bg-accent/30">
              {qrCodeUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <div 
                    className="p-4 rounded-md" 
                    style={{ backgroundColor }}
                  >
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code"
                      className="max-w-full h-auto"
                    />
                  </div>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Enter text or URL to generate a QR code</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

