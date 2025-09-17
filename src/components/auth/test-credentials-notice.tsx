"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";

export function TestCredentialsNotice() {
  const testEmail = "test@gmail.com";
  const testPassword = "test@123";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Test Account Available
              </h3>
              <p className="text-sm text-muted-foreground">
                Use these credentials to explore the app without creating an
                account:
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-background/60 rounded-md px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <code className="text-sm font-mono">{testEmail}</code>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(testEmail, "Email")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between bg-background/60 rounded-md px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Password:
                  </span>
                  <code className="text-sm font-mono">{testPassword}</code>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(testPassword, "Password")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
