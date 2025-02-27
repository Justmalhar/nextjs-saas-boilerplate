"use client"

import { useEffect, useRef, useState } from "react"

interface AudioVisualizerProps {
  stream?: MediaStream | null
  isRecording: boolean
}

export function AudioVisualizer({ stream, isRecording }: AudioVisualizerProps) {
  const [audioData, setAudioData] = useState<number[]>(new Array(80).fill(0))
  const animationRef = useRef<number>()
  const analyserRef = useRef<AnalyserNode>()
  const audioContextRef = useRef<AudioContext>()

  useEffect(() => {
    if (!stream || !isRecording) return

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)

    analyser.fftSize = 512
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording) return

      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      // Process the data to fit our 160 bars
      const processedData = Array.from({ length: 80 }, (_, i) => {
        const index = Math.floor((i * bufferLength) / 80)
        return dataArray[index] / 255 // Normalize to 0-1
      })

      setAudioData(processedData)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stream, isRecording])

  const containerStyle = {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15, 23, 42, 0.3)",
    borderRadius: "0.5rem",
    padding: "10px",
  }

  const barStyle = (height: number) => ({
    background: "#f32968",
    margin: "0 1px",
    width: "3px",
    height: `${height * 100}%`,
    opacity: 0.35 + height * 0.65,
    transition: "height 0.1s ease",
  })

  return (
    <div style={containerStyle}>
      {audioData.map((height, index) => (
        <div key={index} style={barStyle(height)} />
      ))}
    </div>
  )
}

