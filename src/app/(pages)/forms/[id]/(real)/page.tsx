import { Metadata } from "next";
import { DatabaseService } from "@/lib/db-service";
import FullscreenFormRenderer from "@/components/forms/public/fullscreen-form-renderer";
import { BlankPage } from "@/components/fallbacks/blank-page";

interface FormPageProps {
  params: Promise<{
    id: string;
  }>;
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

    return (
      <FullscreenFormRenderer
        form={form}
        formFields={form.questions}
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
