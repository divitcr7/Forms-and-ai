import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db-service";
import { z } from "zod";

const saveFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z.array(z.object({
    content: z.string(),
    type: z.string(),
    required: z.boolean(),
  })),
  originalPrompt: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validationResult = saveFormSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      return NextResponse.json(
        { error: "Invalid request", details: errors },
        { status: 400 }
      );
    }

    // Ensure user exists in database
    await DatabaseService.createOrUpdateUser(userId, {});

    // Create the form
    const form = await DatabaseService.createForm(userId, validationResult.data);

    return NextResponse.json({
      formId: form.id,
      slug: form.slug,
      message: "Form created successfully",
    });
  } catch (error) {
    console.error("Error saving form:", error);
    return NextResponse.json(
      { error: "Failed to save form. Please try again later." },
      { status: 500 }
    );
  }
}
