"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowRight,
  Shield,
  BrainCircuit,
  Users,
  Star,
  CheckCircle,
  ChevronRight,
  Play,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <BrainCircuit className="w-7 h-7" strokeWidth={1.5} />,
      titleKey: "feature1Title",
      descKey: "feature1Desc",
      accent: "teal",
    },
    {
      icon: <Users className="w-7 h-7" strokeWidth={1.5} />,
      titleKey: "feature2Title",
      descKey: "feature2Desc",
      accent: "brown",
    },
    {
      icon: <Shield className="w-7 h-7" strokeWidth={1.5} />,
      titleKey: "feature3Title",
      descKey: "feature3Desc",
      accent: "deep-teal",
    },
  ];

  const steps = [
    {
      num: 1,
      icon: <Play className="w-5 h-5" strokeWidth={2} />,
      titleKey: "interview",
      descKey: "interviewDesc",
    },
    {
      num: 2,
      icon: <Activity className="w-5 h-5" strokeWidth={2} />,
      titleKey: "uploadVideo",
      descKey: "uploadVideoDesc",
    },
    {
      num: 3,
      icon: <CheckCircle className="w-5 h-5" strokeWidth={2} />,
      titleKey: "getReport",
      descKey: "getReportDesc",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5faff] overflow-x-hidden">
      {/* Blob background layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full opacity-30 animate-blob" style={{ background: "radial-gradient(circle, #006767 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-16 w-[500px] h-[500px] rounded-full opacity-20 animate-blob" style={{ background: "radial-gradient(circle, #0d8282 0%, transparent 70%)", animationDelay: "2s" }} />
        <div className="absolute -bottom-24 left-1/4 w-[400px] h-[400px] rounded-full opacity-15 animate-blob" style={{ background: "radial-gradient(circle, #006767 0%, transparent 70%)", animationDelay: "4s" }} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#d8e4ed]">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-[#111d24]">SmartCare</span>
              <span className="font-heading font-extrabold text-lg text-[#006767]">AI</span>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#3e4949] hover:text-[#006767] transition-colors">{t("features")}</a>
            <a href="#how-it-works" className="text-sm font-medium text-[#3e4949] hover:text-[#006767] transition-colors">{t("howItWorks")}</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#3e4949] hover:text-[#006767] hover:bg-[#f3fffe]">
                {t("login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-[#006767] to-[#0d8282] hover:from-[#004d4d] hover:to-[#006767] text-white shadow-md">
                {t("signUp")} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Split layout (left text, right asset) */}
      <section className="relative pt-20 pb-28 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f3fffe] border border-[#94f2f2] mb-6"
            >
              <Star className="w-3.5 h-3.5 text-[#006767]" strokeWidth={2} />
              <span className="text-xs font-semibold text-[#006767]">HIPAA Compliant &bull; AI Screening</span>
            </motion.div>

            <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-[#111d24] leading-tight tracking-tight mb-5">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-[#3e4949] leading-relaxed mb-8 max-w-[50ch]">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/assessment">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(0,103,103,0.30)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#006767] to-[#0d8282] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base"
                >
                  <Heart className="w-5 h-5" strokeWidth={2} />
                  {t("startScreening")}
                </motion.button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-4 border-2 border-[#d8e4ed] text-[#3e4949] hover:border-[#006767] hover:bg-[#f3fffe] rounded-2xl text-base font-semibold flex items-center gap-2">
                  {t("howItWorks")} <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8 text-xs text-[#6e7979]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#007a3d]" strokeWidth={2} /> HIPAA Compliant
              </span>
              <span>Aman & Privat</span>
              <span>AI-Powered</span>
            </div>
          </motion.div>

          {/* Hero visual — floating phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#006767]/20 to-[#0d8282]/10 rounded-full blur-3xl scale-110" />

              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white rounded-[2.5rem] shadow-2xl p-3 border border-[#d8e4ed]"
              >
                <div className="bg-gradient-to-br from-[#f5faff] to-white rounded-[2rem] p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#111d24]">SmartCare AI</p>
                      <p className="text-xs text-[#6e7979]">Assessment</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 rounded-full bg-[#d8e4ed] overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#006767] to-[#0d8282] rounded-full"
                        animate={{ width: ["55%", "72%", "88%"] }}
                        transition={{ duration: 3.5, repeat: Infinity }}
                      />
                    </div>
                    <div className="bg-[#f3fffe] rounded-xl p-4 space-y-2">
                      <p className="text-xs text-[#006767] font-medium">Question 12 of 20</p>
                      <p className="text-sm font-semibold text-[#111d24] leading-snug">How often does your child seem unable to stay still or calm?</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["Never", "Rarely", "Sometimes", "Often"].map((opt, i) => (
                          <motion.div
                            key={opt}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-lg p-2.5 text-center text-xs font-semibold border border-[#d8e4ed] text-[#111d24]"
                          >
                            {opt}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-lg px-4 py-3 border border-[#d8e4ed]"
              >
                <p className="text-xs font-bold text-[#111d24]">AI Analysis</p>
                <p className="text-xs text-[#007a3d] font-semibold">Accurate Screening</p>
              </motion.div>

              {/* Second floating badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-lg px-4 py-3 border border-[#d8e4ed]"
              >
                <p className="text-xs font-bold text-[#111d24]">Privacy First</p>
                <p className="text-xs text-[#006767] font-semibold">HIPAA Compliant</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 lg:px-8 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-extrabold font-heading text-[#111d24] tracking-tight mb-3">{t("howItWorks")}</h2>
            <p className="text-[#6e7979]">3 langkah mudah untuk screening awal</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-6 border border-[#d8e4ed] hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center text-white mb-5 shadow-md group-hover:shadow-lg transition-shadow">
                  {step.icon}
                </div>
                <h3 className="font-bold text-[#111d24] mb-1">{t(step.titleKey as string)}</h3>
                <p className="text-sm text-[#6e7979]">{t(step.descKey as string)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-extrabold font-heading text-[#111d24] tracking-tight mb-3">{t("features")}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                onHoverStart={() => setHoveredFeature(i)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="bg-white rounded-3xl p-6 border border-[#d8e4ed] hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-md transition-shadow ${
                  f.accent === "teal" ? "bg-gradient-to-br from-[#006767] to-[#0d8282] text-white" :
                  f.accent === "brown" ? "bg-gradient-to-br from-[#006767] to-[#004d4d] text-white" :
                  "bg-gradient-to-br from-[#0d8282] to-[#006767] text-white"
                }`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#111d24] mb-1">{t(f.titleKey as string)}</h3>
                <p className="text-sm text-[#6e7979] leading-relaxed">{t(f.descKey as string)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-br from-[#006767] to-[#0d8282] rounded-[2rem] p-10 text-center text-white shadow-2xl shadow-[#006767]/20"
          >
            <Heart className="w-10 h-10 mx-auto mb-4 opacity-80" strokeWidth={1.5} />
            <h2 className="text-3xl font-extrabold font-heading mb-3">Mulai Deteksi Dini Hari Ini</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Lindungi masa depan si kecil dengan screening berbasis AI yang aman dan akurat.
            </p>
            <Link href="/assessment">
              <Button className="bg-white text-[#006767] hover:bg-white/90 font-bold px-8 py-4 text-base rounded-2xl shadow-lg">
                <Heart className="w-5 h-5 mr-2" strokeWidth={2} />
                {t("startScreening")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111d24] text-white/60 py-10 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006767]/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#006767]" strokeWidth={2} />
            </div>
            <span className="font-heading font-bold text-white">SmartCareAI</span>
          </div>
          <p className="text-xs">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4 text-xs">
            <span>{t("footer.terms")}</span>
            <Link href="/privacy" className="hover:text-white transition-colors">{t("privacy")}</Link>
          </div>
        </div>
        <div className="text-center mt-4 text-xs text-white/30">{t("madeWith")}</div>
      </footer>
    </div>
  );
}
