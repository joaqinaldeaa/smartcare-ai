"use client";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Clock, Video, MessageSquare, FileText, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

export default function ActivityPage() {
  const activities = [
    { id: 1, icon: <CheckCircle2 className="w-5 h-5 text-success" />, title: "Assessment completed", desc: "Leo Setiawan — Low Risk", time: "2 hours ago", type: "success" },
    { id: 2, icon: <Video className="w-5 h-5 text-primary" />, title: "Video uploaded", desc: "3-minute activity video for Maya Chen", time: "3 hours ago", type: "default" },
    { id: 3, icon: <MessageSquare className="w-5 h-5 text-primary" />, title: "AI Interview started", desc: "New assessment initiated for Leo Setiawan", time: "4 hours ago", type: "default" },
    { id: 4, icon: <FileText className="w-5 h-5 text-warning" />, title: "Report downloaded", desc: "PDF report downloaded for Maya Chen", time: "1 day ago", type: "warning" },
    { id: 5, icon: <TrendingUp className="w-5 h-5 text-success" />, title: "Progress milestone", desc: "First assessment completed with 98% analysis accuracy", time: "2 days ago", type: "success" },
    { id: 6, icon: <CheckCircle2 className="w-5 h-5 text-success" />, title: "Account created", desc: "Welcome to SmartCare AI!", time: "3 days ago", type: "success" },
  ];

  const stats = [
    { label: "Total Assessments", value: "12", icon: <Activity className="w-5 h-5" />, color: "text-primary" },
    { label: "Completed", value: "10", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-success" },
    { label: "In Progress", value: "2", icon: <Clock className="w-5 h-5" />, color: "text-warning" },
  ];

  return (
    <PageShell title="Recent Activity" subtitle="Track all your SmartCare AI actions">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-border p-5 text-center"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-muted mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
            <p className="text-xs text-text-muted font-medium mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="font-bold text-foreground">Activity Timeline</h2>
        </div>
        <div className="divide-y divide-border">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="px-6 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm">{activity.title}</p>
                <p className="text-sm text-text-secondary mt-0.5">{activity.desc}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs text-text-muted whitespace-nowrap">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
