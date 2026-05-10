"use client";

import { Layout } from "@/components/layout/layout";
import { AssessmentProvider } from "@/contexts/AssessmentContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AssessmentProvider>
      <Layout>{children}</Layout>
    </AssessmentProvider>
  );
}
