"use client";

import { Layout } from "@/components/layout/layout";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import { FloatingChat } from "@/components/assessment/floating-chat";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="dashboard">
      <AssessmentProvider>
        <Layout>{children}</Layout>
        <FloatingChat />
      </AssessmentProvider>
    </div>
  );
}
