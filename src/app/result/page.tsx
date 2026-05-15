"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, Download, ArrowLeft, AlertTriangle, CheckCircle,
  BrainCircuit, Activity, Eye, Users, Star, ChevronRight,
  Microscope, Home, Stethoscope, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useAssessment } from "@/contexts/AssessmentContext";
import { generateResultsPDF } from "@/lib/pdf/generatePDF";
import type { ScoreResult, OverallClassification, DomainLevel } from "@/lib/scoring";
import type { ChildProfile } from "@/contexts/AssessmentContext";

const CLASSIFICATION_LABELS: Record<OverallClassification, Record<string, string>> = {
  low_overall:        { id: 'Rendah — Perkembangan Normal',        en: 'Low — Typical Development',          ms: 'Rendah — Perkembangan Normal',        th: 'ต่ำ — พัฒนาการปกติ',             vi: 'Thấp — Phát triển Bình thường',    fil: 'Mababa — Karaniwang Pag-unlad' },
  moderate_adhd:      { id: 'Sedang — Cenderung ADHD',             en: 'Moderate — ADHD-Leaning',           ms: 'Sederhana — ADHD',                   th: 'ปานกลาง — เอนไปทาง ADHD',         vi: 'Trung bình — Nghiêng về ADHD',      fil: 'Katamtaman — ADHD-Leaning' },
  moderate_asd:       { id: 'Sedang — Cenderung ASD',             en: 'Moderate — ASD-Leaning',            ms: 'Sederhana — ASD',                    th: 'ปานกลาง — เอนไปทาง ASD',           vi: 'Trung bình — Nghiêng về ASD',       fil: 'Katamtaman — ASD-Leaning' },
  mixed_moderate:     { id: 'Sedang — Gabungan ADHD & ASD',       en: 'Moderate — Mixed ADHD & ASD',       ms: 'Sederhana — Campuran',               th: 'ปานกลาง — ผสม',                    vi: 'Trung bình — Hỗn hợp',              fil: 'Katamtaman — Mixed' },
  high_adhd:          { id: 'Tinggi — ADHD Signifikan',           en: 'High — Significant ADHD',           ms: 'Tinggi — ADHD Signifikan',           th: 'สูง — ADHD ที่มีนัยสำคัญ',         vi: 'Cao — ADHD Đáng kể',                fil: 'Mataas — Makabuluhang ADHD' },
  high_asd:           { id: 'Tinggi — ASD Signifikan',            en: 'High — Significant ASD',            ms: 'Tinggi — ASD Signifikan',            th: 'สูง — ASD ที่มีนัยสำคัญ',           vi: 'Cao — ASD Đáng kể',                 fil: 'Mataas — Makabuluhang ASD' },
  mixed_high:         { id: 'Tinggi — Gabungan ADHD & ASD',       en: 'High — Mixed ADHD & ASD',           ms: 'Tinggi — Campuran Signifikan',        th: 'สูง — ผสมที่มีนัยสำคัญ',            vi: 'Cao — Hỗn hợp Đáng kể',             fil: 'Mataas — Makabuluhang Mixed' },
  urgent_concern:     { id: 'URGENT — Masalah Perkembangan',     en: 'URGENT — Developmental Concern',   ms: 'SEGERA — Masalah Perkembangan',       th: 'เร่งด่วน — ความกังวลพัฒนาการ',    vi: 'Khẩn cấp — Lo ngại Phát triển',     fil: 'AGAP — Developmental Concern' },
};

const CLASSIFICATION_COLORS: Record<OverallClassification, { bg: string; border: string; text: string; badge: string }> = {
  low_overall:      { bg: '#c4f0d4', border: '#007a3d', text: '#00331d', badge: 'bg-[#c4f0d4] text-[#00331d]' },
  moderate_adhd:     { bg: '#fef3c7', border: '#b45309', text: '#78350f', badge: 'bg-[#fef3c7] text-[#78350f]' },
  moderate_asd:      { bg: '#fef3c7', border: '#b45309', text: '#78350f', badge: 'bg-[#fef3c7] text-[#78350f]' },
  mixed_moderate:   { bg: '#fed7aa', border: '#c2410c', text: '#7c2d12', badge: 'bg-[#fed7aa] text-[#7c2d12]' },
  high_adhd:        { bg: '#fee2e2', border: '#b91c1c', text: '#7f1d1d', badge: 'bg-[#fee2e2] text-[#7f1d1d]' },
  high_asd:         { bg: '#fee2e2', border: '#b91c1c', text: '#7f1d1d', badge: 'bg-[#fee2e2] text-[#7f1d1d]' },
  mixed_high:       { bg: '#fca5a5', border: '#991b1b', text: '#450a0a', badge: 'bg-[#fca5a5] text-[#450a0a]' },
  urgent_concern:   { bg: '#fca5a5', border: '#7f1d1d', text: '#450a0a', badge: 'bg-[#fca5a5] text-[#450a0a]' },
};

