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

    // Ensure user exists
    const user = await DatabaseService.createOrUpdateUser(userId, {});

    // Get archived forms
    const forms = await DatabaseService.getUserForms(user.id, true); // true for archived

    // Transform to match frontend expectations
    const transformedForms = forms.map(
      (form: {
        id: string;
        title: string;
        description: string | null;
        slug: string;
        isPublished: boolean;
        isArchived: boolean;
        createdAt: Date;
        updatedAt: Date;
        archivedAt: Date | null;
      }) => ({
        _id: form.id,
        title: form.title,
        description: form.description,
        slug: form.slug,
        isPublished: form.isPublished,
        isArchived: form.isArchived,
        createdAt: form.createdAt.toISOString(),
        updatedAt: form.updatedAt.toISOString(),
        publishedAt: form.publishedAt?.toISOString(),
        _count: {
          responses: 0, // Placeholder
        },
      })
    );

    return NextResponse.json(transformedForms);
  } catch (error) {
    console.error("Error fetching archived forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch archived forms. Please try again later." },
      { status: 500 }
    );
  }
}
