import { Metadata } from "next";
import { DatabaseService } from "@/lib/db-service";
import FullscreenFormRenderer from "@/components/forms/public/fullscreen-form-renderer";
import { BlankPage } from "@/components/fallbacks/blank-page";

interface FormPreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: FormPreviewPageProps): Promise<Metadata> {
  try {
    const formId = (await params).id;
    const form = await DatabaseService.getFormByIdOrSlug(formId);

    if (!form) {
      return {
        title: "Form Not Found",
      };
    }

    return {
      title: `Preview: ${form.title} | Form Axis`,
      description: `Preview mode for ${form.title}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Form Preview | Form Axis",
      description: "Preview this form",
    };
  }
}

export default async function FormPreviewPage({
  params,
}: FormPreviewPageProps) {
  const formId = (await params).id;

  try {
    const form = await DatabaseService.getFormByIdOrSlug(formId);

    if (!form) {
      return (
        <BlankPage
          title="Form Not Found"
          description="This form either doesn't exist or hasn't been published yet."
          errorType="not-found"
        />
      );
    }

    // Transform the form data to match the expected format
    const transformedForm = {
      _id: form.id,
      title: form.title,
      description: form.description,
      slug: form.slug,
      status: form.isPublished ? "published" : "draft",
      isPublished: form.isPublished,
      createdAt: form.createdAt.toISOString(),
    };

    // Transform questions to match the expected format
    const transformedQuestions = form.questions.map(q => ({
      _id: q.id,
      content: q.content,
      label: q.content, // Some components might expect label
      type: q.type,
      required: q.required,
      order: q.order,
      placeholder: "Enter your answer",
    }));

    return (
      <FullscreenFormRenderer
        form={transformedForm as any}
        formFields={transformedQuestions as any}
        isPreview={true}
      />
    );
  } catch (error) {
    console.error("Error loading form:", error);
    return (
      <BlankPage
        title="Error Loading Form"
        errorType="error"
        description="An error occurred while loading the form. Please try again later."
      />
    );
  }
}