const LEVEL_COLORS: Record<DomainLevel, { bar: string; text: string; bg: string }> = {
  low:      { bar: '#007a3d', text: '#00331d', bg: '#c4f0d4' },
  moderate: { bar: '#d97706', text: '#78350f', bg: '#fef3c7' },
  high:     { bar: '#dc2626', text: '#7f1d1d', bg: '#fee2e2' },
};

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  A: <Eye className="w-4 h-4" />,
  B: <Activity className="w-4 h-4" />,
  C: <Users className="w-4 h-4" />,
  D: <Microscope className="w-4 h-4" />,
  E: <Star className="w-4 h-4" />,
};

const DOMAIN_SHORT_LABELS: Record<string, Record<string, string>> = {
  A: { id: 'Perhatian', en: 'Attention', ms: 'Perhatian', th: 'ความสนใจ', vi: 'Chú ý', fil: 'Pansin' },
  B: { id: 'Hiperaktif', en: 'Hyperactivity', ms: 'Hiperaktif', th: 'ภาวะ hyperactivity', vi: 'Tăng động', fil: 'Hiperaktibidad' },
  C: { id: 'Sosial', en: 'Social', ms: 'Sosial', th: 'สังคม', vi: 'Xã hội', fil: 'Panlipunan' },
  D: { id: 'Sensori', en: 'Sensory', ms: 'Sensori', th: 'ประสาทสัมผัส', vi: 'Giác quan', fil: 'Sensory' },
  E: { id: 'Perkembangan', en: 'Development', ms: 'Perkembangan', th: 'พัฒนาการ', vi: 'Phát triển', fil: 'Pag-unlad' },
};

