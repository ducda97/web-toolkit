"use client"

import { useState, useRef } from "react"
import { Upload, Download, Trash2, AlertCircle, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PresetThumbnailProps {
  src: string | null
  preset: string
  filters: typeof PRESET_FILTERS[keyof typeof PRESET_FILTERS]
  isSelected: boolean
  onClick: () => void
}

function PresetThumbnail({ src, preset, filters, isSelected, onClick }: PresetThumbnailProps) {
  if (!src) return null

  const getPresetStyle = () => {
    const brightness = filters.brightness
    const contrast = filters.contrast
    const saturate = filters.saturate
    const sepia = filters.sepia
    const hueRotate = filters['hue-rotate']

    return {
      filter: `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturate}%)
        sepia(${sepia}%)
        hue-rotate(${hueRotate})
      `
    }
  }

  return (
    <button
      onClick={onClick}
      className={`relative group p-1 rounded-lg transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
        }`}
    >
      <img
        src={src}
        alt={`${preset} filter`}
        className="w-24 h-24 object-cover rounded"
        style={getPresetStyle()}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center rounded-b">
        {preset.charAt(0).toUpperCase() + preset.slice(1)}
      </div>
    </button>
  )
}

function PresetCarousel({
  preview,
  selectedPreset,
  onPresetChange
}: {
  preview: string | null
  selectedPreset: string
  onPresetChange: (preset: string) => void
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "keepSnaps",
    align: 'start'
  })

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev()
  }

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext()
  }

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2 pt-2">
          {Object.entries(PRESET_FILTERS).map(([preset, filters]) => (
            <div className="flex-[0_0_100px]" key={preset}>
              <PresetThumbnail
                src={preview}
                preset={preset}
                filters={filters}
                isSelected={selectedPreset === preset}
                onClick={() => onPresetChange(preset)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PRESET_FILTERS = {
  none: {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    sepia: 0,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  grayscale: {
    brightness: 100,
    contrast: 110,
    saturate: 100,
    sepia: 0,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 100
  },
  sepia: {
    brightness: 95,
    contrast: 105,
    saturate: 90,
    sepia: 100,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  warm: {
    brightness: 105,
    contrast: 100,
    saturate: 150,
    sepia: 30,
    'hue-rotate': '30deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  cool: {
    brightness: 100,
    contrast: 100,
    saturate: 150,
    sepia: 0,
    'hue-rotate': '-30deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  vintage: {
    brightness: 90,
    contrast: 85,
    saturate: 75,
    sepia: 50,
    'hue-rotate': '0deg',
    blur: 0.5,
    invert: 0,
    opacity: 95,
    grayscale: 10
  },
  dramatic: {
    brightness: 110,
    contrast: 150,
    saturate: 120,
    sepia: 0,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  fade: {
    brightness: 105,
    contrast: 95,
    saturate: 70,
    sepia: 10,
    'hue-rotate': '0deg',
    blur: 0.5,
    invert: 0,
    opacity: 90,
    grayscale: 15
  },
  matte: {
    brightness: 95,
    contrast: 90,
    saturate: 90,
    sepia: 10,
    'hue-rotate': '0deg',
    blur: 0.5,
    invert: 0,
    opacity: 95,
    grayscale: 10
  },
  moody: {
    brightness: 90,
    contrast: 120,
    saturate: 85,
    sepia: 20,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 10
  },
  bright: {
    brightness: 120,
    contrast: 110,
    saturate: 110,
    sepia: 0,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  punchy: {
    brightness: 110,
    contrast: 130,
    saturate: 130,
    sepia: 0,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  retro: {
    brightness: 95,
    contrast: 95,
    saturate: 85,
    sepia: 40,
    'hue-rotate': '20deg',
    blur: 0.5,
    invert: 0,
    opacity: 95,
    grayscale: 0
  },
  summer: {
    brightness: 110,
    contrast: 105,
    saturate: 120,
    sepia: 15,
    'hue-rotate': '10deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  winter: {
    brightness: 100,
    contrast: 110,
    saturate: 90,
    sepia: 10,
    'hue-rotate': '-10deg',
    blur: 0.3,
    invert: 0,
    opacity: 100,
    grayscale: 10
  },
  sunset: {
    brightness: 105,
    contrast: 110,
    saturate: 140,
    sepia: 25,
    'hue-rotate': '15deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  spring: {
    brightness: 105,
    contrast: 100,
    saturate: 130,
    sepia: 5,
    'hue-rotate': '5deg',
    blur: 0.2,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  autumn: {
    brightness: 95,
    contrast: 110,
    saturate: 130,
    sepia: 30,
    'hue-rotate': '25deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  forest: {
    brightness: 90,
    contrast: 115,
    saturate: 140,
    sepia: 15,
    'hue-rotate': '-15deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  ocean: {
    brightness: 100,
    contrast: 105,
    saturate: 120,
    sepia: 0,
    'hue-rotate': '-20deg',
    blur: 0.3,
    invert: 0,
    opacity: 98,
    grayscale: 0
  },
  desert: {
    brightness: 110,
    contrast: 115,
    saturate: 110,
    sepia: 35,
    'hue-rotate': '10deg',
    blur: 0,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  midnight: {
    brightness: 85,
    contrast: 125,
    saturate: 95,
    sepia: 10,
    'hue-rotate': '-15deg',
    blur: 0.5,
    invert: 0,
    opacity: 100,
    grayscale: 20
  },
  pastel: {
    brightness: 105,
    contrast: 90,
    saturate: 85,
    sepia: 5,
    'hue-rotate': '5deg',
    blur: 0.2,
    invert: 0,
    opacity: 95,
    grayscale: 0
  },
  neon: {
    brightness: 115,
    contrast: 130,
    saturate: 160,
    sepia: 0,
    'hue-rotate': '-10deg',
    blur: 0.5,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  cyberpunk: {
    brightness: 110,
    contrast: 140,
    saturate: 150,
    sepia: 0,
    'hue-rotate': '-30deg',
    blur: 0.3,
    invert: 15,
    opacity: 100,
    grayscale: 0
  },
  noir: {
    brightness: 85,
    contrast: 140,
    saturate: 20,
    sepia: 10,
    'hue-rotate': '0deg',
    blur: 0.5,
    invert: 0,
    opacity: 100,
    grayscale: 80
  },
  cinematic: {
    brightness: 95,
    contrast: 135,
    saturate: 95,
    sepia: 15,
    'hue-rotate': '5deg',
    blur: 0.2,
    invert: 0,
    opacity: 100,
    grayscale: 10
  },
  polaroid: {
    brightness: 105,
    contrast: 90,
    saturate: 90,
    sepia: 20,
    'hue-rotate': '0deg',
    blur: 0.3,
    invert: 0,
    opacity: 95,
    grayscale: 5
  },
  golden: {
    brightness: 105,
    contrast: 110,
    saturate: 120,
    sepia: 40,
    'hue-rotate': '25deg',
    blur: 0.2,
    invert: 0,
    opacity: 100,
    grayscale: 0
  },
  silver: {
    brightness: 100,
    contrast: 110,
    saturate: 80,
    sepia: 0,
    'hue-rotate': '-15deg',
    blur: 0.3,
    invert: 0,
    opacity: 98,
    grayscale: 20
  },
  chrome: {
    brightness: 115,
    contrast: 120,
    saturate: 110,
    sepia: 0,
    'hue-rotate': '0deg',
    blur: 0,
    invert: 5,
    opacity: 100,
    grayscale: 10
  },
  dreamy: {
    brightness: 105,
    contrast: 95,
    saturate: 90,
    sepia: 15,
    'hue-rotate': '10deg',
    blur: 1,
    invert: 0,
    opacity: 95,
    grayscale: 5
  },
  ethereal: {
    brightness: 110,
    contrast: 90,
    saturate: 95,
    sepia: 10,
    'hue-rotate': '15deg',
    blur: 0.8,
    invert: 0,
    opacity: 92,
    grayscale: 5
  },
  mystic: {
    brightness: 95,
    contrast: 110,
    saturate: 100,
    sepia: 25,
    'hue-rotate': '-20deg',
    blur: 0.5,
    invert: 0,
    opacity: 95,
    grayscale: 10
  }
} as const

export default function ImageFilter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter states
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturate, setSaturate] = useState(100)
  const [blur, setBlur] = useState(0)
  const [sepia, setSepia] = useState(0)
  const [hueRotate, setHueRotate] = useState(0)
  const [invert, setInvert] = useState(0)
  const [opacity, setOpacity] = useState(100)
  const [grayscale, setGrayscale] = useState(0)
  const [selectedPreset, setSelectedPreset] = useState("none")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setSelectedFile(file)
    resetFilters()

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturate(100)
    setBlur(0)
    setSepia(0)
    setHueRotate(0)
    setInvert(0)
    setOpacity(100)
    setGrayscale(0)
    setSelectedPreset("none")
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    resetFilters()
  }

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)
    const filters = PRESET_FILTERS[preset as keyof typeof PRESET_FILTERS]

    setBrightness(filters.brightness)
    setContrast(filters.contrast)
    setSaturate(filters.saturate)
    setSepia(filters.sepia)
    setHueRotate(parseInt(filters['hue-rotate']))
    setBlur(filters.blur)
    setInvert(filters.invert)
    setOpacity(filters.opacity)
    setGrayscale(filters.grayscale)
  }

  const getImageStyle = () => {
    const filters = selectedPreset !== "none"
      ? PRESET_FILTERS[selectedPreset as keyof typeof PRESET_FILTERS]
      : {
        brightness,
        contrast,
        saturate,
        sepia: 0,
        'hue-rotate': '0deg'
      }

    return {
      filter: `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturate}%)
        sepia(${filters.sepia}%)
        hue-rotate(${filters['hue-rotate']})
        blur(${blur}px)
        sepia(${sepia}%)
        hue-rotate(${hueRotate}deg)
        invert(${invert}%)
        opacity(${opacity}%)
        grayscale(${grayscale}%)
      `
    }
  }

  const handleDownload = async () => {
    if (!preview) return

    try {
      // Create a canvas to apply filters
      const img = new Image()
      img.src = preview

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        setError("Failed to create canvas context")
        return
      }

      canvas.width = img.width
      canvas.height = img.height

      // Apply filters to canvas
      ctx.filter = getImageStyle().filter
      ctx.drawImage(img, 0, 0)

      // Convert to blob and download
      const link = document.createElement('a')
      link.download = `filtered-${selectedFile?.name || 'image'}`

      canvas.toBlob((blob) => {
        if (blob) {
          link.href = URL.createObjectURL(blob)
          link.click()
          URL.revokeObjectURL(link.href)
        }
      }, selectedFile?.type || 'image/png')
    } catch (err) {
      setError("Failed to download image")
    }
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-4">
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
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="preset">Preset Filters</Label>
                      <Select value={selectedPreset} onValueChange={handlePresetChange}>
                        <SelectTrigger id="preset">
                          <SelectValue placeholder="Select preset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="grayscale">Grayscale</SelectItem>
                          <SelectItem value="sepia">Sepia</SelectItem>

                          {/* Basic Filters */}
                          <SelectItem value="warm">Warm</SelectItem>
                          <SelectItem value="cool">Cool</SelectItem>
                          <SelectItem value="bright">Bright</SelectItem>
                          <SelectItem value="fade">Fade</SelectItem>
                          <SelectItem value="matte">Matte</SelectItem>

                          {/* Seasonal */}
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="autumn">Autumn</SelectItem>

                          {/* Time of Day */}
                          <SelectItem value="sunset">Sunset</SelectItem>
                          <SelectItem value="midnight">Midnight</SelectItem>

                          {/* Nature */}
                          <SelectItem value="forest">Forest</SelectItem>
                          <SelectItem value="ocean">Ocean</SelectItem>
                          <SelectItem value="desert">Desert</SelectItem>

                          {/* Artistic */}
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="dramatic">Dramatic</SelectItem>
                          <SelectItem value="moody">Moody</SelectItem>
                          <SelectItem value="punchy">Punchy</SelectItem>
                          <SelectItem value="retro">Retro</SelectItem>
                          <SelectItem value="noir">Noir</SelectItem>
                          <SelectItem value="cinematic">Cinematic</SelectItem>

                          {/* Special Effects */}
                          <SelectItem value="pastel">Pastel</SelectItem>
                          <SelectItem value="neon">Neon</SelectItem>
                          <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                          <SelectItem value="polaroid">Polaroid</SelectItem>

                          {/* Metallic */}
                          <SelectItem value="golden">Golden</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="chrome">Chrome</SelectItem>

                          {/* Dreamy */}
                          <SelectItem value="dreamy">Dreamy</SelectItem>
                          <SelectItem value="ethereal">Ethereal</SelectItem>
                          <SelectItem value="mystic">Mystic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Brightness</Label>
                        <span className="text-sm text-muted-foreground">{brightness}%</span>
                      </div>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[brightness]}
                        onValueChange={(value) => setBrightness(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Contrast</Label>
                        <span className="text-sm text-muted-foreground">{contrast}%</span>
                      </div>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[contrast]}
                        onValueChange={(value) => setContrast(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Saturation</Label>
                        <span className="text-sm text-muted-foreground">{saturate}%</span>
                      </div>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[saturate]}
                        onValueChange={(value) => setSaturate(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Blur</Label>
                        <span className="text-sm text-muted-foreground">{blur}px</span>
                      </div>
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[blur]}
                        onValueChange={(value) => setBlur(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Sepia</Label>
                        <span className="text-sm text-muted-foreground">{sepia}%</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[sepia]}
                        onValueChange={(value) => setSepia(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Hue Rotate</Label>
                        <span className="text-sm text-muted-foreground">{hueRotate}°</span>
                      </div>
                      <Slider
                        min={-180}
                        max={180}
                        step={1}
                        value={[hueRotate]}
                        onValueChange={(value) => setHueRotate(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Invert</Label>
                        <span className="text-sm text-muted-foreground">{invert}%</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[invert]}
                        onValueChange={(value) => setInvert(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Opacity</Label>
                        <span className="text-sm text-muted-foreground">{opacity}%</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[opacity]}
                        onValueChange={(value) => setOpacity(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Grayscale</Label>
                        <span className="text-sm text-muted-foreground">{grayscale}%</span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[grayscale]}
                        onValueChange={(value) => setGrayscale(value[0])}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      Download
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
      </div>

      <div className="col-span-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label>Preview</Label>
              <div className="min-h-[600px] flex items-center justify-center border rounded-md bg-accent/30">
                {preview ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-[580px] object-contain"
                      style={getImageStyle()}
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Upload an image to start filtering</p>
                  </div>
                )}
              </div>

              {/* Thêm phần preset thumbnails */}
              {preview && (
                <div className="space-y-2">
                  <Label>Preset Filters</Label>
                  <PresetCarousel
                    preview={preview}
                    selectedPreset={selectedPreset}
                    onPresetChange={handlePresetChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




