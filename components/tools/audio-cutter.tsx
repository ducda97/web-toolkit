"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions"
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
  none: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.normal,
    frequencies: {
      bass: 0,    // dB
      mid: 0,     // dB
      treble: 0   // dB
    }
  },
  nightcore: { 
    gain: 1, 
    speed: 1.3, 
    eq: EQ_PRESETS.pop,
    frequencies: {
      bass: 2,    // Tăng bass nhẹ
      mid: 3,     // Tăng mid để giọng rõ
      treble: 4   // Tăng treble để thêm độ sáng
    }
  },
  vaporwave: { 
    gain: 1, 
    speed: 0.7, 
    eq: EQ_PRESETS.bass,
    frequencies: {
      bass: 6,    // Tăng bass mạnh
      mid: -2,    // Giảm mid
      treble: -3  // Giảm treble để âm trầm hơn
    }
  },
  club: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.club,
    frequencies: {
      bass: 4,    // Tăng bass
      mid: 3,     // Tăng mid
      treble: 1   // Tăng treble nhẹ
    }
  },
  dance: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.dance,
    frequencies: {
      bass: 5,    // Tăng bass mạnh
      mid: -2,    // Giảm mid
      treble: 2   // Tăng treble vừa phải
    }
  },
  rock: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.rock,
    frequencies: {
      bass: 3,    // Tăng bass vừa phải
      mid: 2,     // Tăng mid nhẹ
      treble: 4   // Tăng treble mạnh
    }
  },
  pop: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.pop,
    frequencies: {
      bass: 1,    // Tăng bass nhẹ
      mid: 4,     // Tăng mid mạnh
      treble: 2   // Tăng treble vừa phải
    }
  },
  classical: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.classical,
    frequencies: {
      bass: 0,    // Giữ nguyên bass
      mid: 2,     // Tăng mid nhẹ
      treble: -2  // Giảm treble nhẹ
    }
  },
  bass: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.bass,
    frequencies: {
      bass: 8,    // Tăng bass rất mạnh
      mid: -1,    // Giảm mid nhẹ
      treble: -4  // Giảm treble mạnh
    }
  },
  treble: { 
    gain: 1, 
    speed: 1, 
    eq: EQ_PRESETS.treble,
    frequencies: {
      bass: -2,   // Giảm bass nhẹ
      mid: 0,     // Giữ nguyên mid
      treble: 8   // Tăng treble rất mạnh
    }
  }
}

// Thêm biến để lưu trữ AudioContext và SourceNode ở level cao hơn
let audioCtx: AudioContext | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let currentFilters: BiquadFilterNode[] = [];

