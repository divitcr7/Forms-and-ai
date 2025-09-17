"use client";

import * as React from "react";
import { ArchivedFormsHeader } from "./archived-forms-header";
import { ArchivedFormsDataTable } from "./archived-forms-data-table";
import { UnarchiveFormDialog } from "./unarchive-form-dialog";
import { Form } from "@/lib/types";

export function ArchivedFormsTable() {
  const [archivedForms, setArchivedForms] = React.useState<Form[]>([]);
  const [_loading, setLoading] = React.useState(true);
  const [formToUnarchive, setFormToUnarchive] = React.useState<string | null>(
    null
  );
  const [isUnarchiveDialogOpen, setIsUnarchiveDialogOpen] =
    React.useState(false);

  React.useEffect(() => {
    const fetchArchivedForms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/forms/archived");
        if (response.ok) {
          const data = await response.json();
          setArchivedForms(data);
        }
      } catch (error) {
        console.error("Error fetching archived forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchivedForms();
  }, []);

  const handleUnarchiveRequest = (formId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setFormToUnarchive(formId);
    setIsUnarchiveDialogOpen(true);
  };

  const handleUnarchiveComplete = () => {
    setFormToUnarchive(null);
    setIsUnarchiveDialogOpen(false);
  };

  // Find form title for the unarchive dialog
  const formToUnarchiveTitle = formToUnarchive
    ? archivedForms.find((form) => form._id === formToUnarchive)?.title ||
      "this form"
    : "this form";

  return (
    <div className="space-y-4">
      <ArchivedFormsHeader />

      <ArchivedFormsDataTable
        forms={archivedForms}
        onUnarchiveRequest={handleUnarchiveRequest}
      />

      <UnarchiveFormDialog
        open={isUnarchiveDialogOpen}
        onOpenChange={setIsUnarchiveDialogOpen}
        formId={formToUnarchive}
        formTitle={formToUnarchiveTitle}
        onComplete={handleUnarchiveComplete}
      />
    </div>
  );
}
