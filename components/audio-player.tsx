"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  audioUrl: string
  initialDuration?: number
  onPlayingChange: (isPlaying: boolean) => void
}

export function AudioPlayer({ audioUrl, initialDuration, onPlayingChange }: AudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(initialDuration || 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const setAudioData = () => {
        const audioDuration = initialDuration || audio.duration
        if (isFinite(audioDuration)) {
          setDuration(audioDuration)
        }
      }

      const setAudioTime = () => {
        const currentTime = audio.currentTime
        if (isFinite(currentTime)) {
          setCurrentTime(currentTime)
        }
      }

      // Reset states when audio source changes
      setCurrentTime(0)
      if (initialDuration) {
        setDuration(initialDuration)
      }

      audio.addEventListener("loadedmetadata", setAudioData)
      audio.addEventListener("durationchange", setAudioData)
      audio.addEventListener("timeupdate", setAudioTime)
      audio.addEventListener("loadeddata", setAudioData)

      // Load the audio to get duration if not provided
      if (!initialDuration) {
        audio.load()
      }

      return () => {
        audio.removeEventListener("loadedmetadata", setAudioData)
        audio.removeEventListener("durationchange", setAudioData)
        audio.removeEventListener("timeupdate", setAudioTime)
        audio.removeEventListener("loadeddata", setAudioData)
      }
    }
  }, [audioUrl, initialDuration, audioRef])

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
      onPlayingChange(!isPlaying)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-2">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onEnded={() => {
          setIsPlaying(false)
          onPlayingChange(false)
          setCurrentTime(0)
        }}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button variant="ghost" size="icon" onClick={togglePlayback} className="btn-3d h-8 w-8">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-xs text-white/60 w-10 tabular-nums">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSliderChange}
            className="[&>span:first-child]:bg-slate-700 [&>span:first-child]:h-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white"
          />
          <span className="text-xs text-white/60 w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}

