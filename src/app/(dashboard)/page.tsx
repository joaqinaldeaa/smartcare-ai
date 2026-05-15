"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Plus,
  Baby,
  Activity,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useAssessment } from "@/contexts/AssessmentContext";
import { getChildrenFromStorage, addChildToStorage } from "@/hooks/useChildren";
import type { ChildProfile } from "@/contexts/AssessmentContext";

// ─── Kid-Friendly Animated SVG Illustrations ──────────────────────────────────

function ChildFloatingIllustration({ size = 80 }: { size?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        {/* Background blob */}
        <motion.ellipse
          cx="40" cy="65" rx="18" ry="5"
          fill="#006767" opacity="0.15"
          animate={{ rx: [18, 20, 18] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Body */}
        <motion.path
          d="M26 72c0-7 6-12 14-12s14 5 14 12"
          fill="#0d8282"
          animate={{ d: ["M26 72c0-7 6-12 14-12s14 5 14 12", "M26 72c0-7 6-11 14-11s14 4 14 11", "M26 72c0-7 6-12 14-12s14 5 14 12"] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Head */}
        <circle cx="40" cy="38" r="16" fill="#e8c49a"/>
        {/* Hair */}
        <path d="M26 32c2-8 10-12 14-12s12 4 14 12c-4-2-10-2-14-2s-10 0-14 2z" fill="#4a3728"/>
        {/* Eyes */}
        <motion.circle cx="35" cy="36" r="2" fill="#2d1f14"
          animate={{ r: [2, 2.5, 2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle cx="45" cy="36" r="2" fill="#2d1f14"
          animate={{ r: [2, 2.5, 2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Blush */}
        <circle cx="32" cy="41" r="3" fill="#f9a8b8" opacity="0.5"/>
        <circle cx="48" cy="41" r="3" fill="#f9a8b8" opacity="0.5"/>
        {/* Smile */}
        <motion.path
          d="M36 44c0 0 2 3 4 3s4-3 4-3"
          stroke="#2d1f14" strokeWidth="1.5" strokeLinecap="round" fill="none"
          animate={{ d: ["M36 44c0 0 2 3 4 3s4-3 4-3", "M36 43c0 0 2 4 4 4s4-4 4-4", "M36 44c0 0 2 3 4 3s4-3 4-3"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Sparkles */}
        <motion.g animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2, repeat: Infinity }}>
          <path d="M18 25l1.5 2.5L22 29l-2.5-1.5L18 31l-1.5-2L14 29l2.5 1.5z" fill="#7fffd4"/>
          <path d="M62 20l1 2L65 23l-2-1L62 24l-1-2L59 23l2 1z" fill="#7fffd4"/>
        </motion.g>
        {/* Raised arm */}
        <motion.path
          d="M54 52c6-4 10-2 12 2"
          stroke="#e8c49a" strokeWidth="4" strokeLinecap="round" fill="none"
          animate={{ d: ["M54 52c6-4 10-2 12 2", "M54 50c6-6 10-3 12 3", "M54 52c6-4 10-2 12 2"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

function ParentChildIllustration({ size = 90 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size * 0.85 }}
    >
      <svg width={size} height={size * 0.85} viewBox="0 0 90 76" fill="none">
        {/* Parent figure */}
        <motion.g animate={{ y: [0, -1, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <circle cx="30" cy="20" r="11" fill="#e8c49a"/>
          <path d="M16 64c0-7 6-13 14-13s14 6 14 13" fill="#006767"/>
          {/* Hair */}
          <path d="M19 16c0-7 5-10 11-10s11 3 11 10" fill="#2d1f14"/>
          {/* Eyes */}
          <circle cx="26" cy="19" r="1.5" fill="#2d1f14"/>
          <circle cx="34" cy="19" r="1.5" fill="#2d1f14"/>
          <path d="M25 25c0 0 2.5 2.5 5 2.5s5-2.5 5-2.5" stroke="#2d1f14" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        </motion.g>

        {/* Child figure */}
        <motion.g animate={{ y: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}>
          <circle cx="65" cy="38" r="8" fill="#e8c49a"/>
          <path d="M55 70c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="#0d8282"/>
          {/* Hair */}
          <path d="M57 34c1.5-5 6-8 8-8s6.5 3 8 8" fill="#004d4d"/>
          {/* Eyes */}
          <motion.circle cx="62" cy="37" r="1.2" fill="#2d1f14"
            animate={{ r: [1.2, 1.5, 1.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.circle cx="68" cy="37" r="1.2" fill="#2d1f14"
            animate={{ r: [1.2, 1.5, 1.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.path d="M62 43c0 0 1.5 2 3 2s3-2 3-2" stroke="#2d1f14" strokeWidth="1" strokeLinecap="round" fill="none"
            animate={{ d: ["M62 43c0 0 1.5 2 3 2s3-2 3-2", "M62 42c0 0 1.5 3 3 3s3-3 3-3", "M62 43c0 0 1.5 2 3 2s3-2 3-2"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.g>

        {/* Heart between them */}
        <motion.path
          d="M45 38s-4-3-4-7c0-2.5 2-4.5 4.5-4.5 1.5 0 3 1 3.5 2.5L47.5 31c0 0 3-2.5 4.5 0 1.5 2.5-4 7-4 7z"
          fill="#f87171"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "45px 35px" }}
        />
      </svg>
    </motion.div>
  );
}

function ActivityIllustration({ size = 72 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        {/* Clipboard */}
        <rect x="10" y="14" width="52" height="50" rx="8" fill="white" stroke="#006767" strokeWidth="1.5"/>
        <rect x="10" y="14" width="52" height="50" rx="8" fill="#f3fffe" opacity="0.5"/>
        {/* Clip */}
        <rect x="24" y="10" width="24" height="8" rx="3" fill="#006767"/>
        {/* Lines */}
        {[24, 34, 44, 54].map((y, i) => (
          <motion.rect key={y} x="18" y={y} width={20 + i * 3} height="3" rx="1.5" fill="#d8e4ed"
            animate={{ width: [20 + i * 3, 22 + i * 3, 20 + i * 3] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        {/* Checkmark */}
        <motion.g
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <circle cx="50" cy="30" r="10" fill="#c4f0d4"/>
          <path d="M46 30l2.5 2.5L54 26" stroke="#007a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </motion.g>
      </svg>
    </motion.div>
  );
}

function BabyIllustration({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Onesie body */}
        <motion.path
          d="M20 64c0-8 4-14 12-14s12 6 12 14"
          fill="#006767"
          animate={{ d: ["M20 64c0-8 4-14 12-14s12 6 12 14", "M20 64c0-8 4-13 12-13s12 5 12 13", "M20 64c0-8 4-14 12-14s12 6 12 14"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Head */}
        <circle cx="32" cy="30" r="14" fill="#f5d5c8"/>
        {/* Baby hat */}
        <path d="M18 28c0-8 6-14 14-14s14 6 14 14" fill="#0d8282"/>
        <circle cx="32" cy="16" r="3" fill="#0d8282"/>
        {/* Eyes - closed happy crescents */}
        <motion.path d="M26 30c0 0 1.5 2 3 2s3-2 3-2" stroke="#004d4d" strokeWidth="1.5" strokeLinecap="round" fill="none"
          animate={{ d: ["M26 30c0 0 1.5 2 3 2s3-2 3-2", "M26 29c0 0 1.5 3 3 3s3-3 3-3", "M26 30c0 0 1.5 2 3 2s3-2 3-2"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Rosy cheeks */}
        <circle cx="25" cy="34" r="2.5" fill="#f9a8b8" opacity="0.6"/>
        <circle cx="39" cy="34" r="2.5" fill="#f9a8b8" opacity="0.6"/>
        {/* Pacifier */}
        <circle cx="32" cy="38" r="3" fill="white" stroke="#006767" strokeWidth="1"/>
        {/* Sparkles */}
        <motion.g animate={{ opacity: [0.2, 1, 0.2], rotate: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <path d="M8 20l1.2 2L11 23l-2-1.2L8 24.4 6.8 22.4 4.8 23.4l2 1.2z" fill="#7fffd4"/>
          <path d="M56 12l1 1.6L58.6 15l-1.6-1L56 16.6 54.4 15l-1.6-1z" fill="#7fffd4"/>
        </motion.g>
      </svg>
    </motion.div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t } = useLanguage();
  const { selectedChild } = useAssessment();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");

  useEffect(() => {
    setChildren(getChildrenFromStorage().filter(c => !c.retested));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat Pagi";
    if (h < 18) return "Selamat Siang";
    return "Selamat Malam";
  };

  const addChild = () => {
    if (!newName.trim() || !newAge) return;
    addChildToStorage({ name: newName, age: parseInt(newAge), gender: "male" as const, dob: "", retested: false });
    setChildren(getChildrenFromStorage().filter(c => !c.retested));
    setNewName("");
    setNewAge("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">

      {/* Welcome — with floating child illustration */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-start justify-between"
      >
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-[#111d24] tracking-tight">
            {greeting()}, Orang Tua
          </h1>
          <p className="text-[#6e7979] text-sm mt-0.5">
            Pantau perkembangan si kecil dengan mudah dan menyenangkan.
          </p>
        </div>
        {/* Animated child illustration in welcome */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="hidden md:flex"
        >
          <ChildFloatingIllustration size={90} />
        </motion.div>
      </motion.div>

      {/* Quick Action — Mulai Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-gradient-to-r from-[#006767] to-[#0d8282] rounded-2xl p-5 flex items-center justify-between overflow-hidden relative"
      >
        {/* Background floating decoration */}
        <motion.div
          animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute right-20 top-0 opacity-20"
        >
          <ParentChildIllustration size={120} />
        </motion.div>
        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-white" strokeWidth={2} />
          </motion.div>
          <div>
            <p className="text-white font-bold">Mulai Assessment Baru</p>
            <p className="text-white/70 text-sm">Deteksi dini risiko autism & ADHD dalam 15 menit</p>
          </div>
        </div>
        <Link href="/assessment" className="relative z-10">
          <Button className="bg-white text-[#006767] hover:bg-white/90 font-bold">
            <Plus className="w-4 h-4" strokeWidth={2} />
            Mulai Sekarang
          </Button>
        </Link>
      </motion.div>

      {/* Children Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <BabyIllustration size={36} />
            </motion.div>
            <h2 className="text-lg font-bold text-[#111d24]">Profil Anak</h2>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs text-[#006767] font-semibold hover:underline"
          >
            + Tambah
          </button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl border border-[#d8e4ed] p-4 mb-3 space-y-3 overflow-hidden"
            >
              <p className="text-sm font-semibold text-[#111d24]">Tambah Profil Anak</p>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nama anak"
                className="w-full h-11 rounded-xl border border-[#d8e4ed] bg-white px-4 text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767]"
              />
              <input
                value={newAge}
                onChange={e => setNewAge(e.target.value)}
                placeholder="Umur (tahun)"
                type="number"
                min="1"
                max="12"
                className="w-full h-11 rounded-xl border border-[#d8e4ed] bg-white px-4 text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767]"
              />
              <div className="flex gap-2">
                <Button onClick={addChild} className="flex-1 bg-[#006767] hover:bg-[#004d4d] text-white">Simpan</Button>
                <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1 border-[#d8e4ed]">Batal</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {children.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center border border-[#d8e4ed]"
          >
            <motion.div
              animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full bg-[#f3fffe] flex items-center justify-center mx-auto mb-4 border border-[#94f2f2]"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="20" r="10" fill="#e8c49a"/>
                <path d="M14 46c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="#0d8282"/>
                <path d="M14 17c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="#006767"/>
                <motion.circle cx="20" cy="19" r="1.5" fill="#2d1f14"
                  animate={{ r: [1.5, 2, 1.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle cx="28" cy="19" r="1.5" fill="#2d1f14"
                  animate={{ r: [1.5, 2, 1.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx="18" cy="23" r="2" fill="#f9a8b8" opacity="0.5"/>
                <circle cx="30" cy="23" r="2" fill="#f9a8b8" opacity="0.5"/>
              </svg>
            </motion.div>
            <p className="text-[#6e7979] text-sm">Belum ada profil anak. Tambahkan profil pertama Anda.</p>
            <Link href="/assessment">
              <Button className="mt-4 bg-[#006767] hover:bg-[#004d4d] text-white">
                <Plus className="w-4 h-4" strokeWidth={2} /> Tambah Anak
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {children.map((child, i) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,103,103,0.12)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-4 border border-[#d8e4ed] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  >
                    {child.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-bold text-[#111d24]">{child.name}</p>
                    <p className="text-xs text-[#6e7979]">{child.age} tahun</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6e7979]" strokeWidth={2} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity with kid-friendly illustration */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ActivityIllustration size={32} />
            </motion.div>
            <h2 className="text-lg font-bold text-[#111d24]">Aktivitas Terakhir</h2>
          </div>
          <Link href="/activity">
            <button className="text-xs text-[#006767] font-semibold hover:underline flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-[#d8e4ed] flex items-center gap-6"
        >
          {/* Animated illustration */}
          <div className="flex-shrink-0">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ActivityIllustration size={72} />
            </motion.div>
          </div>

          <div className="flex-1 text-center">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-[#f3fffe] flex items-center justify-center mx-auto mb-3 border border-[#94f2f2]"
            >
              <Activity className="w-6 h-6 text-[#006767]" strokeWidth={1.5} />
            </motion.div>
            <p className="text-[#6e7979] text-sm">Belum ada aktivitas. Mulai assessment pertama Anda.</p>
            <Link href="/assessment">
              <Button variant="outline" className="mt-3 text-xs border-[#d8e4ed] text-[#006767] hover:bg-[#f3fffe]">
                Mulai Assessment
              </Button>
            </Link>
          </div>

          {/* Right side illustration */}
          <div className="flex-shrink-0 hidden md:flex">
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChildFloatingIllustration size={64} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-6 text-xs text-[#6e7979]"
      >
        <span className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-[#007a3d] text-[#007a3d]" strokeWidth={2} />
          HIPAA Compliant
        </span>
        <span>Aman & Privat</span>
        <span>AI-Powered Screening</span>
      </motion.div>
    </div>
  );
}