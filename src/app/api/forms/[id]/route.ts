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

    // Get form by ID or slug
    const form = await DbService.getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user owns this form
    const user = await DbService.createOrUpdateUser(userId, {});
    if (form.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden", details: "You don't have access to this form" },
        { status: 403 }
      );
    }

    // Transform the data to match expected format
    const transformedForm = {
      _id: form.id,
      title: form.title,
      description: form.description,
      slug: form.slug,
      status: form.isPublished ? "published" : "draft",
      isPublished: form.isPublished,
      isArchived: form.isArchived,
      createdAt: form.createdAt instanceof Date ? form.createdAt.toISOString() : form.createdAt,
      updatedAt: form.updatedAt instanceof Date ? form.updatedAt.toISOString() : form.updatedAt,
      publishedAt: (form as any).publishedAt instanceof Date ? (form as any).publishedAt.toISOString() : (form as any).publishedAt || null,
      questions: (form.questions || []).map((q: any) => ({
        _id: q.id,
        content: q.content,
        type: q.type,
        required: q.required,
        order: q.order,
        options: q.options || null,
      })),
      _count: {
        responses: 0, // We'll add this later when we implement response counting
      },
    };

    return NextResponse.json(transformedForm);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form. Please try again later." },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body = await req.json();

    // Get form by ID or slug
    const form = await DbService.getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user owns this form
    const user = await DbService.createOrUpdateUser(userId, {});
    if (form.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden", details: "You don't have access to this form" },
        { status: 403 }
      );
    }

    // Handle publishing/unpublishing
    if (body.status) {
      const isPublished = body.status === "published";

      if (isPublished) {
        await DbService.publishForm(form.id);
      } else {
        // For unpublishing, we'll add a method to DbService
        await DbService.unpublishForm(form.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Form ${body.status === "published" ? "published" : "unpublished"} successfully`,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Failed to update form. Please try again later." },
      { status: 500 }
    );
  }
}
