"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FormTableHeader } from "./form-table-header";
import { FormDataTable } from "./form-data-table";
import { ArchiveFormDialog } from "./archieve-form-dialog";

interface Form {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  _count: {
    responses: number;
  };
  questions: any[];
}

export function FormsTable() {
  const [forms, setForms] = React.useState<Form[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const [formToArchive, setFormToArchive] = React.useState<string | null>(null);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = React.useState(false);

  console.log(
    "FormsTable component rendered, forms:",
    forms.length,
    "loading:",
    loading
  );

  const navigateToFormEditPage = (formId: string) => {
    router.push(`/dashboard/forms/${formId}`);
  };

  const handleArchiveRequest = (formId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when attempting to archive
    setFormToArchive(formId);
    setIsArchiveDialogOpen(true);
  };

  const handleArchiveComplete = () => {
    setFormToArchive(null);
    setIsArchiveDialogOpen(false);
    // Refresh forms list after archiving
    fetchForms();
  };

  const fetchForms = React.useCallback(async () => {
    try {
      console.log("Fetching forms from API...");
      const response = await fetch("/api/forms/list");
      console.log("Forms API response:", response.status, response.statusText);

      if (response.ok) {
        const formsData = await response.json();
        console.log("Forms data received:", formsData);
        setForms(formsData);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch forms:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  }, []);

  // Move the effect to use the callback
  React.useEffect(() => {
    const loadForms = async () => {
      setLoading(true);
      await fetchForms();
      setLoading(false);
    };
    loadForms();
  }, [fetchForms]);

  const formToArchiveTitle = formToArchive
    ? forms.find((form) => form._id === formToArchive)?.title || "this form"
    : "this form";

  if (loading) {
    return (
      <div className="space-y-4">
        <FormTableHeader />
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">
            Loading forms... (Component is working)
          </div>
        </div>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="space-y-4">
        <FormTableHeader />
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">
            No forms found. (API returned empty array)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormTableHeader />

      <FormDataTable
        forms={forms}
        onRowClick={navigateToFormEditPage}
        onArchiveRequest={handleArchiveRequest}
      />

      <ArchiveFormDialog
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
        formId={formToArchive}
        formTitle={formToArchiveTitle}
        onComplete={handleArchiveComplete}
      />
    </div>
  );
}
