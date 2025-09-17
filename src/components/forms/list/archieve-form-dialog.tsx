"use client";

import React from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ArchiveFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string | null;
  formTitle: string;
  onComplete: () => void;
}

export function ArchiveFormDialog({
  open,
  onOpenChange,
  formId,
  formTitle,
  onComplete,
}: ArchiveFormDialogProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = React.useState(false);

  const handleArchiveConfirm = async () => {
    if (!formId) return;

    setIsArchiving(true);

    try {
      const response = await fetch(`/api/forms/${formId}/archive`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to archive form");
      }

      toast.success("Form archived successfully!");
      onComplete();
      router.refresh();
    } catch (error) {
      console.error("Failed to archive form:", error);
      toast.error("Failed to archive form. Please try again.");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Archive Form</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-3">
            Are you sure you want to archive{" "}
            <span className="font-semibold">{formTitle}</span>? This form will
            be moved to your archive and will no longer be accessible via the
            public link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchiveConfirm}
            disabled={isArchiving}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isArchiving ? "Archiving..." : "Archive Form"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
