"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, Check, X, ChevronDown, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const notifications = [
  {
    id: "1",
    type: "assessment",
    title: "Assessment Selesai",
    desc: "Hasil screening untuk anak Anda sudah siap dilihat",
    time: "5 menit lalu",
    read: false,
    color: "from-[#006767] to-[#0d8282]",
    bg: "bg-[#f3fffe]",
  },
  {
    id: "2",
    type: "ai",
    title: "AI Analysis Selesai",
    desc: "Analisis video anak telah selesai diproses",
    time: "30 menit lalu",
    read: false,
    color: "from-[#26A69A] to-[#00897B]",
    bg: "bg-[#E0F2F1]",
  },
  {
    id: "3",
    type: "reminder",
    title: "Pengingat Jadwal Kontrol",
    desc: "Ingat untuk kontrol rutin setiap 3 bulan",
    time: "1 jam lalu",
    read: true,
    color: "from-[#7d5539] to-[#6a472f]",
    bg: "bg-[#FFF3E0]",
  },
  {
    id: "4",
    type: "security",
    title: "Akses Login Baru",
    desc: "Login terdeteksi dari perangkat baru",
    time: "2 jam lalu",
    read: true,
    color: "from-[#ba1a1a] to-[#990000]",
    bg: "bg-[#ffdad6]",
  },
];

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [notifs, setNotifs] = React.useState(notifications);
  const unreadCount = notifs.filter(n => !n.read).length;

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  const filtered = filter === "unread" ? notifs.filter(n => !n.read) : notifs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111d24]">Notifikasi</h1>
            <p className="text-sm text-[#6e7979]">{unreadCount} belum dibaca</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7979]" />
            <input
              placeholder="Cari notifikasi..."
              className="h-10 pl-9 pr-4 rounded-xl border border-[#d8e4ed] bg-white text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767] w-48"
            />
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={markAllRead}
              className="h-10 px-4 rounded-xl bg-[#f3fffe] border border-[#94f2f2] text-[#006767] text-sm font-semibold hover:bg-[#e0f7f7]"
            >
              Tandai semua dibaca
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "unread"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              filter === f
                ? "bg-gradient-to-r from-[#006767] to-[#0d8282] text-white"
                : "bg-white border border-[#d8e4ed] text-[#6e7979] hover:border-[#006767]"
            )}
          >
            {f === "all" ? "Semua" : "Belum Dibaca"} {f === "unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center border border-[#d8e4ed]"
          >
            <Bell className="w-12 h-12 text-[#d8e4ed] mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-[#6e7979]">Semua notifikasi sudah dibaca</p>
          </motion.div>
        ) : (
          filtered.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "bg-white rounded-2xl p-4 border transition-all",
                notif.read ? "border-[#d8e4ed]" : "border-[#94f2f2] shadow-sm"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0", notif.color)}>
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#111d24]">{notif.title}</p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#006767] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#6e7979] mt-0.5 leading-relaxed">{notif.desc}</p>
                    </div>
                    <span className="text-[10px] text-[#6e7979] ml-4 flex-shrink-0">{notif.time}</span>
                  </div>
                  {!notif.read && (
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => markRead(notif.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#f3fffe] border border-[#94f2f2] text-[#006767] text-xs font-semibold"
                      >
                        Tandai Dibaca
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}