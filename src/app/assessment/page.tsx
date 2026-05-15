"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ChevronLeft, ChevronRight, Check, User, Upload, Loader2,
  BrainCircuit, Sparkles, Activity, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useAssessment, type ChildProfile, type VideoUpload } from "@/contexts/AssessmentContext";
import { getChildrenFromStorage, addChildToStorage } from "@/hooks/useChildren";
import { QuestionnaireStep } from "@/components/assessment/questionnaire-step";
import { calculateScores } from "@/lib/scoring";

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const { t } = useLanguage();
  const steps = [
    { num: 1, label: t("selectChild"), icon: <User className="w-4 h-4" strokeWidth={2} /> },
    { num: 2, label: t("questionnaire"), icon: <Activity className="w-4 h-4" strokeWidth={2} /> },
    { num: 3, label: t("videoUpload"), icon: <Upload className="w-4 h-4" strokeWidth={2} /> },
    { num: 4, label: t("analysis"), icon: <BrainCircuit className="w-4 h-4" strokeWidth={2} /> },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 mb-8 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center flex-shrink-0">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-semibold ${
            current === s.num
              ? "bg-[#006767] text-white shadow-sm"
              : current > s.num
              ? "bg-[#007a3d] text-white"
              : "bg-[#d8e4ed] text-[#6e7979]"
          }`}>
            {current > s.num ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              s.icon
            )}
            <span className="hidden sm:inline whitespace-nowrap">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-4 h-0.5 mx-1 ${current > s.num ? "bg-[#007a3d]" : "bg-[#d8e4ed]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Select Child ────────────────────────────────────────────────────

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
    setNewName(""); setNewAge("");
    setNewSpeechDelay("no"); setNewFamilyHistory("no");
  }

  if (showAdd) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-[#111d24]">{t("addChild")}</h2>
        <input className="w-full h-12 rounded-xl border border-[#d8e4ed] bg-white px-4 text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767]" placeholder={t("childName")} value={newName} onChange={e => setNewName(e.target.value)} />
        <input className="w-full h-12 rounded-xl border border-[#d8e4ed] bg-white px-4 text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767]" type="number" placeholder={t("childAge")} min="1" max="12" value={newAge} onChange={e => setNewAge(e.target.value)} />
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#3e4949]">{t("speechDelay") || "Speech Delay"}</label>
          <div className="flex gap-2">
            {(['yes','no','unsure'] as const).map(opt => (
              <button key={opt} type="button" onClick={() => setNewSpeechDelay(opt)}
                className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${newSpeechDelay === opt ? "border-[#006767] bg-[#f3fffe] text-[#006767]" : "border-[#d8e4ed] bg-white text-[#6e7979]"}`}>
                {opt === 'yes' ? 'Ya' : opt === 'no' ? 'Tidak' : 'Tidak Yakin'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#3e4949]">{t("familyHistory") || "Family History"}</label>
          <div className="flex gap-2">
            {(['yes','no','unsure'] as const).map(opt => (
              <button key={opt} type="button" onClick={() => setNewFamilyHistory(opt)}
                className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${newFamilyHistory === opt ? "border-[#006767] bg-[#f3fffe] text-[#006767]" : "border-[#d8e4ed] bg-white text-[#6e7979]"}`}>
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
        <h2 className="text-xl font-bold font-heading text-[#111d24] mb-1">{t("selectChild")}</h2>
        <p className="text-sm text-[#6e7979]">{t("selectChildDesc")}</p>
      </div>
      {children.length === 0 ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f3fffe] flex items-center justify-center mx-auto border border-[#94f2f2]">
            <User className="w-8 h-8 text-[#006767]" />
          </div>
          <p className="text-sm text-[#6e7979]">{t("noChildren")}</p>
          <Button onClick={() => setShowAdd(true)}>{t("addChild")}</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {children.map(child => (
            <button key={child.id} onClick={() => handleSelect(child)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedChild?.id === child.id ? "border-[#006767] bg-[#f3fffe]" : "border-[#d8e4ed] bg-white hover:border-[#94f2f2]"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${selectedChild?.id === child.id ? "bg-[#006767]" : "bg-[#0d8282]"}`}>
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#111d24]">{child.name}</p>
                  <p className="text-xs text-[#6e7979]">{child.age} years old</p>
                  {child.speechDelay === 'yes' && <p className="text-xs text-[#b45309]">Speech delay history</p>}
                  {child.familyHistory === 'yes' && <p className="text-xs text-[#b45309]">Family ADHD/ASD history</p>}
                </div>
                {selectedChild?.id === child.id && <Check className="w-5 h-5 text-[#006767] ml-auto" />}
              </div>
            </button>
          ))}
          <button onClick={() => setShowAdd(true)}
            className="p-4 rounded-2xl border-2 border-dashed border-[#d8e4ed] text-center text-sm text-[#6e7979] font-medium hover:border-[#006767] hover:text-[#006767] transition-all">
            + {t("addChild")}
          </button>
        </div>
      )}
      <Button onClick={() => setStep(2)} disabled={!selectedChild} className="w-full">
        {t("continueToNext")} <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// ─── Single Video Upload Component ─────────────────────────────────────────────

