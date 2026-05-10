"use client";

import { AssessmentProvider } from "@/contexts/AssessmentContext";

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AssessmentProvider>{children}</AssessmentProvider>;
}
