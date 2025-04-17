"use client"

import { useState, useRef } from "react"
import { Upload, Download, Trash2, AlertCircle } from "lucide-react"
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ASPECT_RATIOS = {
  "free": undefined,
  "1:1": 1,
  "4:3": 4/3,
  "16:9": 16/9,
  "3:4": 3/4,
  "9:16": 9/16,
}

export default function ImageCropper() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const [aspectRatio, setAspectRatio] = useState<keyof typeof ASPECT_RATIOS>("free")
  const [error, setError] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  
  const imageRef = useRef<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setSelectedFile(file)
    setError(null)
    setCroppedImage(null)

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCrop = () => {
    if (!imageRef.current || !completedCrop) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setError("Could not create canvas context")
      return
    }

    const image = imageRef.current
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = completedCrop.width
    canvas.height = completedCrop.height

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    const croppedDataUrl = canvas.toDataURL(selectedFile?.type || 'image/png')
    setCroppedImage(croppedDataUrl)
  }

  const handleDownload = () => {
    if (!croppedImage) return

    const link = document.createElement('a')
    link.href = croppedImage
    link.download = `cropped-${selectedFile?.name || 'image.png'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setCrop(undefined)
    setCompletedCrop(null)
    setCroppedImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAspectRatioChange = (value: keyof typeof ASPECT_RATIOS) => {
    setAspectRatio(value)
    setCrop(undefined)
    setCompletedCrop(null)
    setCroppedImage(null)
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <Card className="col-span-4">
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
                  className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Click to upload an image</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Supports JPG, PNG, GIF, WEBP
                  </span>
                </Button>
              </div>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                    <SelectTrigger id="aspect-ratio">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="3:4">3:4</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCrop} 
                    className="flex-1"
                    disabled={!completedCrop?.width || !completedCrop?.height}
                  >
                    Crop Image
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

      <Card className="col-span-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Preview</Label>
            <div className="min-h-[350px] flex items-center justify-center border rounded-md bg-accent/30">
              {preview ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <div className="overflow-auto flex items-center justify-center p-4">
                    {croppedImage ? (
                      <img
                        src={croppedImage}
                        alt="Cropped preview"
                        className="max-w-full max-h-[480px] object-contain"
                      />
                    ) : (
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={ASPECT_RATIOS[aspectRatio]}
                      >
                        <img
                          ref={imageRef}
                          src={preview}
                          alt="Upload preview"
                          className="max-w-full max-h-[480px] object-contain"
                        />
                      </ReactCrop>
                    )}
                  </div>

                  {croppedImage && (
                    <div className="mt-4 w-full px-4 pb-4">
                      <Button 
                        onClick={handleDownload} 
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Cropped Image
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Upload an image to start cropping</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
