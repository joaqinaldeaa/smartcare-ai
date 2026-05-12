"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle, Clock, AlertTriangle, TrendingUp, Baby, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const activities = [
  {
    id: "1",
    type: "assessment",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-[#007a3d]",
    bgColor: "bg-[#c4f0d4]",
    title: "Assessment Selesai",
    desc: "Assessment untuk anak Anda telah selesai diproses",
    time: "Baru saja",
    risk: "low",
  },
  {
    id: "2",
    type: "video",
    icon: <Baby className="w-4 h-4" />,
    color: "text-[#006767]",
    bgColor: "bg-[#f3fffe]",
    title: "Video Diunggah",
    desc: "Video anak berhasil diunggah untuk analisis",
    time: "15 menit lalu",
    risk: null,
  },
  {
    id: "3",
    type: "interview",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "text-[#7c5700]",
    bgColor: "bg-[#ffecb8]",
    title: "Wawancara AI Dimulai",
    desc: "Proses wawancara AI telah dimulai",
    time: "30 menit lalu",
    risk: null,
  },
  {
    id: "4",
    type: "report",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-[#ba1a1a]",
    bgColor: "bg-[#ffdad6]",
    title: "Laporan Diunduh",
    desc: "Laporan hasil assessment berhasil diunduh",
    time: "1 jam lalu",
    risk: null,
  },
  {
    id: "5",
    type: "account",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-[#007a3d]",
    bgColor: "bg-[#c4f0d4]",
    title: "Akun Dibuat",
    desc: "Akun SmartCare AI berhasil dibuat",
    time: "1 hari lalu",
    risk: null,
  },
];

const stats = [
  { label: "Total Assessment", value: "3", icon: <Activity className="w-4 h-4" />, color: "text-[#006767]", bg: "bg-[#f3fffe]" },
  { label: "Selesai", value: "2", icon: <CheckCircle className="w-4 h-4" />, color: "text-[#007a3d]", bg: "bg-[#c4f0d4]" },
  { label: "Sedang Proses", value: "1", icon: <Clock className="w-4 h-4" />, color: "text-[#7c5700]", bg: "bg-[#ffecb8]" },
];

export default function ActivityPage() {
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
          <Activity className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111d24]">Aktivitas Terakhir</h1>
          <p className="text-sm text-[#6e7979]">Riwayat aktivitas akun Anda</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
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

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-[#d8e4ed] p-5">
        <h2 className="text-base font-bold text-[#111d24] mb-4">Timeline Aktivitas</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[#d8e4ed]" />
          <div className="space-y-4">
            {activities.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-4 pl-2 relative"
              >
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 z-10", act.bgColor, act.color)}>
                  {act.icon}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#111d24]">{act.title}</p>
                    <span className="text-[10px] text-[#6e7979]">{act.time}</span>
                  </div>
                  <p className="text-xs text-[#6e7979] mt-0.5">{act.desc}</p>
                  {act.risk && (
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2",
                      act.risk === "low" ? "bg-[#c4f0d4] text-[#00331d]" : "bg-[#ffdad6] text-[#410002]"
                    )}>
                      <AlertTriangle className="w-3 h-3" />
                      Risiko Rendah
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State Illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-[#f5faff] rounded-2xl p-6 text-center border border-[#d8e4ed]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-[#f3fffe] flex items-center justify-center mx-auto mb-3 border border-[#94f2f2]"
        >
          <Activity className="w-8 h-8 text-[#006767]" strokeWidth={1.5} />
        </motion.div>
        <p className="text-sm font-bold text-[#111d24]">Aktivitas Terus Berkembang</p>
        <p className="text-xs text-[#6e7979] mt-1">Setiap langkah screening anak Anda dicatat di sini</p>
      </motion.div>
    </div>
  );
}