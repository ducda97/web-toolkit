"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Download, Trash2, AlertCircle, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
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
    setResizedImage(null)

    // Create preview and get dimensions
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height })
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = reader.result as string
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number.parseInt(e.target.value) || 0
    setWidth(newWidth)

    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number.parseInt(e.target.value) || 0
    setHeight(newHeight)

    if (maintainAspectRatio && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const handlePresetChange = (value: string) => {
    if (!originalDimensions.width) return

    const aspectRatio = originalDimensions.width / originalDimensions.height

    switch (value) {
      case "original":
        setWidth(originalDimensions.width)
        setHeight(originalDimensions.height)
        break
      case "half":
        setWidth(Math.round(originalDimensions.width / 2))
        setHeight(Math.round(originalDimensions.height / 2))
        break
      case "quarter":
        setWidth(Math.round(originalDimensions.width / 4))
        setHeight(Math.round(originalDimensions.height / 4))
        break
      case "hd":
        if (aspectRatio >= 16 / 9) {
          setWidth(1280)
          setHeight(Math.round(1280 / aspectRatio))
        } else {
          setHeight(720)
          setWidth(Math.round(720 * aspectRatio))
        }
        break
      case "fullhd":
        if (aspectRatio >= 16 / 9) {
          setWidth(1920)
          setHeight(Math.round(1920 / aspectRatio))
        } else {
          setHeight(1080)
          setWidth(Math.round(1080 * aspectRatio))
        }
        break
    }
  }

  const handleResize = () => {
    if (!selectedFile || !preview) return

    try {
      setError(null)

      // Create a canvas element to resize the image
      const img = new Image()
      img.src = preview

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          setError("Could not create canvas context")
          return
        }

        // Set canvas dimensions to the new size
        canvas.width = width
        canvas.height = height

        // Draw image onto canvas with new dimensions
        ctx.drawImage(img, 0, 0, width, height)

        // Convert canvas to data URL
        try {
          const resizedDataUrl = canvas.toDataURL(selectedFile.type)
          setResizedImage(resizedDataUrl)
        } catch (err) {
          setError(`Failed to resize: ${err}`)
        }
      }

      img.onerror = () => {
        setError("Failed to load image")
      }
    } catch (err) {
      setError(`Resize failed: ${err}`)
    }
  }

  const handleDownload = () => {
    if (!resizedImage) return

    const link = document.createElement("a")
    link.href = resizedImage
    link.download = `resized-image.${selectedFile?.name.split(".").pop()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setOriginalDimensions({ width: 0, height: 0 })
    setWidth(0)
    setHeight(0)
    setResizedImage(null)
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
                  className="w-full h-32 flex flex-col items-center text-muted-foreground justify-center border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
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
                  <div className="flex justify-between items-center mb-2">
                    <Label>Original Size</Label>
                    <span className="text-sm text-muted-foreground">
                      {originalDimensions.width} × {originalDimensions.height}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="maintain-ratio" className="flex items-center gap-2">
                      <span>Maintain aspect ratio</span>
                      {maintainAspectRatio ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </Label>
                    <Switch
                      id="maintain-ratio"
                      checked={maintainAspectRatio}
                      onCheckedChange={setMaintainAspectRatio}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (px)</Label>
                      <Input id="width" type="number" min="1" value={width || ""} onChange={handleWidthChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <Input id="height" type="number" min="1" value={height || ""} onChange={handleHeightChange} />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="preset">Presets</Label>
                    <Select onValueChange={handlePresetChange}>
                      <SelectTrigger id="preset">
                        <SelectValue placeholder="Select preset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original Size</SelectItem>
                        <SelectItem value="half">Half Size</SelectItem>
                        <SelectItem value="quarter">Quarter Size</SelectItem>
                        <SelectItem value="hd">HD (720p)</SelectItem>
                        <SelectItem value="fullhd">Full HD (1080p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleResize} className="flex-1">
                    Resize Image
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
                      src={resizedImage || preview}
                      alt="Preview"
                      className="max-w-full max-h-[280px] object-contain"
                    />
                  </div>

                  {resizedImage && (
                    <div className="mt-4 w-full px-4 pb-4">
                      <Button onClick={handleDownload} className="w-full flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Resized Image
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
