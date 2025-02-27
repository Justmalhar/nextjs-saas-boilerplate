import { z } from "zod"

// Base schema for common fields
const baseContentSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
})

// Todo Schema
export const todoSchema = baseContentSchema.extend({
  tasks: z.array(
    z.object({
      task: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      category: z.string().optional(),
    }),
  ),
  dueDate: z.string().optional(),
})

// Meeting Schema
export const meetingSchema = baseContentSchema.extend({
  title: z.string(),
  participants: z.array(z.string()).optional(),
  actionItems: z.array(
    z.object({
      item: z.string(),
      assignee: z.string().optional(),
      deadline: z.string().optional(),
    }),
  ),
  decisions: z.array(z.string()),
})

// Architecture Schema
export const architectSchema = z.object({
  currentSystem: z.object({
    components: z.array(z.string()),
    challenges: z.array(z.string()),
  }),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      impact: z.enum(["high", "medium", "low"]),
    }),
  ),
  ...baseContentSchema.shape,
})

// Code Schema
export const codeSchema = z.object({
  codeAnalysis: z.object({
    language: z.string(),
    patterns: z.array(z.string()),
    issues: z.array(
      z.object({
        type: z.string(),
        description: z.string(),
        severity: z.enum(["critical", "warning", "info"]),
      }),
    ),
  }),
  improvements: z.array(
    z.object({
      suggestion: z.string(),
      benefit: z.string(),
    }),
  ),
  ...baseContentSchema.shape,
})

// Brainstorm Schema
export const brainstormSchema = z.object({
  topic: z.string(),
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      potential: z.enum(["high", "medium", "low"]),
    }),
  ),
  nextSteps: z.array(z.string()),
  ...baseContentSchema.shape,
})

// Blog Schema
export const blogSchema = z.object({
  title: z.string(),
  blogContent: z.string(),
  ...baseContentSchema.shape,
})

// Tweet Schema
export const tweetSchema = z.object({
  tweet: z.string().max(280),
  hashtags: z.array(z.string()),
  ...baseContentSchema.shape,
})

// Thread Schema
export const threadSchema = z.object({
  tweets: z.array(
    z.object({
      content: z.string().max(280),
      position: z.number(),
    }),
  ),
  hashtags: z.array(z.string()),
  ...baseContentSchema.shape,
})

// Default Schema
export const defaultSchema = baseContentSchema

// Schema type map
export const schemaMap = {
  Todo: todoSchema,
  Meeting: meetingSchema,
  Architect: architectSchema,
  Code: codeSchema,
  Brainstorm: brainstormSchema,
  Blog: blogSchema,
  Tweet: tweetSchema,
  Thread: threadSchema,
  Default: baseContentSchema,
} as const

// Type helper for getting schema type
export type SchemaType<T extends keyof typeof schemaMap> = z.infer<(typeof schemaMap)[T]>

