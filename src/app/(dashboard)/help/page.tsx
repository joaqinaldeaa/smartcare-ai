"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Search, Book, MessageSquare, Phone, Mail, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const faqs = [
  {
    q: "Bagaimana cara memulai assessment baru?",
    a: "Klik tombol 'Mulai Assessment' di dashboard, pilih profil anak, lalu ikuti langkah-langkah yang tersedia hingga selesai.",
  },
  {
    q: "Apakah data anak saya aman?",
    a: "Ya, semua data dienkripsi dan disimpan dengan standar keamanan HIPAA. Kami tidak pernah membagikan data Anda ke pihak ketiga.",
  },
  {
    q: "Berapa lama waktu assessment?",
    a: "Rata-rata assessment membutuhkan waktu sekitar 15-20 menit, termasuk wawancara AI dan pengunggahan video.",
  },
  {
    q: "Hasil assessment apakah bisa digunakan untuk diagnosis?",
    a: "Hasil ini BUKAN diagnosis medis resmi. Ini adalah alat deteksi dini. Selalu konsultasikan dengan dokter spesialis anak atau psikolog.",
  },
  {
    q: "Apakah bisa menggunakan bahasa lain?",
    a: "Ya, SmartCare AI mendukung 6 bahasa: Indonesia, English, Filipino, Malay, Thai, dan Vietnamese.",
  },
];

const guides = [
  { title: "Panduan Memulai Assessment", desc: "Langkah demi langkah memulai screening pertama Anda", icon: "1" },
  { title: "Memahami Hasil Screening", desc: "Cara membaca dan memahami laporan hasil assessment", icon: "2" },
  { title: "Tips Mengunggah Video", desc: "Panduan merekam video yang optimal untuk analisis AI", icon: "3" },
  { title: "Keamanan Data", desc: "Bagaimana kami melindungi informasi pribadi Anda", icon: "4" },
];

export default function HelpPage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111d24]">Bantuan</h1>
          <p className="text-sm text-[#6e7979]">Temukan jawaban untuk pertanyaan Anda</p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7979]" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari bantuan..."
          className="w-full h-12 pl-12 pr-4 rounded-2xl border border-[#d8e4ed] bg-white text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767]"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <motion.a
          href="mailto:support@smartcare.ai"
          whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,103,103,0.12)" }}
          className="bg-white rounded-2xl p-5 border border-[#d8e4ed] text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f3fffe] flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-[#006767]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold text-[#111d24]">Email</p>
          <p className="text-xs text-[#6e7979] mt-0.5">support@smartcare.ai</p>
        </motion.a>
        <motion.a
          href="tel:+62812345678"
          whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,103,103,0.12)" }}
          className="bg-white rounded-2xl p-5 border border-[#d8e4ed] text-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f3fffe] flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6 text-[#006767]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold text-[#111d24]">Telepon</p>
          <p className="text-xs text-[#6e7979] mt-0.5">+62 812 345 678</p>
        </motion.a>
        <motion.div
          whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,103,103,0.12)" }}
          className="bg-white rounded-2xl p-5 border border-[#d8e4ed] text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f3fffe] flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-[#006767]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold text-[#111d24]">Live Chat</p>
          <p className="text-xs text-[#6e7979] mt-0.5">Senin-Jumat, 09.00-17.00</p>
        </motion.div>
      </div>

      {/* Guides */}
      <div>
        <h3 className="text-base font-bold text-[#111d24] mb-3">Panduan</h3>
        <div className="grid grid-cols-2 gap-3">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,103,103,0.10)" }}
              className="bg-white rounded-2xl p-4 border border-[#d8e4ed] cursor-pointer flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {guide.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-[#111d24]">{guide.title}</p>
                <p className="text-xs text-[#6e7979] mt-0.5">{guide.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#6e7979] ml-auto flex-shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-[#d8e4ed] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-5 h-5 text-[#006767]" />
          <h3 className="text-base font-bold text-[#111d24]">Pertanyaan Umum (FAQ)</h3>
        </div>
        <div className="space-y-2">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="border border-[#d8e4ed] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f5faff] transition-colors"
              >
                <span className="text-sm font-semibold text-[#111d24] pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-[#6e7979] flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-[#6e7979] leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}