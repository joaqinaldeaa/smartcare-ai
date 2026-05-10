"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Baby,
  PlusCircle,
  FileText,
  MessageSquare,
  Activity,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { labelKey: "childProfiles", href: "/dashboard", icon: <Baby className="h-5 w-5" /> },
    { labelKey: "newAssessment", href: "/assessment", icon: <PlusCircle className="h-5 w-5" /> },
    { labelKey: "screeningHistory", href: "/history", icon: <FileText className="h-5 w-5" /> },
    { labelKey: "messages", href: "/messages", icon: <MessageSquare className="h-5 w-5" />, badge: 3 },
    { labelKey: "activity", href: "/activity", icon: <Activity className="h-5 w-5" /> },
  ];

  const bottomNavItems = [
    { labelKey: "accountSettings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
    { labelKey: "notifications", href: "/notifications", icon: <Bell className="h-5 w-5" />, badge: 2 },
    { labelKey: "help", href: "/help", icon: <HelpCircle className="h-5 w-5" /> },
    { labelKey: "security", href: "/security", icon: <Shield className="h-5 w-5" /> },
  ];

  const drawerNavItems = [
    { labelKey: "childProfiles", href: "/dashboard", icon: <Baby className="h-5 w-5" /> },
    { labelKey: "newAssessment", href: "/assessment", icon: <PlusCircle className="h-5 w-5" /> },
    { labelKey: "screeningHistory", href: "/history", icon: <FileText className="h-5 w-5" /> },
    { labelKey: "messages", href: "/messages", icon: <MessageSquare className="h-5 w-5" />, badge: 3 },
    { labelKey: "activity", href: "/activity", icon: <Activity className="h-5 w-5" /> },
    { labelKey: "accountSettings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
    { labelKey: "notifications", href: "/notifications", icon: <Bell className="h-5 w-5" />, badge: 2 },
    { labelKey: "help", href: "/help", icon: <HelpCircle className="h-5 w-5" /> },
    { labelKey: "security", href: "/security", icon: <Shield className="h-5 w-5" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-72 bg-surface border-r border-border z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center">
                  <Baby className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-lg text-primary whitespace-nowrap">
                    SmartCare<span className="text-primary">AI</span>
                  </h1>
                  <p className="text-[10px] text-text-muted -mt-0.5">{t("tagline")}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">{t("menu")}</p>
              {drawerNavItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.labelKey}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-1",
                      isActive
                        ? "bg-gradient-to-r from-primary to-tertiary text-white"
                        : "text-text-secondary hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mobileActiveIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex-shrink-0">{item.icon}</span>
                    <span className="text-sm font-semibold flex-1 relative z-10">{t(item.labelKey)}</span>
                    {item.badge && (
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full relative z-10",
                        isActive ? "bg-white/30 text-white" : "bg-primary/10 text-primary"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-tertiary/5 mb-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  AU
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-foreground">Ayah / Ibu</p>
                  <p className="text-xs text-text-muted">demo@smartcare.ai</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sessionStorage.removeItem("smartcare-user");
                  window.location.href = "/login";
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-semibold">{t("logout")}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Bottom Navigation for Mobile
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: "/dashboard", icon: <Baby className="h-5 w-5" />, labelKey: "childProfiles" },
    { href: "/assessment", icon: <PlusCircle className="h-5 w-5" />, labelKey: "newAssessment" },
    { href: "/history", icon: <FileText className="h-5 w-5" />, labelKey: "screeningHistory" },
    { href: "/messages", icon: <MessageSquare className="h-5 w-5" />, labelKey: "messages", badge: "3" },
    { href: "/activity", icon: <Activity className="h-5 w-5" />, labelKey: "activity" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border lg:hidden z-40">
      <div className="flex items-center justify-around h-full px-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.labelKey}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-text-muted"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-1.5 rounded-xl transition-colors relative",
                  isActive && "bg-primary/10"
                )}
              >
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[9px] font-semibold leading-none">{t(item.labelKey)}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
