"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Download, ArrowLeft, AlertTriangle, CheckCircle, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useAssessment, type RiskLevel } from "@/contexts/AssessmentContext";
import { generateResultsPDF } from "@/lib/pdf/generatePDF";
import type { ScoreResult } from "@/lib/scoring";

// ─── Risk Gauge ───────────────────────────────────────────────────────────────

function RiskGauge({ level }: { level: RiskLevel }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const riskColors: Record<RiskLevel, { color: string; bg: string; textColor: string; label: string }> = {
    low: { color: "#007a3d", bg: "#c4f0d4", textColor: "#00331d", label: "Risiko Rendah" },
    medium: { color: "#7c5700", bg: "#ffecb8", textColor: "#3d2c00", label: "Risiko Sedang" },
    high: { color: "#ba1a1a", bg: "#ffdad6", textColor: "#410002", label: "Risiko Tinggi" },
  };

  const risk = riskColors[level];
  const R = 100;
  const CX = 120;
  const CY = 110;

  function polarToXY(angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  }

  function arcPath(start: number, end: number) {
    const s = polarToXY(start);
    const e = polarToXY(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const needleAngle = level === "low" ? -170 : level === "medium" ? -100 : -55;
  const needleTip = polarToXY(animated ? needleAngle : -180);

  return (
    <div className="text-center">
      <p className="text-sm text-[#6e7979] mb-4">Tingkat Risiko</p>
      <div className="relative inline-block">
        <svg width="240" height="140" viewBox="0 0 240 160">
          <path d={arcPath(-180, -120)} stroke="#c4f0d4" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d={arcPath(-120, -60)} stroke="#ffecb8" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d={arcPath(-60, 0)} stroke="#ffdad6" strokeWidth="12" fill="none" strokeLinecap="round" />
          <line
            x1={CX} y1={CY}
            x2={needleTip.x} y2={needleTip.y}
            stroke={risk.color}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              transform: `rotate(${animated ? needleAngle + 180 : 0}deg)`,
              transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
          <circle cx={CX} cy={CY} r={6} fill={risk.color} />
        </svg>
        <div className="flex justify-between px-4 mt-1">
          <span className="text-xs text-[#007a3d] font-medium">Rendah</span>
          <span className="text-xs text-[#7c5700] font-medium">Sedang</span>
          <span className="text-xs text-[#ba1a1a] font-medium">Tinggi</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold"
        style={{ background: risk.bg, color: risk.textColor }}
      >
        {level === "low" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        {risk.label}
      </motion.div>
    </div>
  );
}

// ─── Domain Score Card ───────────────────────────────────────────────────────

const DOMAIN_META: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  A: { color: "from-[#006767] to-[#0d8282]", bg: "bg-[#f3fffe]", label: "Perhatian & Organisasi", icon: "🎯" },
  B: { color: "from-[#0d8282] to-[#006767]", bg: "bg-[#f3fffe]", label: "Hiperaktivitas & Impulsivitas", icon: "⚡" },
  C: { color: "from-[#26A69A] to-[#00897B]", bg: "bg-[#E0F2F1]", label: "Komunikasi & Sensori", icon: "🗣️" },
  D: { color: "from-[#7d5539] to-[#6a472f]", bg: "bg-[#FFF3E0]", label: "Perkembangan Umum", icon: "📚" },
};

const LEVEL_COLORS: Record<string, string> = {
  low: "text-[#007a3d]",
  moderate: "text-[#7c5700]",
  high: "text-[#ba1a1a]",
};
const LEVEL_BG: Record<string, string> = {
  low: "bg-[#c4f0d4] text-[#00331d]",
  moderate: "bg-[#ffecb8] text-[#3d2c00]",
  high: "bg-[#ffdad6] text-[#410002]",
};
const LEVEL_BAR: Record<string, string> = {
  low: "bg-[#007a3d]",
  moderate: "bg-[#7c5700]",
  high: "bg-[#ba1a1a]",
};

function DomainCard({ domain, score, maxScore, level, index }: { domain: string; score: number; maxScore: number; level: string; index: number }) {
  const meta = DOMAIN_META[domain] || { color: "from-gray-400 to-gray-500", bg: "bg-gray-50", label: domain, icon: "📋" };
  const pct = Math.round((score / maxScore) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.12 }}
      className="bg-white rounded-2xl p-4 border border-[#d8e4ed] shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
            <span className="text-white text-sm">{meta.icon}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#111d24]">{meta.label}</p>
            <p className="text-xs text-[#6e7979]">Domain {domain} · {score}/{maxScore}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${LEVEL_BG[level] || LEVEL_BG.low}`}>
          {level === "low" ? "Rendah" : level === "moderate" ? "Sedang" : "Tinggi"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#d8e4ed] overflow-hidden mb-1">
        <motion.div
          className={`h-full rounded-full ${LEVEL_BAR[level] || LEVEL_BAR.low}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.7 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="text-right text-xs text-[#6e7979]">{pct}%</p>
    </motion.div>
  );
}