const AFTER_CARE: Record<string, Record<string, { action: string; icon: string }[]>> = {
  low_overall:      { id: [{ action: 'Lanjutkan pemantauan berkala di rumah', icon: '📅' }, { action: 'Berikan aktiviti ransangan perkembangan', icon: '🏠' }, { action: 'Jadual pediatric check-up setiap 6 bulan', icon: '👶' }], en: [{ action: 'Continue routine monitoring at home', icon: '📅' }, { action: 'Provide stimulating development activities', icon: '🏠' }, { action: 'Schedule pediatric check-up every 6 months', icon: '👶' }] },
  moderate_adhd:    { id: [{ action: 'Berkonsultasi dengan pediatrician', icon: '🩺' }, { action: 'Pertimbangkan penilaian ADHD lanjut', icon: '🧠' }, { action: 'Mulai pantau corak perhatian di rumah', icon: '📝' }, { action: 'Konsultasi psikolog klinis', icon: '💬' }], en: [{ action: 'Consult with a pediatrician', icon: '🩺' }, { action: 'Consider further ADHD assessment', icon: '🧠' }, { action: 'Begin monitoring attention patterns at home', icon: '📝' }, { action: 'Consult a clinical psychologist', icon: '💬' }] },
  moderate_asd:     { id: [{ action: 'Berkonsultasi dengan developmental pediatrician', icon: '🩺' }, { action: 'Pertimbangkan penilaian ASD lanjut', icon: '🧠' }, { action: 'Mulai catat corak sosial & sensori', icon: '📝' }, { action: 'Konsultasi psikolog klinis', icon: '💬' }], en: [{ action: 'Consult a developmental pediatrician', icon: '🩺' }, { action: 'Consider further ASD assessment', icon: '🧠' }, { action: 'Begin logging social and sensory patterns', icon: '📝' }, { action: 'Consult a clinical psychologist', icon: '💬' }] },
  mixed_moderate:   { id: [{ action: 'Berkonsultasi dengan spesialis perkembangan anak', icon: '🩺' }, { action: 'Penilaian komprehensif disyorkan', icon: '🧠' }, { action: 'Pemantauan berkala di rumah', icon: '📝' }, { action: 'Konsultasi psikolog + terapis okupasi', icon: '💬' }], en: [{ action: 'Consult a child development specialist', icon: '🩺' }, { action: 'Comprehensive assessment recommended', icon: '🧠' }, { action: 'Regular home monitoring', icon: '📝' }, { action: 'Consult psychologist + occupational therapist', icon: '💬' }] },
  high_adhd:        { id: [{ action: 'Penilaian segera oleh spesialis ADHD anak', icon: '⚡' }, { action: 'Konsultasi dengan psikolog klinis', icon: '🧠' }, { action: 'Pertimbangkan terapis perilaku', icon: '💡' }, { action: 'Jangan tunda — bertindak sekarang', icon: '⏰' }], en: [{ action: 'Prompt assessment by child ADHD specialist', icon: '⚡' }, { action: 'Consult a clinical psychologist', icon: '🧠' }, { action: 'Consider behavior therapy', icon: '💡' }, { action: 'Do not delay — act now', icon: '⏰' }] },
  high_asd:         { id: [{ action: 'Penilaian segera oleh developmental pediatrician', icon: '⚡' }, { action: 'Konsultasi dengan psikolog klinis', icon: '🧠' }, { action: 'Pertimbangkan terapis okupasi', icon: '💡' }, { action: 'Jangan tunda — bertindak sekarang', icon: '⏰' }], en: [{ action: 'Prompt assessment by developmental pediatrician', icon: '⚡' }, { action: 'Consult a clinical psychologist', icon: '🧠' }, { action: 'Consider occupational therapy', icon: '💡' }, { action: 'Do not delay — act now', icon: '⏰' }] },
  mixed_high:       { id: [{ action: 'Penilaian segera dan menyeluruh — hospital/klinik', icon: '⚡' }, { action: 'Spesialis perkembangan anak + psikolog + terapis', icon: '🧠' }, { action: 'Pertimbangkan program intervensi awal', icon: '💡' }, { action: 'Sangat disyorkan — bertindak segera', icon: '⏰' }], en: [{ action: 'Prompt and comprehensive assessment — hospital/clinic', icon: '⚡' }, { action: 'Development specialist + psychologist + therapists', icon: '🧠' }, { action: 'Consider early intervention program', icon: '💡' }, { action: 'Strongly recommended — act immediately', icon: '⏰' }] },
  urgent_concern:   { id: [{ action: 'Penilaian segera di klinik perkembangan anak', icon: '🚨' }, { action: 'Jangan tunda — berjumpa spesialis HARI INI', icon: '⚡' }, { action: 'Bawa ke hospital jika ada risiko keselamatan', icon: '🏥' }, { action: 'Hubungi psikolog klinis untuk rujukan segera', icon: '📞' }], en: [{ action: 'Immediate assessment at child development clinic', icon: '🚨' }, { action: 'Do not delay — see a specialist TODAY', icon: '⚡' }, { action: 'Go to hospital if there is safety risk', icon: '🏥' }, { action: 'Contact clinical psychologist for urgent referral', icon: '📞' }] },
};

// ─── Score Bar ────────────────────────────────────────────────────────────────

function DomainBar({ pct, level }: { pct: number; level: DomainLevel }) {
  const c = LEVEL_COLORS[level];
  return (
    <div className="h-2.5 rounded-full bg-[#d8e4ed] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: c.bar }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// ─── Domain Score Card ───────────────────────────────────────────────────────

function DomainCard({ domain, score, maxScore, pct, level, lang }: {
  domain: string; score: number; maxScore: number; pct: number; level: DomainLevel; lang: string;
}) {
  const lk = lang in DOMAIN_SHORT_LABELS.A ? lang : 'en';
  const label = DOMAIN_SHORT_LABELS[domain]?.[lk] ?? DOMAIN_SHORT_LABELS[domain]?.['en'] ?? domain;
  const c = LEVEL_COLORS[level];
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#d8e4ed] shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${c.bar}, ${c.bar}88)` }}>
            {DOMAIN_ICONS[domain]}
          </div>
          <div>
            <p className="text-sm font-bold text-[#111d24]">{label}</p>
            <p className="text-xs text-[#6e7979]">{score}/{maxScore}</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: c.bg, color: c.text }}>
          {level === 'low' ? 'Rendah' : level === 'moderate' ? 'Sedang' : 'Tinggi'}
        </span>
      </div>
      <DomainBar pct={pct} level={level} />
      <div className="flex justify-between items-center mt-1.5">
        <p className="text-xs text-[#6e7979]">Skor domain</p>
        <p className="text-sm font-bold" style={{ color: c.bar }}>{pct}%</p>
      </div>
    </div>
  );
}

// ─── AI Observation Card ─────────────────────────────────────────────────────

function ObservationItem({ obs }: { obs: { category: string; icon: string; observation: string } }) {
  return (
    <div className="flex gap-3 p-3 bg-[#f3fffe] rounded-xl border border-[#94f2f2]">
      <span className="text-xl flex-shrink-0">{obs.icon}</span>
      <div>
        <p className="text-xs font-bold text-[#006767] mb-0.5">{obs.category}</p>
        <p className="text-xs text-[#3e4949] leading-relaxed">{obs.observation}</p>
      </div>
    </div>
  );
}

