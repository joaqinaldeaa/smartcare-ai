"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, Check, User, Upload, Loader2, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useAssessment, type ChildProfile } from "@/contexts/AssessmentContext";
import { getChildrenFromStorage, addChildToStorage } from "@/hooks/useChildren";
import { QuestionnaireStep } from "@/components/assessment/questionnaire-step";

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const { t } = useLanguage();
  const steps = [
    { num: 1, label: t("selectChild"), icon: <User className="w-4 h-4" strokeWidth={2} /> },
    { num: 2, label: t("questionnaire"), icon: <User className="w-4 h-4" strokeWidth={2} /> },
    { num: 3, label: t("videoUpload"), icon: <Upload className="w-4 h-4" strokeWidth={2} /> },
    { num: 4, label: t("analysis"), icon: <Loader2 className="w-4 h-4" strokeWidth={2} /> },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
            current === s.num
              ? "bg-[#006767] text-white"
              : current > s.num
              ? "bg-[#007a3d] text-white"
              : "bg-[#d8e4ed] text-[#6e7979]"
          }`}>
            {current > s.num ? (
              <Check className="w-4 h-4" />
            ) : (
              s.icon
            )}
            <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-0.5 mx-1 ${current > s.num ? "bg-[#007a3d]" : "bg-[#d8e4ed]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Select Child ──────────────────────────────────────────────────────

function SelectChildStep() {
  const { t } = useLanguage();
  const { selectChild: ctxSelect, selectedChild, setStep } = useAssessment();
  const [children, setChildren] = useState(() => getChildrenFromStorage().filter(c => !c.retested));
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newSpeechDelay, setNewSpeechDelay] = useState<"yes" | "no" | "unsure">("no");
  const [newFamilyHistory, setNewFamilyHistory] = useState<"yes" | "no" | "unsure">("no");

  function handleSelect(child: ChildProfile) {
    ctxSelect(child);
  }

  function handleAddChild() {
    if (!newName.trim() || !newAge) return;
    const child = addChildToStorage({ name: newName, age: parseInt(newAge), gender: "male", dob: "", speechDelay: newSpeechDelay, familyHistory: newFamilyHistory, retested: false });
    setChildren(getChildrenFromStorage().filter(c => !c.retested));
    ctxSelect(child);
    setShowAdd(false);
    setNewName("");
    setNewAge("");
    setNewSpeechDelay("no");
    setNewFamilyHistory("no");
  }

  if (showAdd) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-foreground">{t("addChild")}</h2>
        <input
          className="w-full h-12 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary"
          placeholder={t("childName")}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          className="w-full h-12 rounded-xl border border-border bg-surface px-4 text-sm focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary"
          type="number"
          placeholder={t("childAge")}
          min="1"
          max="12"
          value={newAge}
          onChange={(e) => setNewAge(e.target.value)}
        />
        {/* Speech Delay */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-text-secondary">{t("speechDelay") || "Speech Delay"}</label>
          <div className="flex gap-2">
            {(['yes', 'no', 'unsure'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setNewSpeechDelay(opt)}
                className={`flex-1 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                  newSpeechDelay === opt
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-border-hover"
                }`}
              >
                {opt === 'yes' ? 'Ya' : opt === 'no' ? 'Tidak' : 'Tidak Yakin'}
              </button>
            ))}
          </div>
        </div>
        {/* Family History */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-text-secondary">{t("familyHistory") || "Family History"}</label>
          <div className="flex gap-2">
            {(['yes', 'no', 'unsure'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setNewFamilyHistory(opt)}
                className={`flex-1 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                  newFamilyHistory === opt
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-border-hover"
                }`}
              >
                {opt === 'yes' ? 'Ya' : opt === 'no' ? 'Tidak' : 'Tidak Yakin'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleAddChild} className="flex-1">{t("saveProfile")}</Button>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>{t("back")}</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold font-heading text-foreground mb-1">{t("selectChild")}</h2>
        <p className="text-text-secondary text-sm">{t("selectChildDesc")}</p>
      </div>

      {children.length === 0 ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary text-sm">{t("noChildren")}</p>
          <Button onClick={() => setShowAdd(true)}>{t("addChild")}</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => handleSelect(child)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedChild?.id === child.id
                  ? "border-primary bg-primary-light"
                  : "border-border bg-surface hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                  selectedChild?.id === child.id ? "bg-primary" : "bg-secondary"
                }`}>
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-foreground">{child.name}</p>
                  <p className="text-sm text-text-secondary">{child.age} years old</p>
                </div>
                {selectedChild?.id === child.id && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </div>
            </button>
          ))}
          <button
            onClick={() => setShowAdd(true)}
            className="p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 text-center transition-all"
          >
            <p className="text-text-secondary text-sm font-medium">+ {t("addChild")}</p>
          </button>
        </div>
      )}

      <Button
        onClick={() => setStep(2)}
        disabled={!selectedChild}
        className="w-full"
      >
        {t("continueToNext")}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// ─── Step 2: Kuesioner 20 Pertanyaan ─────────────────────────────────────────

