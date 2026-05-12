"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { Eye, EyeOff, Loader2, Heart, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const langOptions = [
  { code: "id", label: "Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fil", label: "Filipino", flag: "🇵🇭" },
  { code: "ms", label: "Bahasa Malaysia", flag: "🇲🇾" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

export default function LoginPage() {
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleDemoLogin = async () => {
    console.log('[Login] Demo button clicked — attempting demo login');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'demo@smartcare.ai', password: 'demo123' }),
      });
      const data = await res.json();
      console.log('[Login] Demo response:', res.status, data);

      if (!res.ok) {
        alert(data.error || 'Demo login failed. Please try again.');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('[Login] Demo fetch error:', err);
      alert('Connection error. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.target as HTMLFormElement;
      const emailInput = form.elements.namedItem('email') as HTMLInputElement;
      const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
      const email = emailInput?.value;
      const password = passwordInput?.value;
      console.log('[Login] Submitting login for:', email);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log('[Login] Response:', res.status, data);

      if (!res.ok) {
        alert(data.error || 'Login failed. Please try again.');
        return;
      }

      router.push('/dashboard');
    } catch {
      alert('Connection error. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 hover:bg-white transition-colors shadow-sm"
          >
            <Globe className="w-5 h-5 text-text-secondary" />
            <span className="text-sm">{langOptions.find((l) => l.code === lang)?.flag}</span>
          </button>
          {showLangMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-40 bg-surface rounded-2xl shadow-xl border border-border overflow-hidden z-50"
            >
              {langOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => {
                    setLang(option.code as "en" | "id" | "fil" | "ms" | "th" | "vi");
                    setShowLangMenu(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-muted transition-colors",
                    lang === option.code && "bg-primary/10 text-primary"
                  )}
                >
                  <span>{option.flag}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-extrabold font-heading text-foreground">{t("appName")}</h1>
              <p className="text-sm text-text-secondary">{t("tagline")}</p>
            </div>
          </Link>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-surface rounded-3xl shadow-xl border border-border p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-extrabold font-heading text-foreground text-center mb-1">
              {t("welcomeBack")}
            </h2>
            <p className="text-text-secondary text-center mb-8 text-sm">
              Sign in to monitor your child&apos;s development
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t("email")}</label>
              <input
                type="email"
                name="email"
                required
                className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-white text-foreground placeholder:text-text-muted focus:outline-none focus:ring-0 focus:border-primary transition-all"
                placeholder="parent@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t("password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full h-12 px-4 pr-12 rounded-2xl border-2 border-border bg-white text-foreground placeholder:text-text-muted focus:outline-none focus:ring-0 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary" />
                <span className="text-text-secondary">{t("rememberMe")}</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">{t("forgotPassword")}</a>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={cn(
                "w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-tertiary text-white font-bold",
                "hover:shadow-lg transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Signing in...</>
              ) : (
                t("signIn")
              )}
            </motion.button>
          </motion.form>

          <motion.div
            className="relative my-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface text-text-muted">or</span>
            </div>
          </motion.div>

          <motion.button
            onClick={handleDemoLogin}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all"
          >
            Try Demo Account
          </motion.button>
        </motion.div>

        <motion.p
          className="text-center text-sm text-text-secondary mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">{t("signUp")}</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
