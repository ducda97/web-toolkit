"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, Download, Trash2, Type, Move, Bold, Italic, Underline, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import * as fabric from 'fabric'
import { cn } from "@/lib/utils"

interface Layer {
  id: string
  type: 'image' | 'text'
  object: fabric.Object
  name: string
  zIndex: number
}

const FONTS = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Helvetica"
]

const CANVAS_PRESETS = {
  "custom": { name: "Custom Size", width: 800, height: 600 },
  "facebook_cover": { name: "Facebook Cover", width: 1640, height: 924 },
  "facebook_post": { name: "Facebook Post", width: 1200, height: 630 },
  "instagram_post": { name: "Instagram Post", width: 1080, height: 1080 },
  "instagram_story": { name: "Instagram Story", width: 1080, height: 1920 },
  "twitter_header": { name: "Twitter Header", width: 1500, height: 500 },
  "youtube_thumbnail": { name: "YouTube Thumbnail", width: 1280, height: 720 },
  "desktop_wallpaper": { name: "Desktop Wallpaper", width: 1920, height: 1080 },
  "mobile_wallpaper": { name: "Mobile Wallpaper", width: 1080, height: 1920 },
} as const

type CanvasPreset = keyof typeof CANVAS_PRESETS

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
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [selectedPreset, setSelectedPreset] = useState<CanvasPreset>("custom")
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Thêm hàm tính toán scale
  const calculateScale = (containerWidth: number, containerHeight: number) => {
    const padding = 7 // padding để canvas không sát viền
    const maxWidth = containerWidth - padding
    const maxHeight = containerHeight - padding
    
    const scaleX = maxWidth / canvasSize.width
    const scaleY = maxHeight / canvasSize.height
    
    // Chọn scale nhỏ hơn để đảm bảo canvas vừa khung
    return Math.min(scaleX, scaleY)
  }

  // Thêm useEffect để theo dõi kích thước container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const newScale = calculateScale(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        )
        setScale(newScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [canvasSize.width, canvasSize.height])

  useEffect(() => {
    if (canvasRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
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
            name: file.name,
            object: fabricImage,
            zIndex: layers.length
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
      name: 'Text Layer',
      object: text,
      zIndex: layers.length
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

  const reorderLayers = (startIndex: number, endIndex: number) => {
    const newLayers = [...layers]
    const [removed] = newLayers.splice(startIndex, 1)
    newLayers.splice(endIndex, 0, removed)
    
    if (fabricRef.current) {
      // Cập nhật thứ tự các layer trên canvas
      newLayers.forEach((layer, idx) => {
        layer.zIndex = idx
      })

      // Đưa tất cả objects xuống dưới cùng trước
      newLayers.forEach(layer => {
        if (layer.object) {
          fabricRef.current?.sendObjectToBack(layer.object)
        }
      })

      // Sau đó đưa lên theo thứ tự từ dưới lên
      newLayers.forEach(layer => {
        if (layer.object) {
          fabricRef.current?.bringObjectForward(layer.object)
        }
      })
      
      fabricRef.current?.renderAll()
    }
    
    setLayers(newLayers)
  }

  const handleCanvasResize = (width: number, height: number) => {
    if (fabricRef.current) {
      fabricRef.current.setWidth(width)
      fabricRef.current.setHeight(height)
      fabricRef.current.renderAll()
      setCanvasSize({ width, height })
    }
  }

  const handlePresetChange = (preset: CanvasPreset) => {
    setSelectedPreset(preset)
    const { width, height } = CANVAS_PRESETS[preset]
    handleCanvasResize(width, height)
  }

  const handleCustomSize = (dimension: 'width' | 'height', value: number) => {
    setSelectedPreset('custom')
    const newSize = { ...canvasSize, [dimension]: value }
    handleCanvasResize(newSize.width, newSize.height)
  }

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      <div className="col-span-3 overflow-y-auto h-[calc(100vh-2rem)]">
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

              {/* Add Layers Panel */}
              <div>
                <Label>Layers</Label>
                <div className="mt-2 border rounded-lg">
                  {layers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No layers yet
                    </div>
                  ) : (
                    <div className="divide-y">
                      {[...layers].reverse().map((layer, index) => (
                        <div
                          key={layer.id}
                          className={cn(
                            "p-3 flex items-center gap-3 cursor-move",
                            selectedObject === layer.object && "bg-accent"
                          )}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString())
                          }}
                          onDragOver={(e) => {
                            e.preventDefault()
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            const startIndex = parseInt(e.dataTransfer.getData('text/plain'))
                            reorderLayers(startIndex, index)
                          }}
                          onClick={() => {
                            fabricRef.current?.setActiveObject(layer.object)
                            fabricRef.current?.renderAll()
                          }}
                        >
                          {layer.type === 'image' ? (
                            <FileImage className="h-4 w-4" />
                          ) : (
                            <Type className="h-4 w-4" />
                          )}
                          <span className="flex-1 truncate">{layer.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              fabricRef.current?.remove(layer.object)
                              setLayers(prev => prev.filter(l => l.id !== layer.id))
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Canvas Size Controls */}
              <div>
                <Label>Canvas Size</Label>
                <div className="mt-2 space-y-4">
                  <Select value={selectedPreset} onValueChange={(value) => handlePresetChange(value as CanvasPreset)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preset size" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CANVAS_PRESETS).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          {preset.name} ({preset.width}x{preset.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="canvas-width">Width</Label>
                      <Input
                        id="canvas-width"
                        type="number"
                        min={100}
                        max={4000}
                        value={canvasSize.width}
                        onChange={(e) => handleCustomSize('width', Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="canvas-height">Height</Label>
                      <Input
                        id="canvas-height"
                        type="number"
                        min={100}
                        max={4000}
                        value={canvasSize.height}
                        onChange={(e) => handleCustomSize('height', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Download button at the bottom */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleDownload} 
                  className="w-full flex items-center justify-center gap-2"
                  variant="default"
                >
                  <Download className="h-4 w-4" />
                  Download Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-9">
        <div 
          ref={containerRef}
          className="w-full h-[calc(100vh-2rem)] bg-accent/10 rounded-lg flex items-start justify-center"
        >
          <div 
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top',
              width: canvasSize.width,
              height: canvasSize.height,
            }}
            className="relative bg-white shadow-lg"
          >
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  )
}