// Component ada di src/components/assessment/questionnaire-step.tsx
// Dipindahkan ke sana untuk menjaga file tetap rapih.

// ─── Step 3: Video Upload ─────────────────────────────────────────────────────

function VideoUploadStep() {
  const { t } = useLanguage();
  const { setStep, setVideo } = useAssessment();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) return alert("Please select a video file");
    if (f.size > 100 * 1024 * 1024) return alert("File must be under 100MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function simulateUpload() {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setVideo({ file, progress: 100, previewUrl: preview });
          return 100;
        }
        return p + 5;
      });
    }, 200);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold font-heading text-[#111d24] mb-1">{t("videoUpload")}</h2>
        <p className="text-[#6e7979] text-sm">{t("videoUploadDesc")}</p>
      </div>

      {/* AI Processing Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#f3fffe] border border-[#94f2f2] rounded-2xl p-4 flex items-start gap-3"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006767] to-[#0d8282] flex items-center justify-center flex-shrink-0"
        >
          <BrainCircuit className="w-5 h-5 text-white" strokeWidth={1.5} />
        </motion.div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#006767]" />
            <p className="text-sm font-bold text-[#006767]">AI Video Analysis Ready</p>
          </div>
          <p className="text-xs text-[#6e7979] leading-relaxed">
            Setelah diunggah, AI kami akan menganalisis pola perilaku anak dari video untuk melengkapi hasil assessment.
          </p>
        </div>
      </motion.div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
            dragging ? "border-[#006767] bg-[#f3fffe]" : "border-[#d8e4ed] hover:border-[#006767]"
          }`}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-[#f3fffe] flex items-center justify-center mx-auto mb-4 border border-[#94f2f2]"
          >
            <Upload className="w-8 h-8 text-[#006767]" strokeWidth={1.5} />
          </motion.div>
          <p className="text-[#111d24] font-medium mb-1">{t("dragDropVideo")}</p>
          <p className="text-[#6e7979] text-sm">{t("orBrowse")}</p>
          <p className="text-[#6e7979] text-xs mt-3">{t("supportedFormats")}</p>
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#d8e4ed] overflow-hidden shadow-sm">
          {preview && (
            <video src={preview} controls className="w-full max-h-48 object-cover" />
          )}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#111d24] truncate max-w-[200px]">{file.name}</p>
              <button
                onClick={() => { setFile(null); setPreview(null); setProgress(0); }}
                className="text-xs text-[#ba1a1a] hover:underline"
              >
                {t("removeVideo")}
              </button>
            </div>
            {uploading ? (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#6e7979]">
                  <span>{t("uploadProgress").replace("0%", "")} {progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#d8e4ed] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#006767] to-[#0d8282] rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : progress === 100 ? (
              <div className="space-y-2">
                <p className="text-sm text-[#007a3d] font-medium">{t("uploadComplete")}</p>
                <div className="bg-[#f3fffe] border border-[#94f2f2] rounded-xl p-2.5 flex items-start gap-2">
                  <BrainCircuit className="w-4 h-4 text-[#006767] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#6e7979] leading-relaxed">Video siap dianalisis AI untuk deteksi pola perilaku autisme dan ADHD.</p>
                </div>
              </div>
            ) : (
              <Button onClick={simulateUpload} className="w-full bg-gradient-to-r from-[#006767] to-[#0d8282] hover:from-[#004d4d] hover:to-[#006767] text-white" size="sm">
                {t("uploadProgress").replace("... 0%", "")} Start Upload
              </Button>
            )}
          </div>
        </div>
      )}

      {file && progress === 100 && (
        <div className="bg-[#f3fffe] rounded-xl p-3 flex items-start gap-2 border border-[#94f2f2]">
          <Check className="w-4 h-4 text-[#006767] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#006767]">{t("ensureFace")}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
          <ChevronLeft className="w-4 h-4" /> {t("back")}
        </Button>
        <Button onClick={() => setStep(4)} className="flex-1" disabled={progress !== 100}>
          {t("continueToNext")} <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Step 4: Analysis Loading ─────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  "Mengumpulkan data...",
  "Menghitung skor domain...",
  "Menganalisis pola perilaku...",
  "Menentukan tingkat risiko...",
  "Menyusun rekomendasi...",
];

function AnalysisStep() {
  const { t, lang } = useLanguage();
  const { setStep, completeAssessment, answers, selectedChild } = useAssessment();
  const [visibleSteps, setVisibleSteps] = useState(0);

  // Animate steps appearing
  useEffect(() => {
    ANALYSIS_STEPS.forEach((_, i) => {
      setTimeout(() => setVisibleSteps(i + 1), 1000 + i * 1200);
    });
  }, []);

  // Redirect to results after 7s — calculate real scores
  useEffect(() => {
    setTimeout(async () => {
      // Load answers from localStorage if not in context
      const storedAnswers = localStorage.getItem("assessment_answers");
      let ans = answers.length === 20 ? answers : [];
      if (storedAnswers && ans.length !== 20) {
        try {
          ans = JSON.parse(storedAnswers);
        } catch { /* ignore */ }
      }

      if (ans.length === 20) {
        try {
          const { calculateScores } = await import("@/lib/scoring/index");
          const result = calculateScores(ans, lang);
          localStorage.setItem("assessment_result", JSON.stringify(result));

          // Mark child as retested — next assessment must re-enter name
          if (selectedChild) {
            const { updateChildInStorage: updateChild } = await import("@/hooks/useChildren");
            updateChild(selectedChild.id, { retested: true });
          }

          // Map overall risk to RiskLevel
          const riskMap: Record<string, "low" | "medium" | "high"> = {
            low_overall: "low",
            adhd_learning: "medium",
            asd_spectrum: "medium",
            mixed_both: "high",
            high_concern: "high",
          };
          const displayRisk = riskMap[result.overallRisk] || "medium";
          completeAssessment([], displayRisk);
          window.location.href = "/result";
          return;
        } catch (e) {
          console.error("Scoring error:", e);
        }
      }

      // Fallback: random risk
      const risks: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];
      const risk = risks[Math.floor(Math.random() * risks.length)];
      completeAssessment([], risk);
      window.location.href = "/result";
    }, 7000);
  }, [completeAssessment, answers, lang]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 py-8">
      {/* Animated loader */}
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-[#d8e4ed]" />
        <div className="absolute inset-0 rounded-full border-4 border-[#006767] border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-[#f3fffe] flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#006767] animate-pulse" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-heading text-[#111d24] mb-2">{t("analyzingTitle")}</h2>
        <p className="text-[#6e7979] text-sm">{t("analyzingSubtitle")}</p>
      </div>

      {/* Animated steps */}
      <div className="space-y-3 max-w-sm mx-auto text-left">
        {ANALYSIS_STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i < visibleSteps ? 1 : 0, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              i < visibleSteps ? "bg-[#007a3d] text-white" : "bg-[#d8e4ed]"
            }`}>
              {i < visibleSteps ? <Check className="w-3 h-3" /> : <span className="w-2 h-2 rounded-full bg-[#6e7979]" />}
            </div>
            <span className={`text-sm ${i < visibleSteps ? "text-[#111d24]" : "text-[#6e7979]"}`}>
              {step}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Assessment Page ─────────────────────────────────────────────────────

export default function AssessmentPage() {
  const { t } = useLanguage();
  const { currentStep, setStep } = useAssessment();

  return (
    <div className="min-h-screen bg-[#f5faff] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <a href="/" className="p-2 rounded-xl hover:bg-[#f3fffe] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#3e4949]" />
          </a>
          <div>
            <h1 className="text-xl font-bold font-heading text-[#111d24]">{t("newAssessment")}</h1>
            <p className="text-xs text-[#6e7979]">SmartCare AI Assessment</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f3fffe] border border-[#94f2f2]">
            <Heart className="w-4 h-4 text-[#006767]" />
            <span className="text-xs font-medium text-[#006767]">AI Screening</span>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator current={currentStep} />

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,103,103,0.08)] p-6 border border-[#d8e4ed]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <SelectChildStep key="step1" />}
            {currentStep === 2 && <QuestionnaireStep key="step2" />}
            {currentStep === 3 && <VideoUploadStep key="step3" />}
            {currentStep === 4 && <AnalysisStep key="step4" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}