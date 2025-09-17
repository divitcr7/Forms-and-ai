import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { DatabaseService } from "@/lib/db-service";

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

    // Get the form to check ownership
    const form = await DatabaseService.getFormByIdOrSlug(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get the user to check ownership
    const user = await DatabaseService.createOrUpdateUser(userId, {});

    if (form.userId !== user.id) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: "You don't have access to this form",
        },
        { status: 403 }
      );
    }

    // Archive the form
    await DatabaseService.archiveForm(id);

    return NextResponse.json({
      message: "Form archived successfully",
    });
  } catch (error) {
    console.error("Error archiving form:", error);
    return NextResponse.json(
      { error: "Failed to archive form. Please try again later." },
      { status: 500 }
    );
  }
}
