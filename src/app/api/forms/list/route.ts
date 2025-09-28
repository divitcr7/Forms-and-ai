import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db-service";
import { SimpleDbService } from "@/lib/simple-db-service";

// Use simple storage in production for reliability
const DbService = process.env.NODE_ENV === 'production' ? SimpleDbService : DatabaseService;

export async function GET(req: NextRequest) {
  try {
    console.log("Forms list API called");
    const { userId } = getAuth(req);
    console.log("Auth userId:", userId);

    if (!userId) {
      console.log("No userId found - user not authenticated");
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    console.log("Creating/updating user:", userId);
    const user = await DbService.createOrUpdateUser(userId, {});
    console.log("User found/created:", user);

    // Get user's forms
    console.log("Fetching forms for user:", user.id);
    const forms = await DbService.getUserForms(user.id);
    console.log("Forms found:", forms.length);

    // Transform the data to match the expected format
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
        publishedAt: Date | null;
        _count?: { responses: number };
        questions?: any[];
      }) => ({
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
          responses: form._count?.responses || 0,
        },
        questions: form.questions || [],
      })
    );

    return NextResponse.json(transformedForms);
  } catch (error) {
    console.error("Error fetching user forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms. Please try again later." },
      { status: 500 }
    );
  }
}
