"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Baby,
  MessageSquare,
  Activity,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

interface NavItem {
  labelKey: string; // i18n key
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

const mainNavItems: NavItem[] = [
  { labelKey: "childProfiles", href: "/dashboard", icon: <Baby className="h-5 w-5" /> },
  { labelKey: "newAssessment", href: "/assessment", icon: <PlusCircle className="h-5 w-5" /> },
  { labelKey: "screeningHistory", href: "/history", icon: <FileText className="h-5 w-5" /> },
];

const middleNavItems: NavItem[] = [
  { labelKey: "messages", href: "/messages", icon: <MessageSquare className="h-5 w-5" />, badge: 3 },
  { labelKey: "recentActivity", href: "/activity", icon: <Activity className="h-5 w-5" /> },
];

const bottomNavItems: NavItem[] = [
  { labelKey: "accountSettings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  { labelKey: "notifications", href: "/notifications", icon: <Bell className="h-5 w-5" />, badge: 2 },
  { labelKey: "help", href: "/help", icon: <HelpCircle className="h-5 w-5" /> },
  { labelKey: "security", href: "/security", icon: <Shield className="h-5 w-5" /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group mb-1",
          isActive
            ? "bg-[#4A48A0] text-white shadow-md border-l-4 border-[#FF8A65]"
            : "text-white/70 hover:text-white hover:bg-[#3A3870] transition-colors duration-200"
        )}
      >
        {/* Active indicator — hidden when using border accent on parent */}
        <motion.div
          layoutId="activeIndicator"
          animate={{ opacity: isActive ? 0 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
        />

        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 flex-shrink-0"
        >
          {item.icon}
        </motion.div>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "text-sm font-semibold whitespace-nowrap overflow-hidden flex-1",
                isActive ? "text-white" : "text-white/70 group-hover:text-white transition-colors duration-200"
              )}
            >
              {t(item.labelKey)}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        {!collapsed && item.badge ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "relative z-10 text-xs font-bold px-2 py-0.5 rounded-full",
              isActive ? "bg-white/30 text-white" : "bg-primary/10 text-primary"
            )}
          >
            {item.badge}
          </motion.span>
        ) : null}

        {/* Tooltip when collapsed */}
        {collapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-surface rounded-xl shadow-xl border border-border text-sm font-semibold whitespace-nowrap z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            {t(item.labelKey)}
            {item.badge ? (
              <span className="ml-2 bg-primary/10 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
            ) : null}
          </div>
        )}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sidebar-warm hidden lg:block fixed left-0 top-0 h-screen border-r border-transparent flex flex-col",
        collapsed ? "items-center" : "items-stretch"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 border-b border-border", collapsed ? "justify-center px-2" : "px-5 gap-3")}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-heading font-extrabold text-lg text-primary whitespace-nowrap tracking-tight">
                SmartCare<span className="text-primary">AI</span>
              </h1>
              <p className="text-[10px] text-text-muted -mt-0.5 font-medium">
                Early Detection Platform
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-md"
            >
              <Baby className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Main Nav */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              {t("menu")}
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.labelKey} item={item} />
          ))}
        </div>

        {/* Middle Nav */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              {t("activity")}
            </p>
          )}
          {middleNavItems.map((item) => (
            <NavItemComponent key={item.labelKey} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Nav */}
      <div className="border-t border-border py-4 px-3 space-y-1">
        {bottomNavItems.slice(0, 2).map((item) => (
          <NavItemComponent key={item.labelKey} item={item} />
        ))}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-2.5 rounded-2xl bg-gradient-to-r from-primary/5 to-tertiary/5 border border-primary/10 mt-3",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            AU
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-bold text-foreground truncate">Ayah / Ibu</p>
                <p className="text-xs text-text-muted truncate">demo@smartcare.ai</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  sessionStorage.removeItem("smartcare-user");
                  window.location.href = "/login";
                }}
                className="p-2 rounded-xl hover:bg-error/10 text-text-muted hover:text-error transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Tools */}
        <div className="flex gap-1 pt-2">
          {bottomNavItems.slice(2).map((item) => {
            const toolActive = pathname === item.href;
            return (
              <Link
                key={item.labelKey}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all",
                  toolActive
                    ? "bg-gradient-to-r from-primary to-tertiary text-white shadow-md"
                    : "text-text-muted hover:text-primary hover:bg-muted"
                )}
              >
                <span className="h-4 w-4 flex items-center justify-center">{item.icon}</span>
                {!collapsed && (
                  <span className={cn("text-[10px] font-medium", toolActive ? "text-white" : "")}>
                    {t(item.labelKey)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="absolute -right-3 top-20 h-7 w-7 rounded-full bg-surface border-2 border-primary shadow-lg flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all text-primary"
      >
        {collapsed ? <ChevronLeft className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
      </motion.button>
    </motion.aside>
  );
}
