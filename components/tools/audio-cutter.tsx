"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Download, Play, Pause, Scissors, Music } from "lucide-react"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions"
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface EQBand {
  frequency: number;
  gain: number;
}

interface EQVisualizerProps {
  bands: EQBand[];
  onChange: (bands: EQBand[]) => void;
}

const EQVisualizer = ({ bands, onChange }: EQVisualizerProps) => {
  const handleGainChange = (frequency: number, newGain: number) => {
    const newBands = bands.map(band => 
      band.frequency === frequency ? { ...band, gain: newGain } : band
    );
    onChange(newBands);
  };

  return (
    <div className="grid grid-cols-10 gap-2 p-4 bg-muted/30 rounded-lg">
      {bands.map((band) => (
        <div key={band.frequency} className="flex flex-col items-center gap-2">
          <input
            type="range"
            min="-12"
            max="12"
            step="0.5"
            value={band.gain}
            className="h-32 -rotate-90"
            onChange={(e) => handleGainChange(band.frequency, parseFloat(e.target.value))}
          />
          <div className="text-xs text-center">
            <div>{band.gain > 0 ? `+${band.gain}` : band.gain}dB</div>
            <div>{band.frequency < 1000 ? band.frequency : `${band.frequency/1000}k`}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EQ_PRESETS = {
  normal: {
    bands: [
      { frequency: 32, gain: 0 },
      { frequency: 64, gain: 0 },
      { frequency: 125, gain: 0 },
      { frequency: 250, gain: 0 },
      { frequency: 500, gain: 0 },
      { frequency: 1000, gain: 0 },
      { frequency: 2000, gain: 0 },
      { frequency: 4000, gain: 0 },
      { frequency: 8000, gain: 0 },
      { frequency: 16000, gain: 0 }
    ]
  },
  club: {
    bands: [
      { frequency: 32, gain: 0 },
      { frequency: 64, gain: 0 },
      { frequency: 125, gain: 8 },
      { frequency: 250, gain: 5.5 },
      { frequency: 500, gain: 5.5 },
      { frequency: 1000, gain: 5.5 },
      { frequency: 2000, gain: 3 },
      { frequency: 4000, gain: 0 },
      { frequency: 8000, gain: 0 },
      { frequency: 16000, gain: 0 }
    ]
  },
  dance: {
    bands: [
      { frequency: 32, gain: 10 },
      { frequency: 64, gain: 7 },
      { frequency: 125, gain: 2 },
      { frequency: 250, gain: 0 },
      { frequency: 500, gain: 0 },
      { frequency: 1000, gain: -5.5 },
      { frequency: 2000, gain: -7 },
      { frequency: 4000, gain: -7 },
      { frequency: 8000, gain: 0 },
      { frequency: 16000, gain: 0 }
    ]
  },
  rock: {
    bands: [
      { frequency: 32, gain: 8 },
      { frequency: 64, gain: 5 },
      { frequency: 125, gain: -5 },
      { frequency: 250, gain: -8 },
      { frequency: 500, gain: -3 },
      { frequency: 1000, gain: 4 },
      { frequency: 2000, gain: 8 },
      { frequency: 4000, gain: 11 },
      { frequency: 8000, gain: 11 },
      { frequency: 16000, gain: 11 }
    ]
  },
  pop: {
    bands: [
      { frequency: 32, gain: -1.5 },
      { frequency: 64, gain: -1.5 },
      { frequency: 125, gain: 0 },
      { frequency: 250, gain: 4 },
      { frequency: 500, gain: 7 },
      { frequency: 1000, gain: 7 },
      { frequency: 2000, gain: 4 },
      { frequency: 4000, gain: 2 },
      { frequency: 8000, gain: 1.5 },
      { frequency: 16000, gain: 1.5 }
    ]
  },
  classical: {
    bands: [
      { frequency: 32, gain: 0 },
      { frequency: 64, gain: 0 },
      { frequency: 125, gain: 0 },
      { frequency: 250, gain: 0 },
      { frequency: 500, gain: 0 },
      { frequency: 1000, gain: 0 },
      { frequency: 2000, gain: -6 },
      { frequency: 4000, gain: -6 },
      { frequency: 8000, gain: -6 },
      { frequency: 16000, gain: -8 }
    ]
  },
  bass: {
    bands: [
      { frequency: 32, gain: 10 },
      { frequency: 64, gain: 10 },
      { frequency: 125, gain: 10 },
      { frequency: 250, gain: 6 },
      { frequency: 500, gain: 4 },
      { frequency: 1000, gain: 0 },
      { frequency: 2000, gain: 0 },
      { frequency: 4000, gain: 0 },
      { frequency: 8000, gain: 0 },
      { frequency: 16000, gain: 0 }
    ]
  },
  treble: {
    bands: [
      { frequency: 32, gain: 0 },
      { frequency: 64, gain: 0 },
      { frequency: 125, gain: 0 },
      { frequency: 250, gain: 0 },
      { frequency: 500, gain: 0 },
      { frequency: 1000, gain: 4 },
      { frequency: 2000, gain: 6 },
      { frequency: 4000, gain: 8 },
      { frequency: 8000, gain: 10 },
      { frequency: 16000, gain: 12 }
    ]
  }
}

const AUDIO_EFFECTS = {
  none: { gain: 1, speed: 1, eq: EQ_PRESETS.normal },
  nightcore: { gain: 1, speed: 1.3, eq: EQ_PRESETS.pop },
  vaporwave: { gain: 1, speed: 0.7, eq: EQ_PRESETS.bass },
  club: { gain: 1, speed: 1, eq: EQ_PRESETS.club },
  dance: { gain: 1, speed: 1, eq: EQ_PRESETS.dance },
  rock: { gain: 1, speed: 1, eq: EQ_PRESETS.rock },
  pop: { gain: 1, speed: 1, eq: EQ_PRESETS.pop },
  classical: { gain: 1, speed: 1, eq: EQ_PRESETS.classical },
  bass: { gain: 1, speed: 1, eq: EQ_PRESETS.bass },
  treble: { gain: 1, speed: 1, eq: EQ_PRESETS.treble }
}

let currentFilters: BiquadFilterNode[] = []

export default function AudioCutter() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEffect, setCurrentEffect] = useState("none")
  const [error, setError] = useState<string>("")
  
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const regionsRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeRegion = useRef<any>(null)

  useEffect(() => {
    if (waveformRef.current) {
      // Initialize WaveSurfer
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#C7D2FE',
        height: 128,
        normalize: true,
        plugins: [
          TimelinePlugin.create(),
          RegionsPlugin.create()
        ]
      })

      wavesurferRef.current = wavesurfer

      // Event listeners
      wavesurfer.on('ready', () => {
        const regions = (wavesurfer as any).plugins.regions
        const region = regions.addRegion({
          start: 0,
          end: wavesurfer.getDuration(),
          color: 'rgba(79, 70, 229, 0.2)',
          drag: true,
          resize: true
        })
        activeRegion.current = region
        regionsRef.current = regions
      })

      wavesurfer.on('play', () => setIsPlaying(true))
      wavesurfer.on('pause', () => setIsPlaying(false))
      wavesurfer.on('finish', () => setIsPlaying(false))

      // Cleanup
      return () => {
        wavesurfer.destroy()
      }
    }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log("No file selected")
      return
    }

    if (!file.type.startsWith('audio/')) {
      console.log("Invalid file type:", file.type)
      setError("Please select an audio file")
      return
    }

    try {
      console.log("Processing file:", file.name)
      setAudioFile(file)
      setError("")

      if (!waveformRef.current) {
        console.error("Waveform container not found")
        return
      }

      // Always destroy existing instance
      if (wavesurferRef.current) {
        console.log("Destroying existing wavesurfer instance")
        wavesurferRef.current.destroy()
      }

      // Create RegionsPlugin instance
      const regionsPlugin = RegionsPlugin.create()

      console.log("Creating new wavesurfer instance")
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#C7D2FE',
        height: 128,
        normalize: true,
        plugins: [
          TimelinePlugin.create(),
          regionsPlugin
        ]
      })

      // Store the new instance
      wavesurferRef.current = wavesurfer
      regionsRef.current = regionsPlugin

      // Set up event listeners before loading the file
      wavesurfer.on('ready', () => {
        console.log("Wavesurfer is ready")
        
        try {
          const region = regionsPlugin.addRegion({
            start: 0,
            end: wavesurfer.getDuration(),
            color: 'rgba(79, 70, 229, 0.2)',
            drag: true,
            resize: true
          })
          activeRegion.current = region
          console.log("Region created:", region)
          console.log("Audio duration:", wavesurfer.getDuration())
        } catch (err) {
          console.error("Error creating region:", err)
        }
      })

      wavesurfer.on('error', (error) => {
        console.error("Wavesurfer error:", error)
        setError("Error loading audio file")
      })

      // Load the file
      console.log("Loading audio file")
      const arrayBuffer = await file.arrayBuffer()
      await wavesurfer.loadBlob(new Blob([arrayBuffer]))
      
      console.log("Audio file loaded successfully")
      toast.success("Audio loaded successfully!")

    } catch (err) {
      console.error("Error in handleFileChange:", err)
      setError("Failed to load audio file")
      toast.error("Failed to load audio file")
    }
  }

  const togglePlayPause = () => {
    if (!wavesurferRef.current) return
    wavesurferRef.current.playPause()
  }

  const handleEffectChange = (value: string) => {
    if (!wavesurferRef.current) return
    
    setCurrentEffect(value)
    const effect = AUDIO_EFFECTS[value as keyof typeof AUDIO_EFFECTS]
    
    // Apply effect
    wavesurferRef.current.setPlaybackRate(effect.speed)
    // You can add more audio effects here using Web Audio API
  }

  const handleCutAudio = async () => {
    if (!audioFile || !wavesurferRef.current || !activeRegion.current) return

    try {
      const region = activeRegion.current
      const originalBuffer = wavesurferRef.current.getDecodedData()
      
      if (!originalBuffer) {
        throw new Error("No audio data available")
      }

      // Create new AudioContext
      const audioContext = new AudioContext()
      
      // Calculate region duration
      const startSample = Math.floor(region.start * originalBuffer.sampleRate)
      const endSample = Math.floor(region.end * originalBuffer.sampleRate)
      const newLength = endSample - startSample
      
      // Create new buffer for the cut portion
      const newBuffer = audioContext.createBuffer(
        originalBuffer.numberOfChannels,
        newLength,
        originalBuffer.sampleRate
      )
      
      // Copy the selected portion
      for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
        const channelData = originalBuffer.getChannelData(channel)
        const newChannelData = newBuffer.getChannelData(channel)
        for (let i = 0; i < newLength; i++) {
          newChannelData[i] = channelData[startSample + i]
        }
      }
      
      // Apply selected effect
      const effect = AUDIO_EFFECTS[currentEffect as keyof typeof AUDIO_EFFECTS]
      if (effect.speed !== 1) {
        // Implement pitch shifting here if needed
        // This is a simplified version that only changes speed
        const pitchBuffer = audioContext.createBuffer(
          newBuffer.numberOfChannels,
          Math.floor(newBuffer.length / effect.speed),
          newBuffer.sampleRate
        )
        
        for (let channel = 0; channel < newBuffer.numberOfChannels; channel++) {
          const channelData = newBuffer.getChannelData(channel)
          const pitchChannelData = pitchBuffer.getChannelData(channel)
          for (let i = 0; i < pitchBuffer.length; i++) {
            pitchChannelData[i] = channelData[Math.floor(i * effect.speed)]
          }
        }
        
        // Convert to wav and download
        const blob = await audioBufferToWav(pitchBuffer)
        downloadBlob(blob, `${currentEffect}_${audioFile.name}`)
      } else {
        // Convert to wav and download without effects
        const blob = await audioBufferToWav(newBuffer)
        downloadBlob(blob, `cut_${audioFile.name}`)
      }

      toast.success("Audio successfully exported!")
    } catch (err) {
      setError("Failed to process audio file")
      console.error(err)
      toast.error("Failed to process audio file")
    }
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Upload Button */}
            <div>
              <Label>Upload Audio</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Audio File
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Waveform Container - Always render this */}
            <div 
              ref={waveformRef} 
              className="w-full h-32 border rounded-md bg-white" 
              style={{ minHeight: '128px' }}
            />

            {/* Audio Controls - Show only when audio is loaded */}
            {audioFile && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlayPause}
                    variant="outline"
                    size="sm"
                    className="w-24"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>

                  <Select value={currentEffect} onValueChange={handleEffectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose effect" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(AUDIO_EFFECTS).map((effect) => (
                        <SelectItem key={effect} value={effect}>
                          {effect.charAt(0).toUpperCase() + effect.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCutAudio} variant="outline" size="sm">
                    <Scissors className="h-4 w-4 mr-2" />
                    Cut
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer) {
  const numberOfChannels = buffer.numberOfChannels
  const length = buffer.length * numberOfChannels * 2
  const outputBuffer = new ArrayBuffer(44 + length)
  const view = new DataView(outputBuffer)
  const channels = []
  let offset = 0
  let pos = 0

  // Write WAV header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + length, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * 2 * numberOfChannels, true)
  view.setUint16(32, numberOfChannels * 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, length, true)

  // Write audio data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }

  while (pos < buffer.length) {
    for (let i = 0; i < numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][pos]))
      view.setInt16(44 + offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
    pos++
  }

  return new Blob([outputBuffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
