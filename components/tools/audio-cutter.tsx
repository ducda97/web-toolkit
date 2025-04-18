"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Download, Play, Pause, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RangeSlider } from "@/components/ui/range-slider"

export default function AudioCutter() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [duration, setDuration] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0])
  const [error, setError] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Clean up URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  // Update progress bar position
  useEffect(() => {
    if (!isDragging && audioRef.current && progressBarRef.current) {
      const progress = (currentTime / duration) * 100
      progressBarRef.current.style.width = `${progress}%`
    }
  }, [currentTime, duration, isDragging])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      setError("Please select an audio file")
      return
    }

    setAudioFile(file)
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    setError("")

    // Reset states
    setCurrentTime(0)
    setIsPlaying(false)
    setTimeRange([0, 0])
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration
      setDuration(audioDuration)
      setTimeRange([0, audioDuration])
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const time = audioRef.current.currentTime
      setCurrentTime(time)
      
      // Khi đến cuối range, quay lại điểm start và dừng
      if (time >= timeRange[1]) {
        audioRef.current.pause()
        audioRef.current.currentTime = timeRange[0]
        setIsPlaying(false)
      }
    }
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return

    const bounds = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const width = bounds.width
    const percentage = x / width
    const newTime = percentage * duration

    // Only update if within the selected range
    if (newTime >= timeRange[0] && newTime <= timeRange[1]) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // Nếu vị trí hiện tại nằm ngoài range, bắt đầu từ điểm start
      if (currentTime < timeRange[0] || currentTime > timeRange[1]) {
        audioRef.current.currentTime = timeRange[0]
        setCurrentTime(timeRange[0])
      }
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleRangeChange = (values: number[]) => {
    setTimeRange([values[0], values[1]])
    
    if (audioRef.current) {
      // Luôn cập nhật vị trí phát về điểm start mới khi kéo điểm start
      if (values[0] !== timeRange[0]) {
        audioRef.current.currentTime = values[0]
        setCurrentTime(values[0])
      }
      // Nếu đang phát và vị trí hiện tại vượt quá end point mới
      else if (isPlaying && audioRef.current.currentTime > values[1]) {
        audioRef.current.currentTime = values[0]
        setCurrentTime(values[0])
      }
    }
  }

  const handleRangeChangeStart = () => {
    setIsDragging(true)
  }

  const handleRangeChangeEnd = () => {
    setIsDragging(false)
  }

  const handleCutAudio = async () => {
    if (!audioFile) return

    try {
      // Here you would implement the actual audio cutting logic
      // This is a placeholder for the actual implementation
      const audioContext = new AudioContext()
      const audioBuffer = await audioFile.arrayBuffer()
      const decodedBuffer = await audioContext.decodeAudioData(audioBuffer)
      
      // Calculate start and end samples
      const sampleRate = decodedBuffer.sampleRate
      const startSample = Math.floor(timeRange[0] * sampleRate)
      const endSample = Math.floor(timeRange[1] * sampleRate)
      
      // Create new buffer for the cut portion
      const cutLength = endSample - startSample
      const newBuffer = audioContext.createBuffer(
        decodedBuffer.numberOfChannels,
        cutLength,
        sampleRate
      )
      
      // Copy the portion we want to keep
      for (let channel = 0; channel < decodedBuffer.numberOfChannels; channel++) {
        const channelData = decodedBuffer.getChannelData(channel)
        const newChannelData = newBuffer.getChannelData(channel)
        for (let i = 0; i < cutLength; i++) {
          newChannelData[i] = channelData[startSample + i]
        }
      }
      
      // Convert to wav/mp3 and trigger download
      // This is simplified - you'd want to use a proper audio encoding library
      const blob = await audioBufferToWav(newBuffer)
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `cut_${audioFile.name}`
      a.click()
      
      URL.revokeObjectURL(url)
    } catch (err) {
      setError("Failed to cut audio file")
      console.error(err)
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
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

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {audioUrl && (
              <div className="space-y-6">
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Start: {formatTime(timeRange[0])}</span>
                    <span>Current: {formatTime(currentTime)}</span>
                    <span>End: {formatTime(timeRange[1])}</span>
                  </div>

                  {/* Progress bar */}
                  <div 
                    className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
                    onClick={handleProgressBarClick}
                  >
                    <div 
                      ref={progressBarRef}
                      className="h-full bg-blue-500 rounded-full relative"
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-700 rounded-full"></div>
                    </div>
                  </div>

                  {/* Range slider */}
                  <RangeSlider
                    min={0}
                    max={duration}
                    step={0.1}
                    value={timeRange}
                    onValueChange={handleRangeChange}
                    onDragStart={handleRangeChangeStart}
                    onValueCommit={handleRangeChangeEnd}
                    className="my-4"
                  />

                  <div className="flex justify-between">
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
                    <Button
                      onClick={handleCutAudio}
                      className="w-24"
                    >
                      <Scissors className="h-4 w-4 mr-2" />
                      Cut
                    </Button>
                  </div>
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





