"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { FileAxis3DIcon, MessageSquareWarningIcon } from "lucide-react";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="sticky top-0 z-50">
        <div className="bg-indigo-600 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
          <MessageSquareWarningIcon className="h-4 w-4 animate-pulse" />
          You&apos;re currently in preview mode. Data entered here is not saved.
        </div>
      </div>
      <header className="w-full py-2 px-4 flex justify-end">
        <ModeToggle />
      </header>

      <main className="flex-1 overflow-hidden">{children}</main>

      <footer className="py-1 px-4 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span>Powered by</span>
          <div className="flex items-center gap-1">
            <FileAxis3DIcon className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">
              <a
                href={process.env.NEXT_PUBLIC_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                formsAI
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
