"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { Form } from "@/lib/types";

type FormSettings = Pick<Form, "title" | "description" | "status">;

interface FormSettingsEditorProps {
  form: Form;
  onUpdate: (settings: FormSettings) => Promise<void>;
}

export function FormSettingsEditor({
  form,
  onUpdate,
}: FormSettingsEditorProps) {
  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: form.title,
    description: form.description || "",
    status: form.status,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdate(formSettings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Form Title</Label>
          <Input
            id="title"
            value={formSettings.title}
            onChange={(e) =>
              setFormSettings({ ...formSettings, title: e.target.value })
            }
            placeholder="Enter form title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formSettings.description || ""}
            onChange={(e) =>
              setFormSettings({
                ...formSettings,
                description: e.target.value,
              })
            }
            placeholder="Describe your form"
            rows={3}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="published">Published</Label>
            <p className="text-sm text-muted-foreground">
              Make this form available to others
            </p>
          </div>
          <Switch
            id="status"
            checked={formSettings.status === "published"}
            onCheckedChange={(checked) =>
              setFormSettings({
                ...formSettings,
                status: checked ? "published" : "draft",
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="anonymous">Allow Anonymous Responses</Label>
            <p className="text-sm text-muted-foreground">
              Let users submit without identifying themselves
            </p>
          </div>
          <Switch
            id="anonymous"
            checked={true}
            onCheckedChange={(_checked) => {
              // TODO: Implement settings when available
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email">Collect Email</Label>
            <p className="text-sm text-muted-foreground">
              Require respondents to provide their email
            </p>
          </div>
          <Switch
            id="email"
            checked={false}
            onCheckedChange={(_checked) => {
              // TODO: Implement settings when available
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxResponses">Maximum Responses</Label>
          <Input
            id="maxResponses"
            type="number"
            min="0"
            value=""
            onChange={(_e) => {
              // TODO: Implement settings when available
            }}
            placeholder="Leave empty for unlimited"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiration Date</Label>
          <Input
            id="expiresAt"
            type="date"
            value=""
            onChange={(_e) => {
              // TODO: Implement settings when available
            }}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty for no expiration
          </p>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full" disabled={isSaving}>
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Saving..." : "Save Settings"}
      </Button>
    </motion.div>
  );
}
