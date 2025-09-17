"use client";

import { FormField } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimpleFormDisplayProps {
  formFields: FormField[];
}

export function SimpleFormDisplay({ formFields }: SimpleFormDisplayProps) {
  if (!formFields || formFields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No questions found for this form.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Form Questions</h3>
        <Badge variant="secondary">{formFields.length} questions</Badge>
      </div>

      {formFields
        .sort((a, b) => a.order - b.order)
        .map((field, index) => (
          <Card key={field._id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <CardTitle className="text-base">{field.content}</CardTitle>
                </div>
                <div className="flex gap-2">
                  {field.required && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {field.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                {getFieldTypeDescription(field.type)}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

function getFieldTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    TEXT: "Short text input",
    EMAIL: "Email address input",
    NUMBER: "Numeric input",
    TEXTAREA: "Long text input",
    SELECT: "Dropdown selection",
    RADIO: "Single choice selection",
    CHECKBOX: "Multiple choice selection",
    DATE: "Date picker",
    TIME: "Time picker",
    URL: "URL input",
    PHONE: "Phone number input",
  };

  return descriptions[type] || "Text input";
}
