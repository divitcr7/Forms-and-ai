import { DatabaseService } from "@/lib/db-service";
import { notFound } from "next/navigation";
import PublicFormRenderer from "@/components/forms/public/public-form-renderer";

interface Props {
  params: {
    slug: string;
  };
}

export default async function PublicFormPage({ params }: Props) {
  const { slug } = params;

  const form = await DatabaseService.getFormBySlug(slug);

  if (!form) {
    notFound();
  }

  if (!form.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Form Not Available
          </h1>
          <p className="text-gray-600">
            This form is not currently published.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-lg text-gray-600">
                {form.description}
              </p>
            )}
          </div>

          <PublicFormRenderer form={form} />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params;
  const form = await DatabaseService.getFormBySlug(slug);

  if (!form) {
    return {
      title: "Form Not Found",
    };
  }

  return {
    title: form.title,
    description: form.description || `Fill out the ${form.title} form`,
  };
}
