"use client";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

export function ConvexClerkProvider({ children }: { children: ReactNode }) {
  // Only initialize Convex if URL is provided
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    // Return children without Convex provider if not configured
    return <>{children}</>;
  }

  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
