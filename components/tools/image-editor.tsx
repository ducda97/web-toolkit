"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, Download, Trash2, Type, Move, Bold, Italic, Underline } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import * as fabric from 'fabric'

interface Layer {
  id: string
  type: 'image' | 'text'
  object: fabric.Object
}

const FONTS = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Helvetica"
]

export default function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [textOptions, setTextOptions] = useState({
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: '',
    fill: '#000000'
  })

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: 'white'
      })

      fabricRef.current.on('selection:created', (e) => {
        setSelectedObject(fabricRef.current?.getActiveObject() || null)
      })

      fabricRef.current.on('selection:cleared', () => {
        setSelectedObject(null)
      })
    }

    return () => {
      fabricRef.current?.dispose()
    }
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const fabricImage = new fabric.Image(img)
          
          // Calculate scale to fit canvas while maintaining aspect ratio
          const scale = Math.min(
            (fabricRef.current?.width || 800) / img.width,
            (fabricRef.current?.height || 600) / img.height
          ) * 0.8

          fabricImage.scale(scale)
          
          // Center the image on canvas
          fabricImage.set({
            left: (fabricRef.current?.width || 800) / 2,
            top: (fabricRef.current?.height || 600) / 2,
            originX: 'center',
            originY: 'center'
          })

          // Add to canvas
          fabricRef.current?.add(fabricImage)
          fabricRef.current?.setActiveObject(fabricImage)
          fabricRef.current?.renderAll()

          // Add to layers
          const newLayer: Layer = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'image',
            object: fabricImage
          }
          setLayers(prev => [...prev, newLayer])
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const addText = () => {
    const text = new fabric.IText('Double click to edit', {
      left: 200,
      top: 200,
      ...textOptions
    })
    fabricRef.current?.add(text)
    const newLayer: Layer = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      object: text
    }
    setLayers(prev => [...prev, newLayer])
  }

  const updateTextOptions = (options: Partial<typeof textOptions>) => {
    setTextOptions(prev => ({ ...prev, ...options }))
    if (selectedObject && selectedObject.type === 'i-text') {
      Object.entries(options).forEach(([key, value]) => {
        selectedObject.set(key as keyof typeof options, value)
      })
      fabricRef.current?.renderAll()
    }
  }

  const toggleTextStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (!selectedObject || selectedObject.type !== 'i-text') return

    switch (style) {
      case 'bold':
        updateTextOptions({
          fontWeight: textOptions.fontWeight === 'bold' ? 'normal' : 'bold'
        })
        break
      case 'italic':
        updateTextOptions({
          fontStyle: textOptions.fontStyle === 'italic' ? 'normal' : 'italic'
        })
        break
      case 'underline':
        updateTextOptions({
          textDecoration: textOptions.textDecoration === 'underline' ? '' : 'underline'
        })
        break
    }
  }

  const handleDownload = () => {
    if (!fabricRef.current) return

    const dataUrl = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    })

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'edited-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label>Add Image</Label>
                <div
                  className="mt-2 border-2 border-dashed border-primary/20 rounded-lg p-4 text-center"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    or drag and drop
                  </p>
                </div>
              </div>

              {/* Text Tools */}
              <div>
                <Label>Text Tools</Label>
                <div className="mt-2 space-y-4">
                  <Button
                    onClick={addText}
                    variant="outline"
                    className="w-full"
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>

                  {selectedObject?.type === 'i-text' && (
                    <>
                      <Select
                        value={textOptions.fontFamily}
                        onValueChange={(value) => updateTextOptions({ fontFamily: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {FONTS.map(font => (
                            <SelectItem key={font} value={font}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={textOptions.fontSize}
                          onChange={(e) => updateTextOptions({ fontSize: Number(e.target.value) })}
                          min={8}
                          max={72}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleTextStyle('bold')}
                          className={textOptions.fontWeight === 'bold' ? 'bg-accent' : ''}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleTextStyle('italic')}
                          className={textOptions.fontStyle === 'italic' ? 'bg-accent' : ''}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleTextStyle('underline')}
                          className={textOptions.textDecoration === 'underline' ? 'bg-accent' : ''}
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                      </div>

                      <Input
                        type="color"
                        value={textOptions.fill}
                        onChange={(e) => updateTextOptions({ fill: e.target.value })}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Canvas</Label>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="border rounded-lg p-4 bg-accent/30">
                <canvas ref={canvasRef} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



