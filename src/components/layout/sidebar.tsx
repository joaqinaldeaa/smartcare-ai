"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  FileText,
  Baby,
  Activity,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronLeft,
  Menu,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

interface NavItem {
  labelKey: string;
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

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group mb-0.5",
        isActive
          ? "bg-[#006767] text-white border-l-[3px] border-[#0d8282] rounded-l-none"
          : "text-white/75 hover:text-white hover:bg-[#004d4d] border-l-[3px] border-transparent"
      )}
    >
      {/* Icon */}
      <motion.div
        whileHover={!isActive ? { scale: 1.08 } : {}}
        transition={{ duration: 0.15 }}
        className={cn(
          "relative z-10 flex-shrink-0 transition-colors duration-200",
          isActive ? "text-white" : "text-white/70 group-hover:text-white"
        )}
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
              isActive ? "text-white font-bold" : "text-white/75 group-hover:text-white"
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
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-[#006767]"
        >
          {item.badge}
        </motion.span>
      ) : null}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-[#111d24] rounded-xl shadow-xl border border-[#d8e4ed] text-sm font-semibold whitespace-nowrap z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-white">
          {t(item.labelKey)}
          {item.badge ? (
            <span className="ml-2 bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
          ) : null}
        </div>
      )}
    </Link>
  );
}

// ─── Animated Section Illustrations ─────────────────────────────────────────

function MenuIllustration() {
  // Animated child avatar
  return (
    <motion.div
      animate={{ y: [0, -3, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="5" r="3" fill="white" opacity="0.9"/>
        <path d="M3.5 16c0-2.8 2.2-5 5.5-5s5.5 2.2 5.5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.75"/>
        <circle cx="7" cy="4.5" r="0.5" fill="#006767"/>
        <circle cx="11" cy="4.5" r="0.5" fill="#006767"/>
        <path d="M8 6.5c0 0 0.5 0.8 1 0.8" stroke="#006767" strokeWidth="0.6" strokeLinecap="round" opacity="0.7"/>
      </svg>
    </motion.div>
  );
}

function ActivityIllustration() {
  // Animated parent + child together
  return (
    <motion.div
      animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
        {/* Parent */}
        <circle cx="7" cy="3.5" r="2.5" fill="white" opacity="0.85"/>
        <path d="M2 16.5c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.65"/>
        {/* Child */}
        <circle cx="16" cy="7" r="1.8" fill="white" opacity="0.9"/>
        <path d="M13.5 16.5c0-1.8 1-3 2.5-3s2.5 1.2 2.5 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.75"/>
        {/* Heart between them */}
        <motion.path
          d="M11 6.5s-1.5-1-1.5-2.5C9.5 2.8 10.2 2 11 2c.8 0 1.5.8 1.5 2 0 1.5-1.5 2.5-1.5 2.5z"
          fill="white"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "11px 5px" }}
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );
}

function SupportIllustration() {
  // Animated heart
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Heart className="w-4 h-4" fill="white" strokeWidth={1.5} style={{ color: "white" }} />
    </motion.div>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useLanguage();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-screen overflow-hidden",
        collapsed ? "items-center" : "items-stretch"
      )}
      style={{ background: "linear-gradient(180deg, #006767 0%, #004d4d 100%)" }}
    >
      {/* Logo Header */}
      <div
        className={cn(
          "flex items-center border-b border-white/10 flex-shrink-0",
          collapsed ? "justify-center" : "justify-start"
        )}
        style={{ height: 64, paddingLeft: collapsed ? 0 : 16, paddingRight: collapsed ? 0 : 8 }}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5"
            >
              {/* Logo mark */}
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2C6.03 2 2 6.03 2 11C2 15.97 6.03 20 11 20C15.97 20 20 15.97 20 11" stroke="#006767" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="M15 8.5C15 9.88 13.88 11 12.5 11C11.12 11 10 9.88 10 8.5C10 7.12 11.12 6 12.5 6C13.88 6 15 7.12 15 8.5Z" fill="#006767"/>
                  <circle cx="7.5" cy="11" r="1.5" fill="#0d8282"/>
                  <circle cx="17.5" cy="11" r="1.5" fill="#0d8282"/>
                </svg>
              </motion.div>
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-heading font-extrabold text-base text-white whitespace-nowrap tracking-tight leading-none">SmartCareAI</span>
                </div>
                <p className="text-[10px] text-white font-medium leading-none mt-0.5 tracking-wide">
                  Early Detection Platform
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2C6.03 2 2 6.03 2 11C2 15.97 6.03 20 11 20C15.97 20 20 15.97 20 11" stroke="#006767" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M15 8.5C15 9.88 13.88 11 12.5 11C11.12 11 10 9.88 10 8.5C10 7.12 11.12 6 12.5 6C13.88 6 15 7.12 15 8.5Z" fill="#006767"/>
                <circle cx="7.5" cy="11" r="1.5" fill="#0d8282"/>
                <circle cx="17.5" cy="11" r="1.5" fill="#0d8282"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {/* MENU section */}
        <div className="space-y-0.5">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 mb-3 flex items-center gap-2"
            >
              <MenuIllustration />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                MENU
              </p>
            </motion.div>
          )}
          {collapsed && (
            <div className="flex justify-center mb-2">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-6 text-white/45 flex items-center justify-center"
              >
                <Baby className="w-4 h-4" />
              </motion.div>
            </div>
          )}
          {mainNavItems.map((item, i) => (
            <motion.div
              key={item.labelKey}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
            >
              <NavItemComponent item={item} collapsed={collapsed} />
            </motion.div>
          ))}
        </div>

        {/* AKTIVITAS section */}
        <div className="space-y-0.5">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 mb-3 flex items-center gap-2"
            >
              <ActivityIllustration />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                AKTIVITAS
              </p>
            </motion.div>
          )}
          {collapsed && (
            <div className="flex justify-center mb-2">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-6 text-white/45 flex items-center justify-center"
              >
                <Activity className="w-4 h-4" />
              </motion.div>
            </div>
          )}
          {middleNavItems.map((item, i) => (
            <motion.div
              key={item.labelKey}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.25 }}
            >
              <NavItemComponent item={item} collapsed={collapsed} />
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Bottom: Support + User Profile */}
      <div className="border-t border-white/10 py-4 px-3 space-y-0.5">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 mb-3 flex items-center gap-2"
          >
            <SupportIllustration />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
              SUPPORT
            </p>
          </motion.div>
        )}
        {collapsed && (
          <div className="flex justify-center mb-2">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6 text-white/45 flex items-center justify-center"
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} />
            </motion.div>
          </div>
        )}

        {/* Support nav items — identical style to menu items */}
        {bottomNavItems.map((item, i) => (
          <motion.div
            key={item.labelKey}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.25 }}
          >
            <NavItemComponent item={item} collapsed={collapsed} />
          </motion.div>
        ))}

        {/* User Profile Card */}
        <div className={cn(
          "flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 border border-white/10 mt-3",
          collapsed ? "justify-center" : ""
        )}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          >
            AU
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-bold text-white truncate">Ayah / Ibu</p>
                <p className="text-xs text-white/60 truncate">demo@smartcare.ai</p>
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
                className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggle}
        className="absolute -right-3 top-20 h-7 w-7 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#f3fffe] transition-all text-[#006767]"
      >
        {collapsed ? <ChevronLeft className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
      </motion.button>
    </motion.aside>
  );
}