// ─── Recommendation Card ─────────────────────────────────────────────────────

function RecommendationCard({ text, risk }: { text: string; risk: string }) {
  const isHigh = risk === "high_concern" || risk === "high";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1 }}
      className={`rounded-2xl p-4 flex gap-3 border ${
        isHigh ? "bg-[#ffdad6] border-[#ffb4ab]" : "bg-[#f3fffe] border-[#94f2f2]"
      }`}
    >
      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHigh ? "text-[#ba1a1a]" : "text-[#006767]"}`} />
      <div>
        <p className={`text-sm font-bold mb-1 ${isHigh ? "text-[#410002]" : "text-[#111d24]"}`}>
          {isHigh ? "Rekomendasi Tinggi" : "Rekomendasi"}
        </p>
        <p className="text-xs text-[#6e7979] leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Results Page ─────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { lang } = useLanguage();
  const { answers, riskLevel } = useAssessment();
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  // Load score result from localStorage or calculate
  useEffect(() => {
    const stored = localStorage.getItem("assessment_result");
    if (stored) {
      try {
        setScoreResult(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const displayRisk: RiskLevel = riskLevel || "medium";

  async function handlePDF() {
    setPdfLoading(true);
    try {
      await generateResultsPDF({
        elementId: "results-container",
        filename: `SmartCare-Results-${Date.now()}`,
        onProgress: setPdfProgress,
      });
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      setPdfLoading(false);
      setPdfProgress(0);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5faff] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 rounded-xl hover:bg-[#f3fffe] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#3e4949]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111d24]">Hasil Assessment</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f3fffe] border border-[#94f2f2]">
            <BrainCircuit className="w-4 h-4 text-[#006767]" />
            <span className="text-xs font-medium text-[#006767]">AI Analysis</span>
          </div>
        </div>

        <div id="results-container">
          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,103,103,0.08)] p-6 mb-4 border border-[#d8e4ed]">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c4f0d4] text-[#00331d] text-xs font-medium mb-3">
                <CheckCircle className="w-3.5 h-3.5" />
                Hasil Assessment
              </span>
            </div>

            <RiskGauge level={displayRisk} />
            <div className="my-6 border-t border-[#d8e4ed]" />

            {/* Domain Score Cards */}
            {scoreResult ? (
              <div className="space-y-3">
                {scoreResult.domainScores.map((ds, i) => (
                  <DomainCard
                    key={ds.domain}
                    domain={ds.domain}
                    score={ds.score}
                    maxScore={ds.maxScore}
                    level={ds.level}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {["A", "B", "C", "D"].map((d, i) => (
                  <div key={d} className="bg-[#F9F9F9] rounded-2xl p-4 h-20 animate-pulse" />
                ))}
              </div>
            )}

            {/* Overall recommendation */}
            {scoreResult && (
              <div className="mt-4">
                <RecommendationCard text={scoreResult.recommendationText} risk={scoreResult.overallRisk} />
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-[#ffecb8] border border-[#fcd34d] rounded-2xl p-4 flex gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#7c5700] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#3d2c00] mb-1">Catatan Penting</p>
              <p className="text-xs text-[#6e7979] leading-relaxed">
                Hasil ini BUKAN diagnosis medis resmi. Harap gunakan laporan ini sebagai rujukan awal untuk berkonsultasi dengan Dokter Spesialis Anak atau Psikolog.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handlePDF}
            loading={pdfLoading}
            className="w-full bg-gradient-to-r from-[#006767] to-[#0d8282] hover:from-[#004d4d] hover:to-[#006767] text-white shadow-md"
          >
            <Download className="w-4 h-4" />
            {pdfLoading ? `Membuat PDF... ${pdfProgress}%` : "Unduh Laporan (PDF)"}
          </Button>
          <Link href="/">
            <Button variant="secondary" className="w-full border-2 border-[#d8e4ed] text-[#3e4949] hover:border-[#006767] hover:text-[#006767]">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-[#BDBDBD] mt-6">Dibuat dengan ❤️ untuk anak-anak</p>
      </div>
    </div>
  );
}