"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CopyIcon, Eye, Globe, GlobeLock } from "lucide-react";
import { toast } from "sonner";
import { FormTabs } from "@/components/forms/tabs/form-tabs";
import { PublishFormButton } from "@/components/forms/publish/publish-form-button";

interface Form {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  status: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  questions: any[];
}

export default function FormPage() {
  const router = useRouter();
  const formId = useParams().id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${formId}`);
        if (response.ok) {
          const formData = await response.json();
          setForm(formData);
        } else if (response.status === 404) {
          router.push("/dashboard/forms");
          toast.error("Form not found");
        } else {
          toast.error("Failed to load form");
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        toast.error("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, router]);

  if (loading) {
    return (
      <div className="py-8 px-4 space-y-8">
        <div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[600px] rounded-md" />
          <Skeleton className="h-[600px] rounded-md" />
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Form not found</h1>
          <p className="text-muted-foreground mt-2">
            This form doesn't exist or you don't have access to it.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/forms")}
          >
            Back to Forms
          </Button>
        </div>
      </div>
    );
  }

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Share link copied to clipboard!");
  };

  const handlePublishToggle = async () => {
    if (updating) return;

    try {
      setUpdating(true);
      const newStatus = form.status === "published" ? "draft" : "published";

      const response = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setForm((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                isPublished: newStatus === "published",
              }
            : null
        );
        toast.success(
          newStatus === "published"
            ? "Form published successfully! It's now accessible to the public."
            : "Form unpublished. It's now in draft mode."
        );
      } else {
        throw new Error("Failed to update form status");
      }
    } catch (error) {
      console.error("Error updating form status:", error);
      toast.error("Failed to update form status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const isPublished = form.status === "published";

  const openPreviewMode = () => {
    window.open(`/forms/${formId}/preview`, "_blank");
  };

  return (
    <div className="py-8 px-4 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/forms")}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forms
        </Button>

        <div className="flex flex-wrap gap-2">
          <PublishFormButton
            isPublished={isPublished}
            onPublishToggle={handlePublishToggle}
            disabled={updating}
          />

          <Button variant="outline" size="sm" onClick={copyShareLink}>
            <CopyIcon className="h-4 w-4 mr-2" />
            Copy Share Link
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openPreviewMode}
            className="text-orange-500 hover:text-orange-600"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{form.title}</h1>
          {isPublished ? (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-600 border-green-500/20 transition-colors">
              <Globe className="h-3 w-3 mr-1" />
              Published
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-600 border-amber-500/20 transition-colors">
              <GlobeLock className="h-3 w-3 mr-1" />
              Draft
            </div>
          )}
        </div>
        {form.description && (
          <p className="text-muted-foreground mt-2">{form.description}</p>
        )}
      </div>

      <FormTabs form={form} formFields={form.questions} formId={formId} />
    </div>
  );
}
