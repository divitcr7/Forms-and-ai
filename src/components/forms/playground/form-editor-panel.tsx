"use client";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormFieldsEditor } from "./form-fields-editor";
import { FormSettingsEditor } from "./form-settings-editor";
import { Form, FormField, FormFieldType } from "@/lib/types";

interface FormEditorPanelProps {
  form: Form;
  formFields: FormField[];
  activeTab: "fields" | "settings";
  formId: string;
}

export function FormEditorPanel({
  form,
  formFields,
  activeTab,
  formId,
}: FormEditorPanelProps) {
  // TODO: Replace with Prisma API calls
  // const updateForm = useMutation(api.forms.updateForm);
  // const updateFormField = useMutation(api.formFields.updateFormField);
  // const createFormField = useMutation(api.formFields.createFormField);
  // const deleteFormField = useMutation(api.formFields.deleteFormField);

  const handleUpdateSettings = async (
    _settings: Pick<Form, "title" | "description" | "status">
  ) => {
    try {
      // TODO: Implement with Prisma API
      // await updateForm({
      //   formId,
      //   title: settings.title,
      //   description: settings.description,
      //   status: settings.status,
      //   settings: settings.settings,
      // });
      toast.success("Form settings updated");
    } catch (error) {
      console.error("Error updating form settings:", error);
      toast.error("Failed to update form settings");
    }
  };

  // Handle create form field
  const handleCreateField = async (_field: {
    order: number;
    type: FormFieldType;
    label?: string;
    required: boolean;
    placeholder?: string;
    description?: string;
    validation?: any;
  }) => {
    try {
      // TODO: Implement with Prisma API
      // await createFormField({
      //   formId,
      //   order: field.order,
      //   type: field.type,
      //   label: field.label,
      //   required: field.required,
      //   placeholder: field.placeholder,
      //   description: field.description,
      //   validation: field.validation,
      // });
      toast.success("Field created");
    } catch (error) {
      console.error("Error creating field:", error);
      toast.error("Failed to create field");
    }
  };

  // Handle update form field
  const handleUpdateField = async (_field: {
    _id: string;
    order: number;
    type: FormFieldType;
    label?: string;
    required: boolean;
    placeholder?: string;
    description?: string;
    validation?: any;
  }) => {
    try {
      // await updateFormField({
      //   fieldId: _field._id,
      //   order: _field.order,
      //   type: _field.type,
      //   label: _field.label,
      //   required: _field.required,
      //   placeholder: _field.placeholder,
      //   description: _field.description,
      //   validation: _field.validation,
      // });
      toast.success("Field updated");
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("Failed to update field");
    }
  };

  // Handle delete form field
  const handleDeleteField = async (_fieldId: string) => {
    try {
      // await deleteFormField({ fieldId });
      toast.success("Field deleted");
    } catch (error) {
      console.error("Error deleting field:", error);
      toast.error("Failed to delete field");
    }
  };

  return (
    <Card className="h-[650px] flex flex-col shadow-sm">
      {activeTab === "fields" ? (
        <>
          <CardHeader className="pb-2">
            <CardTitle>Form Fields</CardTitle>
            <CardDescription>
              Manage your form&apos;s fields and questions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
            <FormFieldsEditor
              formId={formId}
              fields={formFields.map((field) => ({
                ...field,
                label: field.content || (field as any).label || "Question",
                formId: formId,
              }))}
              onCreateField={handleCreateField}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
            />
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="pb-2">
            <CardTitle>Form Settings</CardTitle>
            <CardDescription>
              Configure your form&apos;s basic settings
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
            <FormSettingsEditor form={form} onUpdate={handleUpdateSettings} />
          </CardContent>
        </>
      )}
    </Card>
  );
}
