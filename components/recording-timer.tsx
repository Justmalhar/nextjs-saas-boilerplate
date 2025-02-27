"use client"

import { useEffect, useState } from "react"

interface RecordingTimerProps {
  isRecording: boolean
  onTimeUpdate?: (time: number) => void
}

export function RecordingTimer({ isRecording, onTimeUpdate }: RecordingTimerProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1
          onTimeUpdate?.(newTime)
          return newTime
        })
      }, 1000)
    } else {
      setTime(0)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRecording, onTimeUpdate])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return <div className="font-mono text-sm text-white">{formatTime(time)}</div>
}