// ─── Combined Score Gauge ───────────────────────────────────────────────────

function CombinedGauge({ adhd, asd, classification }: {
  adhd: number; asd: number; classification: OverallClassification;
}) {
  const colors = CLASSIFICATION_COLORS[classification];
  const adhdAngle = -180 + (adhd / 100) * 180;
  const asdAngle = -180 + (asd / 100) * 180;
  const CX = 100, CY = 90, R = 70;

  function polar(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  }
  function arc(s: number, e: number) {
    const ps = polar(s), pe = polar(e);
    const large = Math.abs(e - s) > 180 ? 1 : 0;
    return `M ${ps.x} ${ps.y} A ${R} ${R} 0 ${large} 1 ${pe.x} ${pe.y}`;
  }

  return (
    <div className="text-center">
      <p className="text-xs text-[#6e7979] mb-3">Final Combined Score</p>
      <div className="relative inline-block">
        <svg width="200" height="130" viewBox="0 0 200 140">
          <path d={arc(-180, -120)} stroke="#c4f0d4" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d={arc(-120, -60)} stroke="#fef3c7" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d={arc(-60, 0)} stroke="#fee2e2" strokeWidth="10" fill="none" strokeLinecap="round" />
          <line x1={CX} y1={CY} x2={polar(adhdAngle).x} y2={polar(adhdAngle).y}
            stroke="#006767" strokeWidth="3" strokeLinecap="round" />
          <line x1={CX} y1={CY} x2={polar(asdAngle).x} y2={polar(asdAngle).y}
            stroke="#0d8282" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3" />
          <circle cx={CX} cy={CY} r={5} fill="#006767" />
        </svg>
        <div className="flex justify-around px-4">
          <span className="text-xs text-[#007a3d] font-medium">0%</span>
          <span className="text-xs text-[#b45309] font-medium">50%</span>
          <span className="text-xs text-[#dc2626] font-medium">100%</span>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-[#006767]" />
            <span className="text-xs text-[#3e4949] font-medium">ADHD: <span className="text-[#006767] font-bold">{adhd}%</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-[#0d8282]" style={{ borderTop: '2px dashed #0d8282' }} />
            <span className="text-xs text-[#3e4949] font-medium">ASD: <span className="text-[#0d8282] font-bold">{asd}%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Specialist Badge ────────────────────────────────────────────────────────

function SpecialistBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#f3fffe] border border-[#94f2f2] rounded-xl">
      <Stethoscope className="w-4 h-4 text-[#006767] flex-shrink-0" />
      <p className="text-xs text-[#006767] font-medium">{text}</p>
    </div>
  );
}

// ─── After Care Section ─────────────────────────────────────────────────────

function AfterCareSection({ classification, lang }: { classification: OverallClassification; lang: string }) {
  const lk = lang in AFTER_CARE.low_overall ? lang : 'en';
  const items = AFTER_CARE[classification]?.[lk] ?? AFTER_CARE[classification]?.['en'] ?? [];
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#d8e4ed] shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[#006767] flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-bold text-[#111d24] text-sm">What Should Parents Do Next?</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <p className="text-xs text-[#3e4949] leading-relaxed">{item.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Results Page ─────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { lang } = useLanguage();
  const { riskLevel } = useAssessment();
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("assessment_result");
    if (stored) {
      try { setScoreResult(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const lk = lang in CLASSIFICATION_LABELS.low_overall ? lang : 'en';
  const classification: OverallClassification = scoreResult?.overallClassification ?? 'low_overall';
  const colors = CLASSIFICATION_COLORS[classification];
  const classLabel = CLASSIFICATION_LABELS[classification]?.[lk] ?? CLASSIFICATION_LABELS[classification]?.['en'] ?? classification;

  async function handlePDF() {
    setPdfLoading(true);
    try {
      await generateResultsPDF({ elementId: "results-container", filename: `SmartCareAI-Results-${Date.now()}`, onProgress: setPdfProgress });
    } catch (e) { console.error("PDF failed", e); }
    finally { setPdfLoading(false); setPdfProgress(0); }
  }

  return (
    <div className="min-h-screen bg-[#f5faff] py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Link href="/" className="p-2 rounded-xl hover:bg-[#f3fffe] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#3e4949]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold font-heading text-[#111d24]">Assessment Results</h1>
            <p className="text-xs text-[#6e7979]">SmartCare AI Screening Report</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3fffe] border border-[#94f2f2]">
            <BrainCircuit className="w-3.5 h-3.5 text-[#006767]" />
            <span className="text-xs font-medium text-[#006767]">AI-Powered</span>
          </div>
        </div>

        <div id="results-container">
          {/* Classification Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl p-5 mb-4 border text-center"
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              {classification === 'low_overall' ? (
                <CheckCircle className="w-5 h-5" style={{ color: colors.border }} />
              ) : (
                <AlertTriangle className="w-5 h-5" style={{ color: colors.border }} />
              )}
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.border }}>
                {classification === 'urgent_concern' ? '⚠️ URGENT ACTION REQUIRED' : 'Classification'}
              </span>
            </div>
            <p className="font-extrabold text-xl font-heading" style={{ color: colors.text }}>
              {classLabel}
            </p>
          </motion.div>

          {/* Combined ADHD/ASD Gauge */}
          {scoreResult ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <CombinedGauge adhd={scoreResult.finalAdhdPct} asd={scoreResult.finalAsdPct} classification={classification} />
            </motion.div>
          ) : (
            <div className="h-36 bg-white rounded-2xl animate-pulse mb-4" />
          )}

          {/* Score Breakdown */}
          {scoreResult ? (
            <div className="mt-5 space-y-3">
              <p className="text-xs font-bold text-[#6e7979] uppercase tracking-wider">Domain Breakdown</p>
              <div className="grid grid-cols-1 gap-2">
                {scoreResult.domainScores.map((ds) => (
                  <DomainCard key={ds.domain} domain={ds.domain} score={ds.score}
                    maxScore={ds.maxScore} pct={ds.percentage} level={ds.level} lang={lang} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />)}
            </div>
          )}

          {/* AI Observations */}
          {scoreResult && scoreResult.aiObservations.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#006767] flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-[#111d24]">AI Observation Summary</h3>
              </div>
              <div className="space-y-2">
                {scoreResult.aiObservations.map((obs, i) => (
                  <ObservationItem key={i} obs={obs} />
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {scoreResult && (
            <div className="mt-5">
              <div className="bg-white rounded-2xl p-4 border border-[#d8e4ed] shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#006767] flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111d24]">Recommendation</h3>
                </div>
                <p className="text-sm text-[#3e4949] leading-relaxed">{scoreResult.recommendationText}</p>
              </div>
            </div>
          )}

          {/* Specialists */}
          {scoreResult && (
            <div className="mt-4">
              <p className="text-xs font-bold text-[#6e7979] uppercase tracking-wider mb-2">Suggested Specialists</p>
              <div className="flex flex-wrap gap-2">
                <SpecialistBadge text={scoreResult.specialistsText} />
              </div>
            </div>
          )}

          {/* After Care */}
          {scoreResult && (
            <div className="mt-4">
              <AfterCareSection classification={classification} lang={lang} />
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-5 bg-[#ffecb8] border border-[#fcd34d] rounded-2xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#b45309] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#78350f] mb-0.5">Medical Disclaimer</p>
              <p className="text-xs text-[#92400e] leading-relaxed">
                SmartCareAI is an early screening support tool and does not replace professional medical diagnosis.
                Please consult qualified healthcare professionals for proper evaluation.
              </p>
            </div>
          </div>

          {/* Child Info */}
          {scoreResult?.childProfile && (
            <div className="mt-4 bg-white rounded-2xl p-4 border border-[#d8e4ed] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center text-white font-bold text-sm">
                {scoreResult.childProfile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#111d24]">{scoreResult.childProfile.name}</p>
                <p className="text-xs text-[#6e7979]">
                  {scoreResult.childProfile.age} years old
                  {scoreResult.childProfile.speechDelay === 'yes' && ' • Speech delay history'}
                  {scoreResult.childProfile.familyHistory === 'yes' && ' • Family ADHD/ASD history'}
                </p>
              </div>
              <Clock className="w-4 h-4 text-[#6e7979]" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button onClick={handlePDF} loading={pdfLoading}
            className="w-full bg-gradient-to-r from-[#006767] to-[#0d8282] hover:from-[#004d4d] hover:to-[#006767] text-white shadow-md">
            <Download className="w-4 h-4" />
            {pdfLoading ? `Generating... ${pdfProgress}%` : 'Download Report (PDF)'}
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full border-2 border-[#d8e4ed] text-[#3e4949] hover:border-[#006767] hover:text-[#006767]">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-[#BDBDBD] mt-6">SmartCareAI — Early Screening Support Tool</p>
      </div>
    </div>
  );
}
