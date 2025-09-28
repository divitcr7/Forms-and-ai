// Simple storage solution that works everywhere without complex setup
import { FormGeneration } from "./schema";

export interface SimpleForm {
  id: string;
  title: string;
  description: string;
  slug: string;
  originalPrompt: string;
  questions: Array<{
    id: string;
    content: string;
    type: string;
    required: boolean;
    order: number;
  }>;
  userId: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimpleResponse {
  id: string;
  formId: string;
  answers: Array<{
    questionId: string;
    value: string;
  }>;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// Simple in-memory storage (works everywhere, no setup needed)
class SimpleStorage {
  private forms: Map<string, SimpleForm> = new Map();
  private responses: Map<string, SimpleResponse> = new Map();
  private userForms: Map<string, string[]> = new Map();

  // Generate simple IDs
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50) +
      "-" +
      Math.random().toString(36).substring(2, 8)
    );
  }

  // Form operations
  async createForm(
    userId: string,
    formData: FormGeneration & { originalPrompt: string }
  ): Promise<SimpleForm> {
    const id = this.generateId();
    const slug = this.generateSlug(formData.title);
    
    const form: SimpleForm = {
      id,
      title: formData.title,
      description: formData.description || "",
      slug,
      originalPrompt: formData.originalPrompt,
      questions: formData.questions.map((q, index) => ({
        id: this.generateId(),
        content: q.content,
        type: q.type,
        required: q.required,
        order: index,
      })),
      userId,
      isPublished: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.forms.set(id, form);
    
    // Track user forms
    const userFormsList = this.userForms.get(userId) || [];
    userFormsList.push(id);
    this.userForms.set(userId, userFormsList);

    return form;
  }

  async getFormById(id: string): Promise<SimpleForm | null> {
    return this.forms.get(id) || null;
  }

  async getFormBySlug(slug: string): Promise<SimpleForm | null> {
    for (const form of this.forms.values()) {
      if (form.slug === slug) {
        return form;
      }
    }
    return null;
  }

  async getFormByIdOrSlug(identifier: string): Promise<SimpleForm | null> {
    let form = await this.getFormById(identifier);
    if (!form) {
      form = await this.getFormBySlug(identifier);
    }
    return form;
  }

  async getUserForms(userId: string, archived: boolean = false): Promise<SimpleForm[]> {
    const userFormIds = this.userForms.get(userId) || [];
    const forms: SimpleForm[] = [];
    
    for (const formId of userFormIds) {
      const form = this.forms.get(formId);
      if (form && form.isArchived === archived) {
        forms.push(form);
      }
    }
    
    return forms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async publishForm(id: string): Promise<SimpleForm | null> {
    const form = this.forms.get(id);
    if (form) {
      form.isPublished = true;
      form.updatedAt = new Date().toISOString();
      this.forms.set(id, form);
    }
    return form || null;
  }

  async unpublishForm(id: string): Promise<SimpleForm | null> {
    const form = this.forms.get(id);
    if (form) {
      form.isPublished = false;
      form.updatedAt = new Date().toISOString();
      this.forms.set(id, form);
    }
    return form || null;
  }

  async archiveForm(id: string): Promise<SimpleForm | null> {
    const form = this.forms.get(id);
    if (form) {
      form.isArchived = true;
      form.updatedAt = new Date().toISOString();
      this.forms.set(id, form);
    }
    return form || null;
  }

  async unarchiveForm(id: string): Promise<SimpleForm | null> {
    const form = this.forms.get(id);
    if (form) {
      form.isArchived = false;
      form.updatedAt = new Date().toISOString();
      this.forms.set(id, form);
    }
    return form || null;
  }

  // Response operations
  async createFormResponse(
    formId: string,
    answers: Array<{
      questionId: string;
      value: string;
    }>,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<SimpleResponse> {
    const id = this.generateId();
    
    const response: SimpleResponse = {
      id,
      formId,
      answers,
      submittedAt: new Date().toISOString(),
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    };

    this.responses.set(id, response);
    return response;
  }

  async getFormResponses(formId: string): Promise<SimpleResponse[]> {
    const responses: SimpleResponse[] = [];
    
    for (const response of this.responses.values()) {
      if (response.formId === formId) {
        responses.push(response);
      }
    }
    
    return responses.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async getFormStats(formId: string): Promise<{ totalResponses: number; todayResponses: number }> {
    const responses = await this.getFormResponses(formId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayResponses = responses.filter(r => 
      new Date(r.submittedAt) >= today
    ).length;

    return {
      totalResponses: responses.length,
      todayResponses,
    };
  }
}

// Export singleton instance
export const simpleStorage = new SimpleStorage();
