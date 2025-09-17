import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db-service";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    const user = await DatabaseService.createOrUpdateUser(userId, {});

    // Get user's forms
    const forms = await DatabaseService.getUserForms(user.id);

    // Transform the data to match the expected format
    const transformedForms = forms.map((form) => ({
      _id: form.id,
      title: form.title,
      description: form.description,
      slug: form.slug,
      isPublished: form.isPublished,
      isArchived: form.isArchived,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      publishedAt: form.publishedAt,
      _count: {
        responses: form._count.responses,
      },
      questions: form.questions,
    }));

    return NextResponse.json(transformedForms);
  } catch (error) {
    console.error("Error fetching user forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms. Please try again later." },
      { status: 500 }
    );
  }
}
