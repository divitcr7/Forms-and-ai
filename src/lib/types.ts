// Legacy Convex types (keeping for backward compatibility during migration)
import { Doc } from "@/convex/_generated/dataModel";

export type ConvexFormField = Doc<"formFields">;
export type ConvexForm = Doc<"forms">;
export type ConvexResponse = Doc<"responses">;
export type ConvexFormSettings = Doc<"forms">["settings"];
export type ConvexFormFieldType = Doc<"formFields">["type"];

// New Prisma-based types
export interface FormField {
  _id: string;
  content: string;
  type: FormFieldType;
  required: boolean;
  order: number;
  options?: string;
}

export interface Form {
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
  questions?: FormField[];
}

export type FormFieldType = 
  | "TEXT"
  | "EMAIL" 
  | "NUMBER"
  | "TEXTAREA"
  | "SELECT"
  | "RADIO"
  | "CHECKBOX"
  | "DATE"
  | "TIME"
  | "URL"
  | "PHONE";

export interface Response {
  _id: string;
  formId: string;
  submittedAt: string;
  answers: Array<{
    questionId: string;
    value: string;
  }>;
}