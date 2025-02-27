import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { schemaMap, SchemaType } from "@/utils/schemas"
import { openai } from "@ai-sdk/openai"
import fs from "fs/promises"
import path from "path"

let USER_SUFFIX: string | null = null

async function getUserSuffix(): Promise<string> {
  if (USER_SUFFIX === null) {
    const suffixPath = path.join(process.cwd(), "prompts", "user_suffix.md")
    USER_SUFFIX = await fs.readFile(suffixPath, "utf-8")
  }
  return USER_SUFFIX
}

export async function POST(request: Request) {
  try {
    const { transcript, mode } = await request.json()

    if (!transcript || !mode) {
      return NextResponse.json({ error: "Transcript and mode are required" }, { status: 400 })
    }

    const schema = schemaMap[mode as keyof typeof schemaMap] || schemaMap.Default
    const prompt = await getPromptForMode(mode, transcript)
    const userSuffix = await getUserSuffix()

    try {
      const { object: generatedContent } = await generateObject({
        model: openai("gpt-4o"),
        schema,
        prompt: prompt + "\n\n" + userSuffix,
      })

      // Format the content for display
      const formattedContent = formatContentForDisplay(mode, generatedContent)

      return NextResponse.json({ content: formattedContent })
    } catch (error) {
      console.error("OpenAI API error:", error)
      return NextResponse.json(
        { error: "Failed to generate content", details: error instanceof Error ? error.message : String(error) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

async function getPromptForMode(mode: string, transcript: string): Promise<string> {
  const promptFileName = `${mode.toLowerCase()}.md`
  const promptPath = path.join(process.cwd(), "prompts", promptFileName)

  try {
    const promptTemplate = await fs.readFile(promptPath, "utf-8")
    return promptTemplate.replace("{{transcript}}", transcript)
  } catch (error) {
    console.error(`Error reading prompt file for mode ${mode}:`, error)
    // Fallback to default prompt if file not found or other error occurs
    const defaultPromptPath = path.join(process.cwd(), "prompts", "default.md")
    const defaultPromptTemplate = await fs.readFile(defaultPromptPath, "utf-8")
    return defaultPromptTemplate.replace("{{transcript}}", transcript)
  }
}

function formatContentForDisplay(mode: string, content: any): string {
  switch (mode) {
    case "Todo":
      return formatTodoContent(content)
    case "Meeting":
      return formatMeetingContent(content)
    case "Architect":
      return formatArchitectContent(content)
    case "Code":
      return formatCodeContent(content)
    case "Brainstorm":
      return formatBrainstormContent(content)
    case "Blog":
      return formatBlogContent(content)
    case "Tweet":
      return formatTweetContent(content)
    case "Thread":
      return formatThreadContent(content)
    default:
      return formatDefaultContent(content)
  }
}

function formatTodoContent(content: any): string {
  return `📋 Todo List\n\n${content.summary}\n\n${content.tasks
    .map((task: any) => `• [${task.priority.toUpperCase()}] ${task.task}${task.category ? ` (${task.category})` : ""}`)
    .join("\n")}\n\n🔑 Key Points:\n${content.keyPoints.map((point: string) => `• ${point}`).join("\n")}`
}

function formatMeetingContent(content: any): string {
  return `📅 Meeting Summary: ${content.title}\n\n${content.summary}\n\n⚡ Action Items:\n${content.actionItems
    .map((item: any) => `• ${item.item}${item.assignee ? ` (Assignee: ${item.assignee})` : ""}`)
    .join("\n")}\n\n🎯 Decisions Made:\n${content.decisions
    .map((decision: string) => `• ${decision}`)
    .join("\n")}\n\n🔑 Key Points:\n${content.keyPoints.map((point: string) => `• ${point}`).join("\n")}`
}

function formatArchitectContent(content: any): string {
  return `🏗️ Architecture Analysis\n\n${content.summary}\n\n📊 Current System:\n${content.currentSystem.components
    .map((component: string) => `• ${component}`)
    .join("\n")}\n\n❗ Challenges:\n${content.currentSystem.challenges
    .map((challenge: string) => `• ${challenge}`)
    .join("\n")}\n\n💡 Recommendations:\n${content.recommendations
    .map((rec: any) => `• [${rec.impact.toUpperCase()}] ${rec.title}: ${rec.description}`)
    .join("\n")}\n\n🔑 Key Points:\n${content.keyPoints.map((point: string) => `• ${point}`).join("\n")}`
}

function formatCodeContent(content: any): string {
  return `💻 Code Analysis\n\n${content.summary}\n\nLanguage: ${
    content.codeAnalysis.language
  }\n\n🔍 Patterns:\n${content.codeAnalysis.patterns
    .map((pattern: string) => `• ${pattern}`)
    .join("\n")}\n\n⚠️ Issues:\n${content.codeAnalysis.issues
    .map((issue: any) => `• [${issue.severity.toUpperCase()}] ${issue.type}: ${issue.description}`)
    .join("\n")}\n\n💡 Improvements:\n${content.improvements
    .map((imp: any) => `• ${imp.suggestion}\n  Benefit: ${imp.benefit}`)
    .join("\n")}\n\n🔑 Key Points:\n${content.keyPoints.map((point: string) => `• ${point}`).join("\n")}`
}

function formatBrainstormContent(content: any): string {
  return `🧠 Brainstorm: ${content.topic}\n\n${content.summary}\n\n💡 Ideas:\n${content.ideas
    .map((idea: any) => `• [${idea.potential.toUpperCase()}] ${idea.title}: ${idea.description}`)
    .join("\n")}\n\n⏭️ Next Steps:\n${content.nextSteps
    .map((step: string) => `• ${step}`)
    .join("\n")}\n\n🔑 Key Points:\n${content.keyPoints.map((point: string) => `• ${point}`).join("\n")}`
}
function formatBlogContent(content: SchemaType<"Blog">): string {
  return `📝 Blog Post: ${content.title}\n\n${content.summary}\n\n${content.blogContent}\n\n🔑 Key Points:\n${content.keyPoints
    .map((point: string) => `• ${point}`)
    .join("\n")}`
}

function formatTweetContent(content: any): string {
  return `🐦 Tweet\n\n${content.tweet}\n\n#️⃣ ${content.hashtags.join(" ")}\n\n📝 Summary:\n${
    content.summary
  }\n\n🔑 Key Points:\n${content.keyPoints.map((point: string) => `• ${point}`).join("\n")}`
}

function formatThreadContent(content: any): string {
  return `🧵 Thread\n\n${content.tweets
    .map((tweet: any) => `${tweet.position}/${content.tweets.length}: ${tweet.content}`)
    .join("\n\n")}\n\n#️⃣ ${content.hashtags.join(" ")}\n\n📝 Summary:\n${
    content.summary
  }\n\n🔑 Key Points:\n${content.keyPoints.map((point: string) => `• ${point}`).join("\n")}`
}

function formatDefaultContent(content: any): string {
  return `📝 Summary\n\n${content.summary}\n\n🔑 Key Points:\n${content.keyPoints
    .map((point: string) => `• ${point}`)
    .join("\n")}`
}

