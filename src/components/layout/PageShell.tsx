"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Baby, PlusCircle, FileText, MessageSquare, Activity, Settings, Bell, HelpCircle, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: number;
}

export function PageShell({ title, subtitle, children, badge }: PageShellProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: t("childProfiles"), href: "/dashboard", icon: <Baby className="h-5 w-5" /> },
    { label: t("newAssessment"), href: "/assessment", icon: <PlusCircle className="h-5 w-5" />, primary: true },
    { label: t("screeningHistory"), href: "/history", icon: <FileText className="h-5 w-5" /> },
    { label: t("messages"), href: "/messages", icon: <MessageSquare className="h-5 w-5" /> },
    { label: t("recentActivity"), href: "/activity", icon: <Activity className="h-5 w-5" /> },
    { label: t("accountSettings"), href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const bottomItems = [
    { label: t("notifications"), href: "/notifications", icon: <Bell className="h-5 w-5" /> },
    { label: t("help"), href: "/help", icon: <HelpCircle className="h-5 w-5" /> },
    { label: t("security"), href: "/security", icon: <Shield className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen bg-surface border-r border-border flex flex-col z-40 transition-all duration-300",
          collapsed ? "w-20" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-border px-5 gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center flex-shrink-0">
            <Baby className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-extrabold font-heading text-base text-primary leading-tight">SmartCare<span className="text-tertiary">AI</span></h1>
              <p className="text-[10px] text-text-muted -mt-0.5">Early Detection</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold",
                item.primary
                  ? "bg-gradient-to-r from-primary to-tertiary text-white shadow-lg"
                  : "text-text-secondary hover:text-foreground hover:bg-muted"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border py-3 px-3 space-y-1">
          {bottomItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-foreground hover:bg-muted transition-all"
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
          {/* User */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/50 mt-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AU</div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Ayah/Ibu</p>
                <p className="text-xs text-text-muted">demo@smartcare.ai</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => { sessionStorage.removeItem("smartcare-user"); router.push("/login"); }}
                className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-7 w-7 rounded-full bg-surface border-2 border-primary shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Main content */}
      <main className={cn("flex-1 transition-all duration-300 pb-20 lg:pb-0", collapsed ? "ml-20" : "ml-60")}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold font-heading text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
            </div>
            {badge !== undefined && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">{badge} new</span>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