// Thêm interface cho custom settings
interface CustomSettings {
  gain: number;
  speed: number;
  frequencies: {
    bass: number;
    mid: number;
    treble: number;
  };
}

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

  // Thêm state cho custom settings
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    gain: 1,
    speed: 1,
    frequencies: {
      bass: 0,
      mid: 0,
      treble: 0
    }
  });

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
    setIsPlaying(!isPlaying)
  }

  const handleEffectChange = (value: string) => {
    if (!wavesurferRef.current) return
    
    setCurrentEffect(value)
    const effect = AUDIO_EFFECTS[value as keyof typeof AUDIO_EFFECTS]
    
    // Cập nhật custom settings theo preset được chọn
    setCustomSettings({
      gain: effect.gain,
      speed: effect.speed,
      frequencies: {
        bass: effect.frequencies.bass,
        mid: effect.frequencies.mid,
        treble: effect.frequencies.treble
      }
    })

    // Áp dụng tốc độ phát
    wavesurferRef.current.setPlaybackRate(effect.speed)

    try {
      // Tạo AudioContext nếu chưa có
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Xóa các filter cũ
      currentFilters.forEach(filter => {
        filter.disconnect();
      });
      currentFilters = [];

      // Tạo và áp dụng các filter mới
      const bassFilter = audioCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 200;
      bassFilter.gain.value = effect.frequencies.bass;

      const midFilter = audioCtx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1500;
      midFilter.Q.value = 1;
      midFilter.gain.value = effect.frequencies.mid;

      const trebleFilter = audioCtx.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 3000;
      trebleFilter.gain.value = effect.frequencies.treble;

      const audioElement = wavesurferRef.current.getMediaElement();
      if (audioElement) {
        // Tạo source node mới nếu chưa có
        if (!sourceNode) {
          sourceNode = audioCtx.createMediaElementSource(audioElement);
        } else {
          // Ngắt kết nối source node hiện tại
          sourceNode.disconnect();
        }

        // Kết nối các node mới
        sourceNode.connect(bassFilter);
        bassFilter.connect(midFilter);
        midFilter.connect(trebleFilter);
        trebleFilter.connect(audioCtx.destination);

        // Lưu các filter để có thể xóa sau này
        currentFilters = [bassFilter, midFilter, trebleFilter];
      }
    } catch (err) {
      console.error('Error applying audio effects:', err);
      toast.error("Failed to apply audio effect");
    }
  }

  const handleCutAudio = async () => {
    if (!wavesurferRef.current || !activeRegion.current) {
      toast.error("Please select a region to cut")
      return
    }

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

      // Copy the selected portion of audio
      for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
        const originalData = originalBuffer.getChannelData(channel)
        const newData = newBuffer.getChannelData(channel)
        
        for (let i = 0; i < newLength; i++) {
          newData[i] = originalData[startSample + i]
        }
      }

      // Apply effects to the new buffer
      const offlineContext = new OfflineAudioContext(
        newBuffer.numberOfChannels,
        newBuffer.length,
        newBuffer.sampleRate
      )

      // Create source from new buffer
      const source = offlineContext.createBufferSource()
      source.buffer = newBuffer

      // Apply current effects
      const bassFilter = offlineContext.createBiquadFilter()
      bassFilter.type = 'lowshelf'
      bassFilter.frequency.value = 200
      bassFilter.gain.value = customSettings.frequencies.bass

      const midFilter = offlineContext.createBiquadFilter()
      midFilter.type = 'peaking'
      midFilter.frequency.value = 1500
      midFilter.Q.value = 1
      midFilter.gain.value = customSettings.frequencies.mid

      const trebleFilter = offlineContext.createBiquadFilter()
      trebleFilter.type = 'highshelf'
      trebleFilter.frequency.value = 3000
      trebleFilter.gain.value = customSettings.frequencies.treble

      // Connect nodes
      source.connect(bassFilter)
      bassFilter.connect(midFilter)
      midFilter.connect(trebleFilter)
      trebleFilter.connect(offlineContext.destination)

      // Start the source
      source.start()

      // Render the audio
      const renderedBuffer = await offlineContext.startRendering()

      // Apply playback speed
      const speedAdjustedLength = Math.floor(renderedBuffer.length / customSettings.speed)
      const speedAdjustedBuffer = audioContext.createBuffer(
        renderedBuffer.numberOfChannels,
        speedAdjustedLength,
        renderedBuffer.sampleRate
      )

      for (let channel = 0; channel < renderedBuffer.numberOfChannels; channel++) {
        const channelData = renderedBuffer.getChannelData(channel)
        const newChannelData = speedAdjustedBuffer.getChannelData(channel)
        
        for (let i = 0; i < speedAdjustedLength; i++) {
          newChannelData[i] = channelData[Math.floor(i * customSettings.speed)]
        }
      }

      // Convert to WAV and download
      const wav = audioBufferToWav(speedAdjustedBuffer)
      const url = URL.createObjectURL(wav)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `cut_audio_${currentEffect !== 'none' ? currentEffect : 'custom'}.wav`
      link.click()
      
      URL.revokeObjectURL(url)
      toast.success("Audio cut and downloaded successfully!")
    } catch (err) {
      console.error('Error cutting audio:', err)
      toast.error("Failed to cut audio")
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

  // Thêm cleanup function trong useEffect để dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      // Cleanup audio nodes
      if (sourceNode) {
        sourceNode.disconnect();
        sourceNode = null;
      }
      if (currentFilters.length) {
        currentFilters.forEach(filter => filter.disconnect());
        currentFilters = [];
      }
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    };
  }, []);

  // Thêm UI cho custom settings
  const CustomSettingsPanel = () => {
    return (
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <div>
          <label className="text-sm font-medium">Speed</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={customSettings.speed}
            className="w-full"
            onChange={(e) => {
              const newSpeed = parseFloat(e.target.value);
              setCustomSettings(prev => ({
                ...prev,
                speed: newSpeed
              }));
              if (wavesurferRef.current) {
                wavesurferRef.current.setPlaybackRate(newSpeed);
              }
            }}
          />
          <div className="text-xs text-right">{customSettings.speed}x</div>
        </div>

        <div>
          <label className="text-sm font-medium">Gain</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={customSettings.gain}
            className="w-full"
            onChange={(e) => {
              setCustomSettings(prev => ({
                ...prev,
                gain: parseFloat(e.target.value)
              }));
            }}
          />
          <div className="text-xs text-right">{customSettings.gain}x</div>
        </div>

        <div>
          <label className="text-sm font-medium">Bass</label>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={customSettings.frequencies.bass}
            className="w-full"
            onChange={(e) => {
              setCustomSettings(prev => ({
                ...prev,
                frequencies: {
                  ...prev.frequencies,
                  bass: parseFloat(e.target.value)
                }
              }));
            }}
          />
          <div className="text-xs text-right">{customSettings.frequencies.bass} dB</div>
        </div>

        <div>
          <label className="text-sm font-medium">Mid</label>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={customSettings.frequencies.mid}
            className="w-full"
            onChange={(e) => {
              setCustomSettings(prev => ({
                ...prev,
                frequencies: {
                  ...prev.frequencies,
                  mid: parseFloat(e.target.value)
                }
              }));
            }}
          />
          <div className="text-xs text-right">{customSettings.frequencies.mid} dB</div>
        </div>

        <div>
          <label className="text-sm font-medium">Treble</label>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={customSettings.frequencies.treble}
            className="w-full"
            onChange={(e) => {
              setCustomSettings(prev => ({
                ...prev,
                frequencies: {
                  ...prev.frequencies,
                  treble: parseFloat(e.target.value)
                }
              }));
            }}
          />
          <div className="text-xs text-right">{customSettings.frequencies.treble} dB</div>
        </div>

        <button
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          onClick={() => applyCustomSettings()}
        >
          Apply Settings
        </button>
      </div>
    );
  };

  // Thêm hàm để áp dụng custom settings
  const applyCustomSettings = () => {
    if (!wavesurferRef.current) return;

    try {
      // Áp dụng tốc độ
      wavesurferRef.current.setPlaybackRate(customSettings.speed);

      // Tạo AudioContext nếu chưa có
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Xóa các filter cũ
      currentFilters.forEach(filter => {
        filter.disconnect();
      });
      currentFilters = [];

      // Tạo và áp dụng các filter mới
      const bassFilter = audioCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 200;
      bassFilter.gain.value = customSettings.frequencies.bass;

      const midFilter = audioCtx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1500;
      midFilter.Q.value = 1;
      midFilter.gain.value = customSettings.frequencies.mid;

      const trebleFilter = audioCtx.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 3000;
      trebleFilter.gain.value = customSettings.frequencies.treble;

      const audioElement = wavesurferRef.current.getMediaElement();
      if (audioElement) {
        // Tạo source node mới nếu chưa có
        if (!sourceNode) {
          sourceNode = audioCtx.createMediaElementSource(audioElement);
        } else {
          // Ngắt kết nối source node hiện tại
          sourceNode.disconnect();
        }

        // Kết nối các node mới
        sourceNode.connect(bassFilter);
        bassFilter.connect(midFilter);
        midFilter.connect(trebleFilter);
        trebleFilter.connect(audioCtx.destination);

        // Lưu các filter để có thể xóa sau này
        currentFilters = [bassFilter, midFilter, trebleFilter];
      }

      toast.success("Custom settings applied successfully!");
    } catch (err) {
      console.error('Error applying custom settings:', err);
      toast.error("Failed to apply custom settings");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="space-y-6">
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

        {/* Playback Controls */}
        {audioFile && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={togglePlayPause}
              variant="outline"
              size="icon"
              className="w-12 h-12"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>
        )}

        {/* Audio Controls - Show only when audio is loaded */}
        {audioFile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preset Effects */}
            <Card>
              <CardHeader>
                <CardTitle>Preset Effects</CardTitle>
                <CardDescription>Choose from predefined audio effects</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={currentEffect} onValueChange={handleEffectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                      <SelectItem value="club">Club</SelectItem>
                      <SelectItem value="dance">Dance</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="classical">Classical</SelectItem>
                      <SelectItem value="bass">Bass Boost</SelectItem>
                      <SelectItem value="treble">Treble Boost</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Custom Settings Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Settings</CardTitle>
                <CardDescription>Fine-tune your audio parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomSettingsPanel />
              </CardContent>
            </Card>

            {/* Cut Audio Button */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cut Audio</CardTitle>
                  <CardDescription>
                    Cut the selected region with current effects applied
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Selected region: {activeRegion.current ? 
                        `${activeRegion.current.start.toFixed(2)}s to ${activeRegion.current.end.toFixed(2)}s` : 
                        'No region selected'}
                    </p>
                    <Button 
                      onClick={handleCutAudio}
                      className="w-full"
                      disabled={!activeRegion.current}
                    >
                      Cut and Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
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
