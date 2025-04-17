"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Download, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [outputFormat, setOutputFormat] = useState("png")
  const [quality, setQuality] = useState(90)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]

    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setSelectedFile(file)
    setConvertedImage(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleConvert = async () => {
    if (!selectedFile) return

    try {
      setError(null)

      // Create a canvas element to convert the image
      const img = new Image()
      img.src = preview as string

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          setError("Could not create canvas context")
          return
        }

        // Set canvas dimensions to match image
        canvas.width = img.width
        canvas.height = img.height

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0)

        // Convert canvas to desired format
        try {
          const convertedDataUrl = canvas.toDataURL(`image/${outputFormat}`, quality / 100)
          setConvertedImage(convertedDataUrl)
        } catch (err) {
          setError(`Failed to convert to ${outputFormat.toUpperCase()}: ${err}`)
        }
      }

      img.onerror = () => {
        setError("Failed to load image")
      }
    } catch (err) {
      setError(`Conversion failed: ${err}`)
    }
  }

  const handleDownload = () => {
    if (!convertedImage) return

    const link = document.createElement("a")
    link.href = convertedImage
    link.download = `converted-image.${outputFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setConvertedImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload Image</Label>
              <div className="mt-2">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 flex flex-col text-muted-foreground items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Click to upload an image</span>
                  <span className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, GIF, WEBP</span>
                </Button>
              </div>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="output-format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="output-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WEBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(outputFormat === "jpeg" || outputFormat === "webp") && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="quality">Quality: {quality}%</Label>
                    </div>
                    <Slider
                      id="quality"
                      min={10}
                      max={100}
                      step={1}
                      value={[quality]}
                      onValueChange={(value) => setQuality(value[0])}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleConvert} className="flex-1">
                    Convert Image
                  </Button>
                  <Button variant="outline" onClick={handleReset} size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="min-h-[300px] flex items-center justify-center border rounded-md bg-accent/30">
              {preview ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <div className="overflow-auto max-h-[300px] flex items-center justify-center p-4">
                    <img
                      src={convertedImage || preview}
                      alt="Preview"
                      className="max-w-full max-h-[280px] object-contain"
                    />
                  </div>

                  {convertedImage && (
                    <div className="mt-4 w-full px-4 pb-4">
                      <Button onClick={handleDownload} className="w-full flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download {outputFormat.toUpperCase()}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground text-center p-8">
                  <p>No image selected</p>
                  <p className="text-sm">Upload an image to see preview</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
