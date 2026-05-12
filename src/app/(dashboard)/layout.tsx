"use client";

import { Layout } from "@/components/layout/layout";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import { FloatingChat } from "@/components/assessment/floating-chat";
import { SecurityProvider } from "@/components/layout/security-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="dashboard">
      <SecurityProvider>
        <AssessmentProvider>
          <Layout>{children}</Layout>
          <FloatingChat />
        </AssessmentProvider>
      </SecurityProvider>
    </div>
  );
}
