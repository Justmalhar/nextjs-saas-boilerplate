import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("Transcription API route called")
  try {
    const formData = await request.formData()
    const file = formData.get("audio") as Blob

    if (!file) {
      console.error("No audio file provided")
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("Audio file received, size:", file.size)
    const buffer = Buffer.from(await file.arrayBuffer())

    console.log("Sending request to Deepgram API...")
    const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/wav",
      },
      body: buffer,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Deepgram API error:", error)
      return NextResponse.json({ error: "Failed to transcribe audio", details: error }, { status: response.status })
    }

    console.log("Deepgram API response received")
    const result = await response.json()

    console.log("Transcription result:", result.results?.channels[0]?.alternatives[0]?.transcript)
    return NextResponse.json({
      transcript: result.results?.channels[0]?.alternatives[0]?.transcript || "",
      words: result.results?.channels[0]?.alternatives[0]?.words || [],
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

