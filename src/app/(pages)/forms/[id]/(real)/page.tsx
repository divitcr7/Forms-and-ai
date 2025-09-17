import { Metadata } from "next";
import { DatabaseService } from "@/lib/db-service";
import FullscreenFormRenderer from "@/components/forms/public/fullscreen-form-renderer";
import { BlankPage } from "@/components/fallbacks/blank-page";

interface FormPageProps {
  params: Promise<{
    id: string;
  }>;
}

function mapFieldType(dbType: string): string {
  const typeMap: Record<string, string> = {
    TEXT: "shortText",
    EMAIL: "email",
    NUMBER: "number",
    TEXTAREA: "longText",
    SELECT: "select",
    RADIO: "radio",
    CHECKBOX: "checkbox",
    DATE: "calendar",
    TIME: "time",
    URL: "url",
    PHONE: "phone",
  };
  return typeMap[dbType] || "shortText";
}

export async function generateMetadata({
  params,
}: FormPageProps): Promise<Metadata> {
  try {
    const formId = (await params).id;
    const form = await DatabaseService.getFormByIdOrSlug(formId);

    if (!form) {
      return {
        title: "Form Not Found",
      };
    }

    const title = form.title || "Preview Form";

    return {
      title,
      description: form.description || "Complete this form",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Form Axis",
      description: "Complete this form",
    };
  }
}

export default async function FormPage({ params }: FormPageProps) {
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

    if (!form.isPublished) {
      return (
        <BlankPage
          title="Form Not Available"
          description="This form is not currently published."
          errorType="not-found"
        />
      );
    }

    // Transform the form data to match the expected format
    const transformedForm = {
      _id: form.id,
      title: form.title,
      description: form.description || undefined,
      slug: form.slug,
      status: form.isPublished ? "published" : "draft",
      isPublished: form.isPublished,
      isArchived: form.isArchived,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      publishedAt: form.publishedAt?.toISOString(),
    };

    // Transform questions to match the expected format
    const transformedQuestions = form.questions.map((q) => ({
      _id: q.id,
      content: q.content,
      label: q.content, // Some components might expect label
      type: mapFieldType(q.type) as any,
      required: q.required,
      order: q.order,
      placeholder: "Enter your answer",
    }));

    return (
      <FullscreenFormRenderer
        form={transformedForm}
        formFields={transformedQuestions}
        isPreview={false}
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
