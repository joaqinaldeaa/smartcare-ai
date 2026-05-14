"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useAssessment } from "@/contexts/AssessmentContext";
import { QUESTIONS } from "@/lib/scoring/questions";

const DOMAIN_LABELS: Record<string, Record<string, string>> = {
  A: { id: "Domain A: Perhatian & Organisasi", en: "Domain A: Attention & Organization", ms: "Domain A: Perhatian & Organisasi", th: "โดเมน A: ความสนใจและการจัดระเบียบ", vi: "Miền A: Chú ý & Tổ chức", fil: "Domain A: Pansin at Organisasyon" },
  B: { id: "Domain B: Hiperaktivitas & Impulsivitas", en: "Domain B: Hyperactivity & Impulsivity", ms: "Domain B: Hiperaktiviti & Impulsiviti", th: "โดเมน B: ภาวะ hyperactivity และ impulsivity", vi: "Miền B: Tăng động & Impulsivity", fil: "Domain B: Hiperaktibidad at Impulsibidad" },
  C: { id: "Domain C: Komunikasi Sosial & Sensori", en: "Domain C: Social Communication & Sensory", ms: "Domain C: Komunikasi Sosial & Deria", th: "โดเมน C: การสื่อสารทางสังคมและประสาทสัมผัส", vi: "Miền C: Giao tiếp xã hội & Giác quan", fil: "Domain C: Panlipunang Komunikasyon at Sensory" },
  D: { id: "Domain D: Perkembangan Umum", en: "Domain D: General Development", ms: "Domain D: Perkembangan Umum", th: "โดเมน D: การพัฒนาทั่วไป", vi: "Miền D: Phát triển chung", fil: "Domain D: Pangkalahatang Pag-unlad" },
};

const OPTION_LABELS = ["Never", "Rarely", "Sometimes", "Often"] as const;

const OPTION_STYLES = [
  "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
];

const OPTION_BG_EMPTY = "border-[#E5E7EB] bg-white text-[#1E1B4B] hover:border-[#006767]/50";

export function QuestionnaireStep() {
  const { t, lang } = useLanguage();
  const { setStep, setAnswers } = useAssessment();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setLocalAnswers] = useState<number[]>(Array(20).fill(-1));

  const question = QUESTIONS[currentQ];
  const currentLang = (lang && ["id", "en", "ms", "th", "vi", "fil"].includes(lang)) ? lang : "id";
  const questionText = question.text[currentLang] || question.text["id"];
  const domainLabel = DOMAIN_LABELS[question.domain]?.[currentLang] || DOMAIN_LABELS[question.domain]?.["id"] || question.domain;
  const isLast = currentQ === 19;
  const selected = answers[currentQ];
  const answeredCount = answers.filter((a) => a !== -1).length;

  function handleSelect(value: number) {
    const newAnswers = [...answers];
    newAnswers[currentQ] = value;
    setLocalAnswers(newAnswers);
  }

  function handleNext() {
    if (isLast) {
      if (answers.includes(-1)) {
        alert("Please answer all 20 questions before submitting.");
        return;
      }
      setAnswers(answers);
      if (typeof window !== "undefined") {
        localStorage.setItem("assessment_answers", JSON.stringify(answers));
      }
      setStep(3);
    } else {
      setCurrentQ((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    } else {
      setStep(1);
    }
  }

  const progressPct = ((currentQ + 1) / 20) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-[#6B7280]">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-3.5 h-3.5 text-[#006767]" />
            <span>{domainLabel}</span>
          </div>
          <span>{answeredCount} / 20 answered</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#F0F0F0] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#006767] to-[#0d8282]"
            initial={{ width: `${((currentQ) / 20) * 100}%` }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Question card */}
      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#f3fffe] rounded-2xl p-5 border border-[#94f2f2]"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#006767] text-white text-xs font-bold">
            {currentQ + 1}
          </span>
          <span className="text-xs text-[#3e4949] font-medium">Question {currentQ + 1} of 20</span>
        </div>
        <h3 className="text-base font-semibold text-[#111d24] leading-relaxed mb-5">
          {questionText}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {OPTION_LABELS.map((label, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(idx)}
              className={`w-full px-4 py-3.5 rounded-xl border-2 text-left font-medium transition-all flex items-center gap-3 ${
                selected === idx
                  ? `${OPTION_STYLES[idx]} border-current shadow-sm`
                  : OPTION_BG_EMPTY
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                selected === idx ? "bg-white/80" : "bg-[#F0F0F0] text-[#3e4949]"
              }`}>
                {String.fromCharCode(97 + idx)}
              </span>
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={handlePrev}
          className="flex-1 border-2 border-[#94f2f2] text-[#3e4949] hover:border-[#006767] hover:text-[#006767]"
        >
          <ChevronLeft className="w-4 h-4" />
          {currentQ === 0 ? t("back") : "Previous"}
        </Button>
        <Button
          onClick={handleNext}
          disabled={selected === -1}
          className="flex-1 bg-gradient-to-r from-[#006767] to-[#0d8282] hover:from-[#0d8282] hover:to-[#FF5722] text-white shadow-md"
        >
          {isLast ? "Submit" : "Next"}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </motion.div>
  );
}
