import { prisma } from "./prisma";
import { FormGeneration } from "./schema";
import { FormQuestionType } from "@prisma/client";

export class DatabaseService {
  // User operations
  static async createOrUpdateUser(
    clerkId: string,
    userData: {
      email?: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
    }
  ) {
    return await prisma.user.upsert({
      where: { clerkId },
      update: userData,
      create: {
        clerkId,
        ...userData,
      },
    });
  }

  static async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  }

  // Form operations
  static async createForm(
    userId: string,
    formData: FormGeneration & { originalPrompt: string }
  ) {
    const slug = this.generateSlug(formData.title);

    return await prisma.form.create({
      data: {
        title: formData.title,
        description: formData.description,
        slug,
        originalPrompt: formData.originalPrompt,
        userId,
        questions: {
          create: formData.questions.map((question, index) => ({
            content: question.content,
            type: this.mapQuestionType(question.type),
            required: question.required,
            order: index,
          })),
        },
      },
      include: {
        questions: true,
      },
    });
  }

  static async getFormById(id: string) {
    return await prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  static async getFormBySlug(slug: string) {
    return await prisma.form.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  static async getUserForms(userId: string) {
    return await prisma.form.findMany({
      where: {
        userId,
        isArchived: false,
      },
      include: {
        questions: true,
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async publishForm(id: string) {
    return await prisma.form.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  static async archiveForm(id: string) {
    return await prisma.form.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });
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
    return await prisma.formResponse.create({
      data: {
        formId,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            value: answer.value,
          })),
        },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });
  }

  static async getFormResponses(formId: string) {
    return await prisma.formResponse.findMany({
      where: { formId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  static async getFormStats(formId: string) {
    const totalResponses = await prisma.formResponse.count({
      where: { formId },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayResponses = await prisma.formResponse.count({
      where: {
        formId,
        submittedAt: {
          gte: today,
        },
      },
    });

    return {
      totalResponses,
      todayResponses,
    };
  }

  // Utility methods
  private static generateSlug(title: string): string {
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

  private static mapQuestionType(type: string): FormQuestionType {
    const typeMap: Record<string, FormQuestionType> = {
      text: FormQuestionType.TEXT,
      email: FormQuestionType.EMAIL,
      number: FormQuestionType.NUMBER,
      textarea: FormQuestionType.TEXTAREA,
      select: FormQuestionType.SELECT,
      radio: FormQuestionType.RADIO,
      checkbox: FormQuestionType.CHECKBOX,
      date: FormQuestionType.DATE,
      time: FormQuestionType.TIME,
      url: FormQuestionType.URL,
      phone: FormQuestionType.PHONE,
    };
    return typeMap[type.toLowerCase()] || FormQuestionType.TEXT;
  }
}
