import { getFormGenPrompt } from "@/lib/prompts/form-gen-prompt";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { FormGeneration, formGenerationSchema } from "@/lib/schema";

/**
 * Generates form questions based on the provided prompt using Google's Gemini model
 * @param prompt
 * @param topics
 * @returns
 */
export async function generateFormQuestions(
  prompt: string,
  topics?: string
): Promise<FormGeneration> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Please don't forget to set your Google API key");
  }

  try {
    const formGenerationPrompt = getFormGenPrompt({
      prompt,
      topics,
    });

    let result;

    try {
      // Try the primary model first
      result = await generateObject({
        model: google("gemini-2.0-flash-lite-preview-02-05", {
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
        schema: formGenerationSchema,
        prompt: formGenerationPrompt,
        temperature: 0.7,
      });
    } catch (primaryError) {
      console.log(
        "Primary model failed, trying fallback model...",
        primaryError instanceof Error
          ? primaryError.message
          : String(primaryError)
      );

      // Fallback to a more stable model if the primary fails
      result = await generateObject({
        model: google("gemini-1.5-flash", {
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
        schema: formGenerationSchema,
        prompt: formGenerationPrompt,
        temperature: 0.7,
      });
    }

    const formData = result.object;

    return {
      title: formData.title,
      description: formData.description,
      questions: formData.questions.map(
        (q: { content: string; type: string; required: boolean }) => ({
          content: q.content,
          type: q.type as any,
          required: q.required,
        })
      ),
    };
  } catch (error) {
    console.error("Error generating form questions:", error);

    // Handle specific API errors
    if (error instanceof Error) {
      // Check for overload/rate limit errors
      if (
        error.message.includes("overloaded") ||
        error.message.includes("503")
      ) {
        throw new Error(
          "AI service is temporarily busy. Please wait a moment and try again."
        );
      }
      // Check for quota/billing errors
      if (
        error.message.includes("quota") ||
        error.message.includes("billing")
      ) {
        throw new Error(
          "AI service quota exceeded. Please try again later or contact support."
        );
      }
      // Check for API key errors
      if (
        error.message.includes("API key") ||
        error.message.includes("authentication")
      ) {
        throw new Error(
          "AI service configuration error. Please contact support."
        );
      }
    }

    throw new Error(
      "Failed to generate form questions. Please try again later."
    );
  }
}

/**
 * Utility function to shorten and sanitize a string for use as a URL slug
 * @param str - The string to convert to a slug
 * @returns A URL-friendly slug string
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50); // Limit length
}
