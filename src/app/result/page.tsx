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
    low: { color: "#10B981", bg: "#D1FAE5", textColor: "#065F46", label: "Risiko Rendah" },
    medium: { color: "#F59E0B", bg: "#FEF3C7", textColor: "#92400E", label: "Risiko Sedang" },
    high: { color: "#EF4444", bg: "#FEE2E2", textColor: "#991B1B", label: "Risiko Tinggi" },
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
      <p className="text-sm text-[#6B7280] mb-4">Tingkat Risiko</p>
      <div className="relative inline-block">
        <svg width="240" height="140" viewBox="0 0 240 160">
          <path d={arcPath(-180, -120)} stroke="#D1FAE5" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d={arcPath(-120, -60)} stroke="#FEF3C7" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d={arcPath(-60, 0)} stroke="#FEE2E2" strokeWidth="12" fill="none" strokeLinecap="round" />
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
          <span className="text-xs text-[#10B981] font-medium">Rendah</span>
          <span className="text-xs text-[#F59E0B] font-medium">Sedang</span>
          <span className="text-xs text-[#EF4444] font-medium">Tinggi</span>
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
  A: { color: "from-[#FF8A65] to-[#FF7043]", bg: "bg-[#FFF0E8]", label: "Perhatian & Organisasi", icon: "🎯" },
  B: { color: "from-[#FF7043] to-[#FF5722]", bg: "bg-[#FFF3E0]", label: "Hiperaktivitas & Impulsivitas", icon: "⚡" },
  C: { color: "from-[#26A69A] to-[#00897B]", bg: "bg-[#E0F2F1]", label: "Komunikasi & Sensori", icon: "🗣️" },
  D: { color: "from-[#7C3AED] to-[#6D28D9]", bg: "bg-[#F5F3FF]", label: "Perkembangan Umum", icon: "📚" },
};

const LEVEL_COLORS: Record<string, string> = {
  low: "text-[#10B981]",
  moderate: "text-[#F59E0B]",
  high: "text-[#EF4444]",
};
const LEVEL_BG: Record<string, string> = {
  low: "bg-[#D1FAE5] text-[#065F46]",
  moderate: "bg-[#FEF3C7] text-[#92400E]",
  high: "bg-[#FEE2E2] text-[#991B1B]",
};
const LEVEL_BAR: Record<string, string> = {
  low: "bg-[#10B981]",
  moderate: "bg-[#F59E0B]",
  high: "bg-[#EF4444]",
};

function DomainCard({ domain, score, maxScore, level, index }: { domain: string; score: number; maxScore: number; level: string; index: number }) {
  const meta = DOMAIN_META[domain] || { color: "from-gray-400 to-gray-500", bg: "bg-gray-50", label: domain, icon: "📋" };
  const pct = Math.round((score / maxScore) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.12 }}
      className="bg-white rounded-2xl p-4 border border-[#FFE0B2] shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
            <span className="text-white text-sm">{meta.icon}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1E1B4B]">{meta.label}</p>
            <p className="text-xs text-[#6B7280]">Domain {domain} · {score}/{maxScore}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${LEVEL_BG[level] || LEVEL_BG.low}`}>
          {level === "low" ? "Rendah" : level === "moderate" ? "Sedang" : "Tinggi"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#F0F0F0] overflow-hidden mb-1">
        <motion.div
          className={`h-full rounded-full ${LEVEL_BAR[level] || LEVEL_BAR.low}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.7 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="text-right text-xs text-[#6B7280]">{pct}%</p>
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
        isHigh ? "bg-[#FEE2E2] border-[#FCA5A5]" : "bg-[#FEF7F0] border-[#FFE0B2]"
      }`}
    >
      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHigh ? "text-[#EF4444]" : "text-[#FF8A65]"}`} />
      <div>
        <p className={`text-sm font-bold mb-1 ${isHigh ? "text-[#991B1B]" : "text-[#3E2723]"}`}>
          {isHigh ? "Rekomendasi Tinggi" : "Rekomendasi"}
        </p>
        <p className="text-xs text-[#6B7280] leading-relaxed">{text}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-[#FEF7F0] to-[#FFF0E8] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 rounded-xl hover:bg-white/60 transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#8D6E63]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#3E2723]">Hasil Assessment</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF0E8] border border-[#FFE0B2]">
            <BrainCircuit className="w-4 h-4 text-[#FF8A65]" />
            <span className="text-xs font-medium text-[#8D6E63]">AI Analysis</span>
          </div>
        </div>

        <div id="results-container">
          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-4 border border-[#FFE0B2]">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1FAE5] text-[#065F46] text-xs font-medium mb-3">
                <CheckCircle className="w-3.5 h-3.5" />
                Hasil Assessment
              </span>
            </div>

            <RiskGauge level={displayRisk} />
            <div className="my-6 border-t border-[#FFE0B2]" />

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
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-4 flex gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#92400E] mb-1">Catatan Penting</p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
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
            className="w-full bg-gradient-to-r from-[#FF8A65] to-[#FF7043] hover:from-[#FF7043] hover:to-[#FF5722] text-white shadow-md"
          >
            <Download className="w-4 h-4" />
            {pdfLoading ? `Membuat PDF... ${pdfProgress}%` : "Unduh Laporan (PDF)"}
          </Button>
          <Link href="/">
            <Button variant="secondary" className="w-full border-2 border-[#FFE0B2] text-[#8D6E63] hover:border-[#FF8A65]">
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