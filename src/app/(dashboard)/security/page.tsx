"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff, Smartphone, Key, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

export default function SecurityPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = React.useState(false);
  const [twoFA, setTwoFA] = React.useState(false);
  const [sessions] = React.useState([
    { device: "Chrome macOS", location: "Jakarta, Indonesia", time: "Aktif sekarang", current: true },
    { device: "Safari iOS", location: "Jakarta, Indonesia", time: "2 jam lalu", current: false },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111d24]">Keamanan & Privasi</h1>
          <p className="text-sm text-[#6e7979]">Kelola keamanan akun Anda</p>
        </div>
      </motion.div>

      {/* Security Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#006767] to-[#0d8282] rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-base font-bold">Keamanan Akun: Baik</p>
            <p className="text-sm text-white/70 mt-0.5">Akun Anda terlindungi dengan baik</p>
          </div>
        </div>
      </motion.div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-[#d8e4ed] p-5">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-[#006767]" />
          <h3 className="text-base font-bold text-[#111d24]">Kata Sandi</h3>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              defaultValue="••••••••••"
              className="w-full h-11 px-4 rounded-xl border border-[#d8e4ed] bg-[#f5faff] text-sm text-[#6e7979] focus:outline-none pr-12"
              readOnly
            />
            <button
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7979] hover:text-[#006767]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-[#6e7979]">Terakhir diubah 30 hari lalu</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl border-2 border-[#d8e4ed] text-[#006767] text-sm font-bold hover:border-[#006767] transition-colors"
          >
            Ubah Kata Sandi
          </motion.button>
        </div>
      </div>

      {/* Two Factor Auth */}
      <div className="bg-white rounded-2xl border border-[#d8e4ed] p-5">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-[#006767]" />
          <h3 className="text-base font-bold text-[#111d24]">Autentikasi Dua Faktor</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#111d24]">2FA belum diaktifkan</p>
            <p className="text-xs text-[#6e7979] mt-0.5">Tambahkan lapisan keamanan ekstra untuk akun Anda</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTwoFA(v => !v)}
            className={cn(
              "h-10 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors",
              twoFA ? "bg-[#c4f0d4] text-[#007a3d]" : "bg-gradient-to-r from-[#006767] to-[#0d8282] text-white"
            )}
          >
            {twoFA ? <><Check className="w-4 h-4" /> Aktif</> : "Aktifkan"}
          </motion.button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-[#d8e4ed] p-5">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-[#006767]" />
          <h3 className="text-base font-bold text-[#111d24]">Sesi Aktif</h3>
        </div>
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#f5faff]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f3fffe] flex items-center justify-center text-[#006767]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#111d24]">{session.device}</p>
                    {session.current && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#c4f0d4] text-[#007a3d]">Saat ini</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6e7979]">{session.location} · {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs text-[#ba1a1a] font-semibold hover:underline">Cabut</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-[#ffecb8] border border-[#fcd34d] rounded-2xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-[#7c5700] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#3d2c00] mb-1">Catatan Privasi</p>
          <p className="text-xs text-[#6e7979] leading-relaxed">
            Data Anda dienkripsi end-to-end dan tidak pernah dibagikan ke pihak ketiga tanpa persetujuan. Kami patuh pada standar HIPAA untuk keamanan data kesehatan.
          </p>
        </div>
      </div>
    </div>
  );
}