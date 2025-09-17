"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "./empty-state";
import { FormFieldCard } from "./form-field-card";
import { FormField } from "@/lib/types";

interface FormFieldsEditorProps {
  formId: string;
  fields: Array<
    FormField & {
      label?: string;
      placeholder?: string;
      formId?: string;
    }
  >;
  onCreateField: (field: any) => Promise<void>;
  onUpdateField: (field: any) => Promise<void>;
  onDeleteField: (fieldId: string) => Promise<void>;
}

export function FormFieldsEditor({
  formId,
  fields,
  onCreateField,
  onUpdateField,
  onDeleteField,
}: FormFieldsEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleAddField = () => {
    const newField = {
      formId,
      order: fields.length,
      type: "shortText",
      label: "New Question",
      required: false,
      placeholder: "Enter your answer",
    };

    onCreateField(newField);
  };

  const toggleEditField = (fieldId: string | undefined) => {
    if (fieldId) {
      setEditingField(editingField === fieldId ? null : fieldId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddField} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {fields.length === 0 ? (
        <EmptyState onAdd={handleAddField} />
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <motion.div
                  key={field._id?.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormFieldCard
                    field={field}
                    isEditing={editingField === field._id?.toString()}
                    onToggleEdit={() => toggleEditField(field._id?.toString())}
                    onUpdate={onUpdateField}
                    onDelete={onDeleteField}
                  />
                </motion.div>
              ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
