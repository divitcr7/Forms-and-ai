"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddPromptModal } from "./add-prompt-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FormGeneration } from "@/lib/schema";

type Props = {
  label?: string;
};

export default function CreateFormButton({ label }: Props) {
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const saveFormMutation = useMutation(api.forms.createForm);

  const handleSubmitPrompt = async ({
    prompt,
    topics,
  }: {
    prompt: string;
    topics?: string;
  }) => {
    try {
      setIsLoading(true);

      // Call the form generation API endpoint
      const response = await fetch("/api/forms/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, topics }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Form generation API error:", {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        // Provide more specific error messages based on status codes
        if (response.status === 401) {
          throw new Error("Authentication failed. Please sign in again.");
        } else if (response.status === 500) {
          throw new Error(errorData.error || "Server error occurred. Please try again later.");
        } else {
          throw new Error(errorData.error || `Failed to create form (${response.status})`);
        }
      }

      const formData = (await response.json()) as FormGeneration;

      // save to convex
      const formId = await saveFormMutation({
        title: formData.title,
        description: formData.description,
        questions: formData.questions,
        originalPrompt: prompt,
      });

      toast.success("Form created successfully!");

      // Redirect to the form page
      router.push(`/dashboard/forms/${formId}`);

      // Close the modal
      setShowPromptModal(false);
    } catch (error) {
      console.error("Error creating form:", error);
      
      // Handle specific error types
      let errorMessage = "Failed to create form. Please try again.";
      
      if (error instanceof Error) {
        // Check for JWT/authentication related errors
        if (error.message.includes("JWT") || error.message.includes("authentication") || error.message.includes("convex")) {
          errorMessage = "Authentication error. Please refresh the page and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setShowPromptModal(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        {label || "Generate Form"}
      </Button>

      <AddPromptModal
        open={showPromptModal}
        onOpenChange={setShowPromptModal}
        onSubmit={handleSubmitPrompt}
        isLoading={isLoading}
      />
    </>
  );
}
