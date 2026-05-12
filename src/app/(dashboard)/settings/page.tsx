"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Globe, Shield, Eye, Trash2, Check, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const LANGUAGES = [
  { code: "id", label: "Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fil", label: "Filipino", flag: "🇵🇭" },
  { code: "ms", label: "Malay", flag: "🇲🇾" },
  { code: "th", label: "Thai", flag: "🇹🇭" },
  { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
];

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = React.useState("profile");

  const tabs = [
    { id: "profile", label: "Profil", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Notifikasi", icon: <Bell className="w-4 h-4" /> },
    { id: "language", label: "Bahasa", icon: <Globe className="w-4 h-4" /> },
    { id: "privacy", label: "Privasi", icon: <Shield className="w-4 h-4" /> },
  ];

  const notifSettings = [
    { label: "Hasil Assessment", enabled: true },
    { label: "Pengingat Jadwal Kontrol", enabled: true },
    { label: "Tips & Edukasi", enabled: false },
    { label: "Email Marketing", enabled: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111d24]">Pengaturan Akun</h1>
          <p className="text-sm text-[#6e7979]">Kelola profil dan preferensi Anda</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-[240px_1fr] gap-6">
        {/* Tabs Sidebar */}
        <div className="bg-white rounded-2xl border border-[#d8e4ed] p-3 h-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left mb-1",
                activeTab === tab.id
                  ? "bg-[#006767] text-white"
                  : "text-[#6e7979] hover:bg-[#f5faff] hover:text-[#111d24]"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          <div className="border-t border-[#d8e4ed] mt-3 pt-3">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] transition-all text-left">
              <Trash2 className="w-4 h-4" />
              Hapus Akun
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-[#d8e4ed] p-6 space-y-5"
            >
              <h3 className="text-base font-bold text-[#111d24]">Profil Saya</h3>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center text-white font-bold text-xl">
                  AU
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111d24]">Ayah / Ibu</p>
                  <p className="text-xs text-[#6e7979]">demo@smartcare.ai</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111d24] mb-1.5">Nama Lengkap</label>
                  <input defaultValue="Ayah / Ibu" className="w-full h-11 px-4 rounded-xl border border-[#d8e4ed] bg-white text-sm text-[#111d24] focus:outline-none focus:border-[#006767]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111d24] mb-1.5">Email</label>
                  <input defaultValue="demo@smartcare.ai" className="w-full h-11 px-4 rounded-xl border border-[#d8e4ed] bg-[#f5faff] text-sm text-[#6e7979] focus:outline-none" readOnly />
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006767] to-[#0d8282] text-white text-sm font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-[#d8e4ed] p-6 space-y-5"
            >
              <h3 className="text-base font-bold text-[#111d24]">Preferensi Notifikasi</h3>
              <div className="space-y-3">
                {notifSettings.map(setting => (
                  <div key={setting.label} className="flex items-center justify-between p-3 rounded-xl bg-[#f5faff]">
                    <p className="text-sm font-medium text-[#111d24]">{setting.label}</p>
                    <button
                      className={cn(
                        "w-10 h-6 rounded-full relative transition-colors duration-200",
                        setting.enabled ? "bg-[#006767]" : "bg-[#d8e4ed]"
                      )}
                    >
                      <span className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                        setting.enabled ? "left-5" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "language" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-[#d8e4ed] p-6 space-y-5"
            >
              <h3 className="text-base font-bold text-[#111d24]">Bahasa</h3>
              <p className="text-sm text-[#6e7979]">Pilih bahasa yang Anda inginkan</p>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map(langOpt => (
                  <button
                    key={langOpt.code}
                    onClick={() => setLang(langOpt.code as any)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      lang === langOpt.code
                        ? "border-[#006767] bg-[#f3fffe]"
                        : "border-[#d8e4ed] hover:border-[#006767]"
                    )}
                  >
                    <span className="text-xl">{langOpt.flag}</span>
                    <div>
                      <p className={cn("text-sm font-semibold", lang === langOpt.code ? "text-[#006767]" : "text-[#111d24]")}>{langOpt.label}</p>
                      <p className="text-[10px] text-[#6e7979]">{langOpt.code.toUpperCase()}</p>
                    </div>
                    {lang === langOpt.code && (
                      <Check className="w-4 h-4 text-[#006767] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "privacy" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-[#d8e4ed] p-6 space-y-5"
            >
              <h3 className="text-base font-bold text-[#111d24]">Privasi & Keamanan</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f5faff]">
                  <div>
                    <p className="text-sm font-medium text-[#111d24]">Bagikan data dengan spesialis</p>
                    <p className="text-xs text-[#6e7979]">Izinkan dokter melihat laporan screening</p>
                  </div>
                  <button className="w-10 h-6 rounded-full relative bg-[#006767]">
                    <span className="absolute top-1 left-5 w-4 h-4 rounded-full bg-white shadow" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f5faff]">
                  <div>
                    <p className="text-sm font-medium text-[#111d24]">Analitik anonim</p>
                    <p className="text-xs text-[#6e7979]">Bantu kami improve platform</p>
                  </div>
                  <button className="w-10 h-6 rounded-full relative bg-[#d8e4ed]">
                    <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}