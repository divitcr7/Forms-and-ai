// Simple database service that works everywhere without complex setup
import { simpleStorage, SimpleForm } from "./simple-storage";
import { FormGeneration } from "./schema";

export class SimpleDbService {
  // User operations (simplified - just use Clerk ID directly)
  static async createOrUpdateUser(clerkId: string, userData?: any) {
    // Just return a simple user object
    return {
      id: clerkId,
      clerkId,
      ...userData,
    };
  }

  static async getUserByClerkId(clerkId: string) {
    return {
      id: clerkId,
      clerkId,
    };
  }

  // Form operations
  static async createForm(
    userId: string,
    formData: FormGeneration & { originalPrompt: string }
  ): Promise<SimpleForm> {
    return await simpleStorage.createForm(userId, formData);
  }

  static async getFormById(id: string): Promise<SimpleForm | null> {
    return await simpleStorage.getFormById(id);
  }

  static async getFormBySlug(slug: string): Promise<SimpleForm | null> {
    return await simpleStorage.getFormBySlug(slug);
  }

  static async getFormByIdOrSlug(identifier: string): Promise<SimpleForm | null> {
    return await simpleStorage.getFormByIdOrSlug(identifier);
  }

  static async getUserForms(userId: string, archived: boolean = false) {
    const forms = await simpleStorage.getUserForms(userId, archived);
    // Add response count for compatibility
    return forms.map(form => ({
      ...form,
      questions: form.questions,
      _count: {
        responses: 0, // We'll implement this later if needed
      },
    }));
  }

  static async publishForm(id: string): Promise<SimpleForm | null> {
    return await simpleStorage.publishForm(id);
  }

  static async unpublishForm(id: string): Promise<SimpleForm | null> {
    return await simpleStorage.unpublishForm(id);
  }

  static async archiveForm(id: string): Promise<SimpleForm | null> {
    return await simpleStorage.archiveForm(id);
  }

  static async unarchiveForm(id: string): Promise<SimpleForm | null> {
    return await simpleStorage.unarchiveForm(id);
  }

  // Response operations
  static async createFormResponse(
    formId: string,
    answers: Array<{
      questionId: string;
      value: string;
    }>,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ) {
    const response = await simpleStorage.createFormResponse(formId, answers, metadata);
    
    // Return in expected format
    return {
      id: response.id,
      answers: response.answers.map(answer => ({
        ...answer,
        question: {
          content: "Question", // We'll get this from the form if needed
        },
      })),
    };
  }

  static async getFormResponses(formId: string) {
    const responses = await simpleStorage.getFormResponses(formId);
    
    // Return in expected format
    return responses.map(response => ({
      ...response,
      answers: response.answers.map(answer => ({
        ...answer,
        question: {
          content: "Question", // We'll get this from the form if needed
        },
      })),
    }));
  }

  static async getFormStats(formId: string) {
    return await simpleStorage.getFormStats(formId);
  }
}
