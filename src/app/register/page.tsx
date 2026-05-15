"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, ChevronRight, User, Baby } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { addChildToStorage } from "@/hooks/useChildren";

type Step = "parent" | "child";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState<Step>("parent");

  // Parent form state
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Child form state
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGender, setChildGender] = useState<"male" | "female">("male");
  const [childDOB, setChildDOB] = useState("");
  const [childSpeechDelay, setChildSpeechDelay] = useState<"yes" | "no" | "unsure">("no");
  const [childFamilyHistory, setChildFamilyHistory] = useState<"yes" | "no" | "unsure">("no");

  function validateParent(): boolean {
    const errs: Record<string, string> = {};
    if (!parentName.trim()) errs.parentName = "Name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Valid email is required";
    if (!password || password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleParentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateParent()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: parentName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      setStep("child");
    } catch (err) {
      console.error('[Register] Fetch error:', err);
      alert('Connection error. Please check your internet connection.');
      setLoading(false);
    }
  }

  function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    if (!childName.trim() || !childAge) return;
    addChildToStorage({
      name: childName,
      age: parseInt(childAge),
      gender: childGender,
      dob: childDOB,
      speechDelay: childSpeechDelay,
      familyHistory: childFamilyHistory,
    });
    router.push("/dashboard");
  }

  function handleSkip() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-foreground">
              {t("appName")}
            </span>
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step === "parent" ? "bg-primary text-white" : "bg-success text-white"
            }`}>
              {step === "child" ? <User className="w-4 h-4" /> : "1"}
            </div>
            <span className={`text-sm font-medium ${step === "parent" ? "text-primary" : "text-success"}`}>
              {t("parentInfo")}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step === "child" ? "bg-primary text-white" : "bg-muted text-text-muted"
            }`}>
              {step === "child" ? <Baby className="w-4 h-4" /> : "2"}
            </div>
            <span className={`text-sm font-medium ${step === "child" ? "text-primary" : "text-text-muted"}`}>
              {t("childInfo")}
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-3xl shadow-card p-8">
          <AnimatePresence mode="wait">
            {step === "parent" ? (
              <motion.div
                key="parent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="text-2xl font-bold font-heading text-foreground mb-1">
                  {t("registerTitle")}
                </h1>
                <p className="text-text-secondary text-sm mb-6">{t("registerSubtitle")}</p>

                <form onSubmit={handleParentSubmit} className="space-y-4">
                  <Input
                    label={t("fullName")}
                    placeholder="John Doe"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    error={errors.parentName}
                    required
                  />
                  <Input
                    label={t("email")}
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    required
                  />
                  <Input
                    label={t("password")}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    required
                  />
                  <Input
                    label={t("confirmPassword")}
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    required
                  />

                  <Button type="submit" className="w-full mt-2" loading={loading}>
                    {t("createAccount")}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-text-secondary">
                  {t("hasAccount")}{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    {t("signIn")}
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="child"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => setStep("parent")} className="p-1 hover:bg-muted rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-text-secondary" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold font-heading text-foreground">{t("childInfo")}</h1>
                    <p className="text-text-secondary text-sm">{t("addFirstChild")}</p>
                  </div>
                </div>

                <form onSubmit={handleAddChild} className="space-y-4">
                  <Input
                    label={t("childName")}
                    placeholder="Maria Santos"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    required
                  />
                  <Input
                    label={t("childAge")}
                    type="number"
                    min="1"
                    max="12"
                    placeholder="5"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    required
                  />

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">
                      {t("childGender")}
                    </label>
                    <div className="flex gap-3">
                      {(["male", "female"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setChildGender(g)}
                          className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            childGender === g
                              ? "border-primary bg-primary-light text-primary"
                              : "border-border bg-surface text-text-secondary hover:border-border-hover"
                          }`}
                        >
                          {t(g)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label={t("childDOB")}
                    type="date"
                    value={childDOB}
                    onChange={(e) => setChildDOB(e.target.value)}
                  />

                  {/* Speech Delay */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">
                      {t("speechDelay") || "Speech Delay"}
                    </label>
                    <div className="flex gap-3">
                      {(['yes', 'no', 'unsure'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setChildSpeechDelay(opt)}
                          className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            childSpeechDelay === opt
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
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">
                      {t("familyHistory") || "Family History"}
                    </label>
                    <div className="flex gap-3">
                      {(['yes', 'no', 'unsure'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setChildFamilyHistory(opt)}
                          className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            childFamilyHistory === opt
                              ? "border-primary bg-primary-light text-primary"
                              : "border-border bg-surface text-text-secondary hover:border-border-hover"
                          }`}
                        >
                          {opt === 'yes' ? 'Ya' : opt === 'no' ? 'Tidak' : 'Tidak Yakin'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1">
                      {t("saveProfile")}
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-sm text-text-muted hover:text-primary transition-colors py-1"
                  >
                    {t("skipForNow")}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}