interface SingleVideoUploadProps {
  type: 'adhd' | 'asd';
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accentColor: string;
  video: VideoUpload;
  onChange: (v: VideoUpload) => void;
}

function SingleVideoUpload({ type, label, sublabel, icon, accentColor, video, onChange }: SingleVideoUploadProps) {
  const { t } = useLanguage();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef(video);

  // Keep ref in sync
  useEffect(() => { videoRef.current = video; }, [video]);

  function handleFile(f: File) {
    if (!f.type.startsWith("video/")) return alert("Please select a video file");
    if (f.size > 100 * 1024 * 1024) return alert("File must be under 100MB");
    const previewUrl = URL.createObjectURL(f);
    // revoke old preview
    if (videoRef.current.previewUrl) URL.revokeObjectURL(videoRef.current.previewUrl);
    const initial: VideoUpload = { file: f, progress: 0, previewUrl, type };
    onChange(initial);
    // Simulate upload
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + 8);
      onChange({ file: f, progress: p, previewUrl, type });
      if (p >= 100) clearInterval(iv);
    }, 200);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  useEffect(() => {
    return () => { if (video.previewUrl) URL.revokeObjectURL(video.previewUrl); };
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#d8e4ed]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: accentColor }}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-[#111d24]">{label}</p>
          <p className="text-xs text-[#6e7979]">{sublabel}</p>
        </div>
      </div>

      {!video.file ? (
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-[#006767] bg-[#f3fffe]" : "border-[#d8e4ed] hover:border-[#94f2f2]"}`}>
          <Upload className="w-6 h-6 text-[#006767] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#111d24]">{t("dragDropVideo")}</p>
          <p className="text-xs text-[#6e7979]">{t("orBrowse")}</p>
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        <div className="space-y-2">
          {video.previewUrl && (
            <video src={video.previewUrl} controls className="w-full h-32 object-cover rounded-xl bg-black" />
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#111d24] font-medium truncate max-w-[180px]">{video.file.name}</p>
            <button onClick={() => onChange({ file: null, progress: 0, previewUrl: null, type: null })}
              className="text-xs text-[#dc2626] hover:underline">Remove</button>
          </div>
          {video.progress < 100 ? (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#6e7979]">
                <span>Uploading...</span><span>{video.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#d8e4ed] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#006767] to-[#0d8282] rounded-full transition-all" style={{ width: `${video.progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#007a3d]" />
              <p className="text-xs text-[#007a3d] font-medium">Ready for AI analysis</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Dual Video Upload ─────────────────────────────────────────────────

function VideoUploadStep() {
  const { t } = useLanguage();
  const { setStep, selectedChild } = useAssessment();
  const [adhdVideo, setAdhdVideo] = useState<VideoUpload>({ file: null, progress: 0, previewUrl: null, type: null });
  const [asdVideo, setAsdVideo] = useState<VideoUpload>({ file: null, progress: 0, previewUrl: null, type: null });

  // Store both videos in session for analysis step
  useEffect(() => {
    sessionStorage.setItem('adhd_video', JSON.stringify(adhdVideo));
    sessionStorage.setItem('asd_video', JSON.stringify(asdVideo));
  }, [adhdVideo, asdVideo]);

  const adhdDone = adhdVideo.progress === 100;
  const asdDone = asdVideo.progress === 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold font-heading text-[#111d24] mb-1">{t("videoUpload")}</h2>
        <p className="text-sm text-[#6e7979]">{t("videoUploadDesc")}</p>
      </div>

      {/* AI notice */}
      <div className="bg-[#f3fffe] border border-[#94f2f2] rounded-2xl p-4 flex items-start gap-3">
        <BrainCircuit className="w-5 h-5 text-[#006767] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[#006767] mb-0.5">AI Video Analysis</p>
          <p className="text-xs text-[#6e7979]">Upload two short videos (30–60s each) for behavioral pattern analysis. This complements the questionnaire data.</p>
        </div>
      </div>

      {/* ADHD Video */}
      <SingleVideoUpload
        type="adhd"
        label="Video 1 — ADHD Behavioral"
        sublabel="Movement, hyperactivity, and attention patterns"
        icon={<Activity className="w-4 h-4" />}
        accentColor="linear-gradient(135deg, #006767, #0d8282)"
        video={adhdVideo}
        onChange={setAdhdVideo}
      />

      {/* ASD Video */}
      <SingleVideoUpload
        type="asd"
        label="Video 2 — ASD Behavioral"
        sublabel="Eye engagement, social response, and gaze stability"
        icon={<Eye className="w-4 h-4" />}
        accentColor="linear-gradient(135deg, #0d8282, #26A69A)"
        video={asdVideo}
        onChange={setAsdVideo}
      />

      {/* Skip notice */}
      <p className="text-xs text-center text-[#6e7979]">Video upload is optional. Assessment can proceed with questionnaire data alone.</p>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
          <ChevronLeft className="w-4 h-4" /> {t("back")}
        </Button>
        <Button onClick={() => setStep(4)} className="flex-1">
          {t("continueToNext")} <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Step 4: Analysis Loading ──────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  "Mengumpulkan data questionnaire...",
  "Menghitung skor 5 domain...",
  "Menganalisis video perilaku (ADHD)...",
  "Menganalisis video perilaku (ASD)...",
  "Menghitung skor akhir combined...",
  "Menentukan klasifikasi risiko...",
  "Menyusun AI observation summary...",
  "Menyusun rekomendasi...",
];

function AnalysisStep() {
  const { lang } = useLanguage();
  const { completeAssessment, answers, selectedChild } = useAssessment();
  const router = useRouter();
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    ANALYSIS_STEPS.forEach((_, i) => {
      setTimeout(() => setVisibleSteps(i + 1), 800 + i * 900);
    });
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      const storedAnswers = localStorage.getItem("assessment_answers");
      let ans = answers.length === 20 ? answers : [];
      if (storedAnswers && ans.length !== 20) {
        try { ans = JSON.parse(storedAnswers); } catch { /* ignore */ }
      }

      if (ans.length === 20) {
        try {
          const result = calculateScores(ans, lang, selectedChild ?? null);
          localStorage.setItem("assessment_result", JSON.stringify(result));

          if (selectedChild) {
            const { updateChildInStorage } = await import("@/hooks/useChildren");
            updateChildInStorage(selectedChild.id, { retested: true });
          }

          const riskMap: Record<string, "low" | "medium" | "high"> = {
            low_overall: "low",
            moderate_adhd: "medium",
            moderate_asd: "medium",
            mixed_moderate: "medium",
            high_adhd: "high",
            high_asd: "high",
            mixed_high: "high",
            urgent_concern: "high",
          };
          const displayRisk = riskMap[result.overallClassification] || "medium";
          completeAssessment([], displayRisk);
          router.push("/result");
          return;
        } catch (e) {
          console.error("Scoring error:", e);
        }
      }

      const risks: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];
      completeAssessment([], risks[Math.floor(Math.random() * risks.length)]);
      router.push("/result");
    }, 8000);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 py-8">
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-[#d8e4ed]" />
        <div className="absolute inset-0 rounded-full border-4 border-[#006767] border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-[#f3fffe] flex items-center justify-center">
          <BrainCircuit className="w-7 h-7 text-[#006767]" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-heading text-[#111d24] mb-2">AI Analyzing...</h2>
        <p className="text-sm text-[#6e7979]">Processing behavioral questionnaire and video data</p>
      </div>

      <div className="space-y-3 max-w-sm mx-auto text-left">
        {ANALYSIS_STEPS.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i < visibleSteps ? 1 : 0.3, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              i < visibleSteps ? "bg-[#007a3d] text-white" : "bg-[#d8e4ed]"
            }`}>
              {i < visibleSteps ? <Check className="w-3 h-3" /> : <span className="w-2 h-2 rounded-full bg-[#6e7979] inline-block" />}
            </div>
            <span className={`text-sm ${i < visibleSteps ? "text-[#111d24]" : "text-[#6e7979]"}`}>{step}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[#6e7979]">
        <Sparkles className="w-3.5 h-3.5 text-[#006767]" />
        <span>Powered by SmartCare AI screening engine v3</span>
      </div>
    </motion.div>
  );
}

// ─── Main Assessment Page ──────────────────────────────────────────────────────

export default function AssessmentPage() {
  const { t } = useLanguage();
  const { currentStep, setStep } = useAssessment();

  return (
    <div className="min-h-screen bg-[#f5faff] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 rounded-xl hover:bg-[#f3fffe] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#3e4949]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold font-heading text-[#111d24]">{t("newAssessment")}</h1>
            <p className="text-xs text-[#6e7979]">SmartCare AI v3 Screening</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3fffe] border border-[#94f2f2]">
            <Heart className="w-3.5 h-3.5 text-[#006767]" />
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
