"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AudioVisualizer } from "@/components/audio-visualizer"
import { RecordingTimer } from "@/components/recording-timer"
import { Mic, Square, Trash2, Loader2, Copy, Check, Search, Menu, X, Link } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { convertToWav } from "@/utils/audio-converter"
import { AudioPlayer } from "@/components/audio-player"
import { SHORTCUTS, isShortcutPressed } from "@/utils/keyboard-shortcuts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type RecordingMode = "Default" | "Todo" | "Meeting" | "Architect" | "Code" | "Brainstorm" | "Blog" | "Tweet" | "Thread"

interface Recording {
  id: string
  title: string
  timestamp: Date
  duration: number
  transcript: string
  audioUrl: string
  fileSize: number
  format: string
  isTranscribing: boolean
  isGeneratingContent: boolean
  mode: RecordingMode
  generatedContent: string
}

const MarkdownContent = ({ content }: { content: string }) => {
  return (
    <div className="markdown-container h-[400px] overflow-y-auto pr-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-xl font-bold mb-2 text-white" {...props} />,
          h2: (props) => <h2 className="text-lg font-bold mb-2 text-white" {...props} />,
          h3: (props) => <h3 className="text-md font-bold mb-1 text-white" {...props} />,
          p: (props) => <p className="mb-4 text-white" {...props} />,
          ul: (props) => <ul className="mb-4 pl-6 list-disc" {...props} />,
          ol: (props) => <ol className="mb-4 pl-6 list-decimal" {...props} />,
          li: (props) => <li className="mb-1 text-white" {...props} />,
          a: (props) => <a className="text-blue-400 hover:underline" {...props} />,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return (
              <code
                className={`${match ? 'bg-slate-700' : 'bg-slate-700'} ${match ? 'block p-3 rounded my-2' : 'px-1 py-0.5 rounded'} text-white overflow-x-auto`}
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: (props) => <blockquote className="border-l-4 border-slate-500 pl-4 italic my-4 text-slate-300" {...props} />,
          em: (props) => <em className="text-slate-300 italic" {...props} />,
          strong: (props) => <strong className="font-bold text-white" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default function Page() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [selectedMode, setSelectedMode] = useState<RecordingMode>("Default")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      if (isShortcutPressed(e, SHORTCUTS.TOGGLE_RECORDING)) {
        e.preventDefault()
        if (isRecording) {
          stopRecording()
        } else if (!selectedRecording) {
          startRecording()
        }
      }

      if (isShortcutPressed(e, SHORTCUTS.STOP_RECORDING) && isRecording) {
        e.preventDefault()
        stopRecording()
      }

      if (isShortcutPressed(e, SHORTCUTS.TOGGLE_PLAYBACK) && selectedRecording && !isRecording) {
        e.preventDefault()
        togglePlayback()
      }

      if (isShortcutPressed(e, SHORTCUTS.FOCUS_SEARCH)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      if (isShortcutPressed(e, SHORTCUTS.NEW_RECORDING) && !isRecording) {
        e.preventDefault()
        startRecording()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRecording, selectedRecording])

  const transcribeAudio = async (recording: Recording) => {
    console.log("Starting transcription for recording:", recording.id)
    try {
      setRecordings((prev) => prev.map((rec) => (rec.id === recording.id ? { ...rec, isTranscribing: true } : rec)))
      setSelectedRecording((prev) => (prev && prev.id === recording.id ? { ...prev, isTranscribing: true } : prev))

      console.log("Fetching audio blob...")
      const response = await fetch(recording.audioUrl)
      const webmBlob = await response.blob()

      console.log("Converting to WAV...")
      const wavBlob = await convertToWav(webmBlob)

      console.log("Preparing form data...")
      const formData = new FormData()
      formData.append("audio", wavBlob, "recording.wav")

      console.log("Sending transcription request...")
      const result = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!result.ok) {
        const errorData = await result.json()
        throw new Error(errorData.error || "Failed to transcribe audio")
      }

      console.log("Parsing transcription result...")
      const data = await result.json()

      // Update recordings with transcript
      setRecordings((prev) =>
        prev.map((rec) =>
          rec.id === recording.id
            ? {
                ...rec,
                transcript: data.transcript,
                isTranscribing: false,
                isGeneratingContent: true,
              }
            : rec,
        ),
      )
      setSelectedRecording((prev) =>
        prev && prev.id === recording.id
          ? {
              ...prev,
              transcript: data.transcript,
              isTranscribing: false,
              isGeneratingContent: true,
            }
          : prev,
      )

      console.log("Transcription complete for recording:", recording.id)
      toast.success("Transcription complete! Generating content...")

      // Start content generation
      generateContent(recording.id, data.transcript, recording.mode)
    } catch (error) {
      console.error("Transcription error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(`Transcription failed: ${errorMessage}. Please try again later.`)
      setRecordings((prev) => prev.map((rec) => (rec.id === recording.id ? { ...rec, isTranscribing: false } : rec)))
      setSelectedRecording((prev) => (prev && prev.id === recording.id ? { ...prev, isTranscribing: false } : prev))
    }
  }

  const generateContent = async (recordingId: string, transcript: string, mode: RecordingMode) => {
    try {
      console.log("Generating content based on transcription...")
      const contentResult = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          mode,
        }),
      })

      if (!contentResult.ok) {
        const errorData = await contentResult.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const contentData = await contentResult.json()

      console.log("Updating recordings with generated content...")
      setRecordings((prev) =>
        prev.map((rec) =>
          rec.id === recordingId
            ? {
                ...rec,
                generatedContent: contentData.content,
                isGeneratingContent: false,
              }
            : rec,
        ),
      )
      setSelectedRecording((prev) =>
        prev && prev.id === recordingId
          ? {
              ...prev,
              generatedContent: contentData.content,
              isGeneratingContent: false,
            }
          : prev,
      )

      console.log("Content generation complete for recording:", recordingId)
      toast.success("Content generation complete!")
    } catch (error) {
      console.error("Content generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(`Content generation failed: ${errorMessage}. Please try again later.`)
      setRecordings((prev) =>
        prev.map((rec) => (rec.id === recordingId ? { ...rec, isGeneratingContent: false } : rec)),
      )
      setSelectedRecording((prev) => (prev && prev.id === recordingId ? { ...prev, isGeneratingContent: false } : prev))
    }
  }

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(mediaStream)
      mediaRecorderRef.current = new MediaRecorder(mediaStream)
      chunksRef.current = []
      const startTime = Date.now()

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const endTime = Date.now()
        const duration = (endTime - startTime) / 1000 // Convert to seconds

        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(blob)
        const newRecording: Recording = {
          id: Date.now().toString(),
          title: `Recording ${recordings.length + 1}`,
          timestamp: new Date(),
          duration: duration,
          transcript: "Transcribing...",
          audioUrl,
          fileSize: blob.size,
          format: "WebM",
          isTranscribing: true,
          isGeneratingContent: false,
          mode: selectedMode,
          generatedContent: "Generating content...",
        }
        setRecordings((prev) => [newRecording, ...prev])
        setSelectedRecording(newRecording)
        toast.success("Recording saved!")

        // Automatically start transcription
        await transcribeAudio(newRecording)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      toast.error("Could not access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      for (const track of mediaRecorderRef.current.stream.getTracks()) {
        track.stop()
      }
      setStream(null)
    }
  }

  const togglePlayback = () => {
    if (!selectedRecording || !audioPlayerRef.current) return

    if (isPlaying) {
      audioPlayerRef.current.pause()
    } else {
      audioPlayerRef.current.src = selectedRecording.audioUrl
      audioPlayerRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((rec) => rec.id !== id))
    if (selectedRecording?.id === id) {
      setSelectedRecording(null)
    }
    toast.success("Recording deleted")
  }

  const copyTranscript = () => {
    if (selectedRecording && selectedRecording.transcript !== "Click to transcribe") {
      navigator.clipboard.writeText(selectedRecording.transcript)
      setIsCopied(true)
      toast.success("Transcript copied to clipboard")
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  // We'll use this function when we display file size information
  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return "0 Bytes"
  //   const k = 1024
  //   const sizes = ["Bytes", "KB", "MB"]
  //   const i = Math.floor(Math.log(bytes) / Math.log(k))
  //   return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`
  // }

  const filteredRecordings = recordings.filter((rec) => rec.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-950 to-slate-900">
      <audio ref={audioPlayerRef} onEnded={() => setIsPlaying(false)}>
        <track kind="captions" />
      </audio>

      {/* Navigation Bar */}
      <nav className="flex h-16 items-center justify-between border-b border-slate-800 px-4 bg-slate-900">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full p-2 bg-slate-800 text-white md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="text-xl font-bold text-white">
            Whisper<span className="text-white/80">.dev</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button type="button" className="bg-slate-800 text-white text-sm px-3 py-1 rounded hidden">New Recording</button>
          <button type="button" className="bg-slate-800 text-white text-sm px-3 py-1 rounded hidden">Settings</button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-slate-900 w-full border-r border-slate-800 md:w-72 ${isSidebarOpen ? "fixed inset-0 z-40 pt-16" : "hidden md:block"}`}
        >
          {isSidebarOpen && (
            <button
              type="button"
              className="absolute top-4 right-4 rounded-full p-2 bg-slate-800 text-white md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          )}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              <Input
                ref={searchInputRef}
                placeholder="Search recordings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 text-sm text-white placeholder:text-slate-400 bg-slate-800 border-slate-700 focus:border-slate-600 focus:ring-slate-600"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-px p-2">
              {filteredRecordings.map((recording) => (
                <button
                  key={recording.id}
                  onClick={() => setSelectedRecording(recording)}
                  type="button"
                  className={`w-full rounded-lg p-3 text-left transition-all ${
                    selectedRecording?.id === recording.id ? "bg-slate-800 text-white" : "text-white hover:bg-slate-800/50"
                  }`}
                >
                  <div className="text-sm font-medium text-white">{recording.title}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{format(recording.timestamp, "MMM d, h:mm a")}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            {selectedRecording ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedRecording.title}</h2>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full mt-1">
                      {selectedRecording.mode}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-slate-800 text-white hover:bg-slate-700"
                    onClick={() => deleteRecording(selectedRecording.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-4 shadow-lg">
                  <AudioPlayer
                    audioUrl={selectedRecording.audioUrl}
                    initialDuration={selectedRecording.duration}
                    onPlayingChange={setIsPlaying}
                  />
                  {selectedRecording.isTranscribing ? (
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Transcribing audio...</span>
                    </div>
                  ) : (
                    <Tabs defaultValue="transcript" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                        <TabsTrigger value="content">Generated Content</TabsTrigger>
                      </TabsList>
                      <TabsContent value="transcript" className="mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-white leading-relaxed flex-grow">
                              {selectedRecording.transcript}
                            </p>
                            <Button className="bg-slate-800 text-white hover:bg-slate-700 text-xs px-2 py-1 ml-4 flex-shrink-0" onClick={copyTranscript}>
                              {isCopied ? (
                                <>
                                  <Check className="mr-1 h-3 w-3" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-1 h-3 w-3" /> Copy
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="content" className="mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            {selectedRecording.isGeneratingContent ? (
                              <div className="flex items-center gap-2 text-sm text-white">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Generating content...</span>
                              </div>
                            ) : (
                              <>
                                <div className="flex-grow">
                                  <MarkdownContent content={selectedRecording.generatedContent} />
                                </div>
                                <Button
                                  className="bg-slate-800 text-white hover:bg-slate-700 text-xs px-2 py-1 ml-4 flex-shrink-0"
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedRecording.generatedContent)
                                    toast.success("Generated content copied to clipboard")
                                  }}
                                >
                                  <Copy className="mr-1 h-3 w-3" /> Copy
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <div className="text-center">
                  <img src="https://placehold.co/400x200/1e293b/FFFFFF?text=Whisper.dev" alt="Placeholder" className="mx-auto mb-4 rounded shadow-lg" />
                  Select a recording or start a new one
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-slate-900 border-t border-slate-800 fixed bottom-0 left-0 right-0 z-30">
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Select
                value={selectedMode}
                onValueChange={(value) => setSelectedMode(value as RecordingMode)}
              >
                <SelectTrigger className="w-[180px] bg-slate-800 text-white border-slate-700">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Default" className="text-white focus:bg-slate-700 focus:text-white">
                    Default
                  </SelectItem>
                  <SelectItem value="Todo" className="text-white focus:bg-slate-700 focus:text-white">
                    Todo
                  </SelectItem>
                  <SelectItem value="Meeting" className="text-white focus:bg-slate-700 focus:text-white">
                    Meeting
                  </SelectItem>
                  <SelectItem value="Architect" className="text-white focus:bg-slate-700 focus:text-white">
                    Architect
                  </SelectItem>
                  <SelectItem value="Code" className="text-white focus:bg-slate-700 focus:text-white">
                    Code
                  </SelectItem>
                  <SelectItem value="Brainstorm" className="text-white focus:bg-slate-700 focus:text-white">
                    Brainstorm
                  </SelectItem>
                  <SelectItem value="Blog" className="text-white focus:bg-slate-700 focus:text-white">
                    Blog
                  </SelectItem>
                  <SelectItem value="Tweet" className="text-white focus:bg-slate-700 focus:text-white">
                    Tweet
                  </SelectItem>
                  <SelectItem value="Thread" className="text-white focus:bg-slate-700 focus:text-white">
                    Thread
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                className={`w-full md:w-auto bg-slate-800 text-white hover:bg-slate-700 ${isRecording ? "bg-red-600 hover:bg-red-500" : ""}`}
                size="default"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <>
                    <Square className="mr-2 h-4 w-4" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" /> Start Recording
                  </>
                )}
              </Button>
            </div>
            <span className="text-xs text-slate-400">Press &apos;W&apos; to {isRecording ? "stop" : "start"} recording</span>
          </div>
          {isRecording && (
            <div className="p-4 border-t border-slate-800">
              <div className="max-w-7xl mx-auto space-y-2">
                <AudioVisualizer stream={stream} isRecording={isRecording} />
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50 animate-pulse" />
                    <RecordingTimer isRecording={isRecording} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

