"use client";

import React from "react";
import { toast } from "sonner";
import { ArchiveRestore } from "lucide-react";
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

interface UnarchiveFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string | null;
  formTitle: string;
  onComplete: () => void;
}

export function UnarchiveFormDialog({
  open,
  onOpenChange,
  formId,
  formTitle,
  onComplete,
}: UnarchiveFormDialogProps) {
  const router = useRouter();
  const [isUnarchiving, setIsUnarchiving] = React.useState(false);

  const handleUnarchiveConfirm = async () => {
    if (!formId) return;

    setIsUnarchiving(true);

    try {
      const response = await fetch(`/api/forms/${formId}/unarchive`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to unarchive form");
      }

      toast.success("Form restored successfully!");
      onComplete();
      router.refresh();
    } catch (error) {
      console.error("Failed to restore form:", error);
      toast.error("Failed to restore form. Please try again.");
    } finally {
      setIsUnarchiving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ArchiveRestore className="h-5 w-5 text-primary" />
            </div>
            <AlertDialogTitle>Restore Form</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-3">
            Are you sure you want to restore{" "}
            <span className="font-semibold">{formTitle}</span>? The form will be
            moved back to your active forms list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUnarchiving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnarchiveConfirm}
            disabled={isUnarchiving}
            className="bg-primary hover:bg-primary/90"
          >
            {isUnarchiving ? "Restoring..." : "Restore Form"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
