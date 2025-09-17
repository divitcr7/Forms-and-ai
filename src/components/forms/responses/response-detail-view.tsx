"use client";

import { format, formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { User, Clock, FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ResponseDetailViewProps {
  responseId: string;
  formId: string;
}

export function ResponseDetailView({
  responseId,
  formId,
}: ResponseDetailViewProps) {
  const [responseDetails, setResponseDetails] = useState<{
    _id: string;
    formId: string;
    respondentEmail: string;
    submittedAt: string;
    answers: Array<{
      questionId: string;
      value: string;
      question: {
        content: string;
        type: string;
      };
    }>;
    enhancedAnswers: Array<{
      value: string;
      question: {
        content: string;
      };
    }>;
    ipAddress?: string;
    userAgent?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResponseDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/forms/${formId}/responses`);
        if (response.ok) {
          const data = await response.json();
          const selectedResponse = data.responses.find(
            (r: { _id: string }) => r._id === responseId
          );
          if (selectedResponse) {
            // Transform the data to match the expected format
            setResponseDetails({
              ...selectedResponse,
              enhancedAnswers: selectedResponse.answers || [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching response details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (responseId && formId) {
      fetchResponseDetails();
    }
  }, [responseId, formId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[450px] rounded-lg" />
      </div>
    );
  }

  if (!responseDetails) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">Response not found</p>
        </CardContent>
      </Card>
    );
  }

  const submittedDate = new Date(responseDetails.submittedAt);
  const timeAgo = formatDistanceToNow(submittedDate, { addSuffix: true });

  // Calculate completion metrics
  const questionsCount = responseDetails.enhancedAnswers.length;
  const _answeredCount = responseDetails.enhancedAnswers.filter(
    (a) => a.value
  ).length;

  return (
    <div className="space-y-6">
      {/* Response details */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-2">
            <CardTitle>Response Details</CardTitle>
            <Badge variant="outline">
              {format(submittedDate, "MMM d, yyyy")}
            </Badge>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{responseDetails.respondentEmail || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{questionsCount} questions</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {responseDetails.enhancedAnswers.map((answer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <h3 className="font-medium text-sm">{answer.question.content}</h3>
              <div className="p-3 bg-muted rounded-md">
                {answer.value || (
                  <span className="text-muted-foreground italic">
                    No answer provided
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
