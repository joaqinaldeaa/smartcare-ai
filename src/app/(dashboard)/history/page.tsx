"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Star, Calendar, AlertTriangle, CheckCircle, Baby } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const historyItems = [
  {
    id: "1",
    childName: "Ammar",
    date: "2025-01-15",
    risk: "high",
    riskLabel: "Risiko Tinggi",
    domains: { A: 78, B: 65, C: 82, D: 71 },
    recommendation: "Konsultasi dengan spesialis direkomendasikan",
  },
  {
    id: "2",
    childName: "Ammar",
    date: "2025-01-10",
    risk: "medium",
    riskLabel: "Risiko Sedang",
    domains: { A: 55, B: 48, C: 60, D: 52 },
    recommendation: "Pemantauan rutin dan follow-up assessment",
  },
  {
    id: "3",
    childName: "Ammar",
    date: "2024-12-20",
    risk: "low",
    riskLabel: "Risiko Rendah",
    domains: { A: 30, B: 25, C: 35, D: 28 },
    recommendation: "Perkembangan normal, tetap pantau secara berkala",
  },
];

const RISK_STYLES = {
  low: { color: "text-[#007a3d]", bg: "bg-[#c4f0d4]", border: "border-[#c4f0d4]" },
  medium: { color: "text-[#7c5700]", bg: "bg-[#ffecb8]", border: "border-[#ffecb8]" },
  high: { color: "text-[#ba1a1a]", bg: "bg-[#ffdad6]", border: "border-[#ffdad6]" },
};

export default function HistoryPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111d24]">Riwayat Screening</h1>
          <p className="text-sm text-[#6e7979]">Riwayat assessment anak Anda</p>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Screening", value: historyItems.length, icon: <FileText className="w-4 h-4" />, color: "text-[#006767]", bg: "bg-[#f3fffe]" },
          { label: "Selesai", value: historyItems.length, icon: <CheckCircle className="w-4 h-4" />, color: "text-[#007a3d]", bg: "bg-[#c4f0d4]" },
          { label: "Needs Follow-up", value: 1, icon: <AlertTriangle className="w-4 h-4" />, color: "text-[#ba1a1a]", bg: "bg-[#ffdad6]" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-4 border border-[#d8e4ed]"
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-[#111d24]">{stat.value}</p>
            <p className="text-xs text-[#6e7979] mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyItems.map((item, i) => {
          const rs = RISK_STYLES[item.risk as keyof typeof RISK_STYLES];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-[#d8e4ed] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center text-white font-bold text-sm">
                    {item.childName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111d24]">{item.childName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3 text-[#6e7979]" />
                      <span className="text-xs text-[#6e7979]">{item.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full", rs.bg, rs.color)}>
                    {item.riskLabel}
                  </span>
                </div>
              </div>

              {/* Domain Scores */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.entries(item.domains).map(([domain, score]) => {
                  const domainColors: Record<string, string> = {
                    A: "#006767",
                    B: "#0d8282",
                    C: "#26A69A",
                    D: "#7d5539",
                  };
                  return (
                    <div key={domain} className="bg-[#f5faff] rounded-xl p-2.5 text-center">
                      <p className="text-[10px] font-bold text-[#6e7979] mb-1">Domain {domain}</p>
                      <p className="text-base font-extrabold" style={{ color: domainColors[domain] }}>{score}</p>
                      <div className="w-full h-1 rounded-full bg-[#d8e4ed] mt-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: domainColors[domain] }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendation */}
              <div className="bg-[#f5faff] rounded-xl p-3 flex items-start gap-2 mb-4">
                {item.risk === "high" ? (
                  <AlertTriangle className="w-4 h-4 text-[#ba1a1a] flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-[#007a3d] flex-shrink-0 mt-0.5" />
                )}
                <p className="text-xs text-[#6e7979] leading-relaxed">{item.recommendation}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 h-9 rounded-xl bg-[#f3fffe] border border-[#94f2f2] text-[#006767] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#e0f7f7]"
                >
                  <Eye className="w-3.5 h-3.5" /> Lihat Detail
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 h-9 rounded-xl bg-gradient-to-r from-[#006767] to-[#0d8282] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh PDF
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {historyItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 text-center border border-[#d8e4ed]"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-[#f3fffe] flex items-center justify-center mx-auto mb-4 border border-[#94f2f2]"
          >
            <FileText className="w-8 h-8 text-[#006767]" strokeWidth={1.5} />
          </motion.div>
          <p className="text-sm text-[#6e7979]">Belum ada riwayat screening</p>
          <p className="text-xs text-[#6e7979] mt-1">Hasil assessment akan tampil di sini</p>
        </motion.div>
      )}
    </div>
  );
}