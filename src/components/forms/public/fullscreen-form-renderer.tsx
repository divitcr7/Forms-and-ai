"use client";

import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { FormPreviewChat } from "@/components/forms/playground/form-preview-chat";
import { Form, FormField } from "@/lib/types";
import { FormProgressBar } from "./form-progress-bar";

interface FullscreenFormRendererProps {
  form: Form;
  formFields: FormField[];
  isPreview?: boolean;
}

console.log("full screen form renderer");

export default function FullscreenFormRenderer({
  form,
  formFields,
  isPreview = false,
}: FullscreenFormRendererProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isPreview) {
      startTimeRef.current = new Date().toISOString();
    }
  }, [isPreview]);

  const handleFormSubmit = async (answers: Record<string, string>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setProgress(100);

    try {
      if (isPreview) {
        toast.success(
          "Preview mode: Form submission simulated. No data saved."
        );
        return;
      }

      const formattedAnswers = Object.entries(answers).map(
        ([fieldId, value]) => ({
          questionId: fieldId,
          value: value,
        })
      );

      // Submit to our API
      const response = await fetch(`/api/forms/${form._id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: formattedAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <FormProgressBar progress={progress} />
      </div>

      <div className="h-[calc(100vh-69px)] w-full flex pt-1">
        <div className="hidden lg:block lg:w-1/5"></div>

        <div className="w-full lg:w-3/5 h-full flex flex-col overflow-hidden">
          <FormPreviewChat
            title={form.title}
            description={form.description || ""}
            fields={formFields}
            onComplete={handleFormSubmit}
            fullscreen={true}
            onProgressChange={handleProgressUpdate}
          />
        </div>

        <div className="hidden lg:block lg:w-1/5"></div>
      </div>
    </div>
  );
}
