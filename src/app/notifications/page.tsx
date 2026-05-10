"use client";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useState } from "react";

export default function NotificationsPage() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const notifications = [
    { id: 1, icon: <CheckCircle2 className="w-5 h-5 text-success" />, title: "Assessment Complete", desc: "Your child's screening results are ready to view", time: "5 min ago", type: "success" },
    { id: 2, icon: <Info className="w-5 h-5 text-info" />, title: "New Message", desc: "Dr. Maya Wijaya sent you a message", time: "1 hour ago", type: "info" },
    { id: 3, icon: <AlertCircle className="w-5 h-5 text-warning" />, title: "Reminder", desc: "Follow-up assessment recommended in 3 months", time: "2 hours ago", type: "warning" },
    { id: 4, icon: <Bell className="w-5 h-5 text-primary" />, title: "Welcome!", desc: "Welcome to SmartCare AI. Start your first assessment today.", time: "1 day ago", type: "default" },
  ];

  const visible = notifications.filter(n => !dismissed.includes(n.id));

  return (
    <PageShell title="Notifications" subtitle="Stay updated with your child's progress" badge={visible.length}>
      <div className="max-w-2xl space-y-3">
        {visible.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">All caught up! No new notifications.</p>
          </div>
        )}
        {visible.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">{n.icon}</div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{n.title}</p>
              <p className="text-sm text-text-secondary mt-1">{n.desc}</p>
              <p className="text-xs text-text-muted mt-2">{n.time}</p>
            </div>
            <button
              onClick={() => setDismissed([...dismissed, n.id])}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-muted transition-all text-text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
