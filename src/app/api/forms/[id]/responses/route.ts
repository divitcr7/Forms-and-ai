import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db-service";
import { SimpleDbService } from "@/lib/simple-db-service";

// Use simple storage in production for reliability
const DbService = process.env.NODE_ENV === 'production' ? SimpleDbService : DatabaseService;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get the form to check ownership
    const form = await DbService.getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get the user to check ownership
    const user = await DbService.createOrUpdateUser(userId, {});

    if (form.userId !== user.id) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: "You don't have access to this form's responses",
        },
        { status: 403 }
      );
    }

    // Get responses
    const responses = await DbService.getFormResponses(form.id);

    // Transform responses to match frontend expectations
    const transformedResponses = responses.map((response: any) => ({
      _id: response.id,
      formId: form.id,
      respondentEmail: "Anonymous", // We're not collecting emails in the new system
      submittedAt: response.submittedAt instanceof Date ? response.submittedAt.toISOString() : response.submittedAt,
      answers: (response.answers || []).map((answer: any) => ({
        questionId: answer.questionId,
        value: answer.value,
        question: answer.question || { content: "Question" },
      })),
      ipAddress: response.ipAddress,
      userAgent: response.userAgent,
    }));

    // Get analytics data
    const analytics = {
      completionRate: 100, // All submitted responses are complete
      responseRate: "1m 30s", // Placeholder - would need to calculate from actual data
      totalResponses: responses.length,
    };

    return NextResponse.json({
      responses: transformedResponses,
      analytics,
    });
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch responses. Please try again later." },
      { status: 500 }
    );
  }
}
