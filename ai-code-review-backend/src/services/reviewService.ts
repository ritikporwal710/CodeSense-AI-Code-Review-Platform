import OpenAI from "openai";
import { eq, desc } from "drizzle-orm";
import { db } from "../config/db";
import { codeReviews } from "../db/schema";
import logger from "../utils/logger";

// Using Groq's OpenAI-compatible API (free tier)
// Groq is faster than OpenAI and has a generous free tier
let groqClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return groqClient;
}

export interface ReviewFeedback {
  summary: string;
  overallScore: number; // 0–100
  issues: Array<{
    severity: "critical" | "major" | "minor" | "info";
    category: string;
    line?: number;
    title: string;
    description: string;
    suggestion: string;
  }>;
  strengths: string[];
  improvements: string[];
  optimizedCode: string; // Full rewritten version applying all fixes
}

const SYSTEM_PROMPT = `You are a senior software engineer conducting a thorough code review. 
Your role is to analyze the provided code and return structured, actionable feedback.

You MUST respond with valid JSON matching this exact structure:
{
  "summary": "Brief overall assessment (2-3 sentences)",
  "overallScore": <number 0-100>,
  "issues": [
    {
      "severity": "critical" | "major" | "minor" | "info",
      "category": "Security" | "Performance" | "Readability" | "Maintainability" | "Bug" | "Best Practice",
      "line": <optional line number>,
      "title": "Short issue title",
      "description": "What the problem is",
      "suggestion": "How to fix it with a concrete code example"
    }
  ],
  "strengths": ["What the code does well"],
  "improvements": ["High-level improvements to consider"],
  "optimizedCode": "<the complete rewritten code with ALL issues fixed, improvements applied, and best practices enforced>"
}

For optimizedCode:
- Rewrite the ENTIRE code file from scratch applying all fixes
- Preserve the original logic and functionality exactly
- Apply every issue fix, improvement, and best practice
- Add concise comments where helpful
- Make it production-ready

Be thorough, specific, and constructive. Act like a senior engineer mentoring a junior.`;

export const analyzeCode = async (
  userId: string,
  title: string,
  language: string,
  code: string,
) => {
  // Create a pending review record first
  const [review] = await db
    .insert(codeReviews)
    .values({ userId, title, language, code, status: "pending" })
    .returning();

  try {
    logger.info("Starting AI code review", { reviewId: review.id, language });

    const response = await getOpenAI().chat.completions.create({
      model: "llama-3.3-70b-versatile", // Groq free tier - excellent for code review
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Please review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const feedback: ReviewFeedback = JSON.parse(content);

    // Update the review record with results
    const [updated] = await db
      .update(codeReviews)
      .set({
        reviewFeedback: feedback,
        optimizedCode: feedback.optimizedCode ?? null,
        overallScore: feedback.overallScore,
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(codeReviews.id, review.id))
      .returning();

    logger.info("Code review completed", {
      reviewId: review.id,
      score: feedback.overallScore,
    });

    return updated;
  } catch (error) {
    // Mark as failed
    await db
      .update(codeReviews)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(codeReviews.id, review.id));

    logger.error("Code review failed", {
      reviewId: review.id,
      error: error instanceof Error ? error.message : "Unknown",
    });
    throw error;
  }
};

export const getReviewsByUser = async (userId: string) => {
  return db
    .select({
      id: codeReviews.id,
      title: codeReviews.title,
      language: codeReviews.language,
      overallScore: codeReviews.overallScore,
      status: codeReviews.status,
      createdAt: codeReviews.createdAt,
    })
    .from(codeReviews)
    .where(eq(codeReviews.userId, userId))
    .orderBy(desc(codeReviews.createdAt));
};

export const getReviewById = async (reviewId: string, userId: string) => {
  const result = await db
    .select()
    .from(codeReviews)
    .where(eq(codeReviews.id, reviewId))
    .limit(1);

  if (result.length === 0) return null;
  const review = result[0];

  // Ensure only owner can access
  if (review.userId !== userId) return null;

  return review;
};
