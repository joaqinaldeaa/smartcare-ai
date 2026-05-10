"use client";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, AlertTriangle, Download, Eye, Baby } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";

export default function HistoryPage() {
  const records = [
    { id: "R001", child: "Leo Setiawan", age: 5, date: "2026-05-07", risk: "medium", status: "completed", score: 62 },
    { id: "R002", child: "Maya Chen", age: 3, date: "2026-05-05", risk: "low", status: "completed", score: 81 },
    { id: "R003", child: "Leo Setiawan", age: 5, date: "2026-04-28", risk: "medium", status: "completed", score: 55 },
    { id: "R004", child: "Maya Chen", age: 3, date: "2026-04-15", risk: "low", status: "completed", score: 78 },
    { id: "R005", child: "Leo Setiawan", age: 5, date: "2026-04-01", risk: "low", status: "completed", score: 72 },
  ];

  const getRiskColor = (risk: string) => {
    if (risk === "low") return "bg-success/10 text-success border-success/20";
    if (risk === "medium") return "bg-warning/10 text-warning border-warning/20";
    return "bg-error/10 text-error border-error/20";
  };

  const getRiskIcon = (risk: string) => {
    if (risk === "low") return <CheckCircle2 className="w-4 h-4" />;
    if (risk === "medium") return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <PageShell title="Screening History" subtitle="All past assessments and reports">
      <div className="space-y-4">
        {records.map((record, i) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-tertiary/10 flex items-center justify-center">
                  <Baby className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{record.child}</p>
                  <p className="text-xs text-text-muted">Age {record.age} · {record.date}</p>
                  <p className="text-xs text-text-muted">ID: {record.id}</p>
                </div>
              </div>

              {/* Middle - Risk badge */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border ${getRiskColor(record.risk)}`}>
                {getRiskIcon(record.risk)}
                {record.risk === "low" ? "Low Risk" : record.risk === "medium" ? "Medium Risk" : "High Risk"}
              </div>

              {/* Score */}
              <div className="text-center">
                <p className="text-2xl font-extrabold text-foreground">{record.score}%</p>
                <p className="text-xs text-text-muted">Score</p>
              </div>

              {/* Progress bar */}
              <div className="w-32 hidden sm:block">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      record.score >= 70 ? "bg-success" : record.score >= 45 ? "bg-warning" : "bg-error"
                    }`}
                    style={{ width: `${record.score}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href="/result">
                  <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all flex items-center gap-2 cursor-pointer">
                    <Eye className="w-4 h-4" />
                    View
                  </span>
                </Link>
                <span className="px-4 py-2 rounded-xl bg-muted text-text-secondary text-sm font-semibold hover:bg-border transition-all flex items-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" />
                  PDF
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No screening history yet.</p>
            <Link href="/assessment">
              <span className="mt-4 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-hover transition-all inline-block cursor-pointer">
                Start First Assessment
              </span>
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
