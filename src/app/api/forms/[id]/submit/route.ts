import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db-service";
import { z } from "zod";

const submitFormSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.string(),
    })
  ),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get form by ID (can be either form ID or slug)
    const form = await DatabaseService.getFormByIdOrSlug(id);
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.isPublished) {
      return NextResponse.json(
        { error: "Form is not published" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validationResult = submitFormSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      return NextResponse.json(
        { error: "Invalid request", details: errors },
        { status: 400 }
      );
    }

    // Get client metadata
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Create the response
    const response = await DatabaseService.createFormResponse(
      form.id,
      validationResult.data.answers,
      { ipAddress, userAgent }
    );

    return NextResponse.json({
      responseId: response.id,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}
