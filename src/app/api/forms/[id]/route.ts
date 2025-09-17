import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db-service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get form by ID or slug
    const form = await DatabaseService.getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user owns this form
    const user = await DatabaseService.createOrUpdateUser(userId, {});
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
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      publishedAt: form.publishedAt?.toISOString(),
      questions: form.questions.map((q) => ({
        _id: q.id,
        content: q.content,
        type: q.type as any,
        required: q.required,
        order: q.order,
        options: q.options,
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
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();

    // Get form by ID or slug
    const form = await DatabaseService.getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user owns this form
    const user = await DatabaseService.createOrUpdateUser(userId, {});
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
        await DatabaseService.publishForm(form.id);
      } else {
        // For unpublishing, we'll add a method to DatabaseService
        await DatabaseService.unpublishForm(form.id);
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
