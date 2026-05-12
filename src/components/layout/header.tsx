"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { currentUser, getUnreadNotificationsCount } from "@/data/mock-data";
import { getInitials } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const unreadCount = getUnreadNotificationsCount();

  const getPageTitle = () => {
    const routes: Record<string, string> = {
      "/dashboard": t("childProfiles"),
      "/assessment": t("newAssessment"),
      "/result": t("assessmentResults"),
      "/history": t("screeningHistory"),
      "/activity": t("activityTimeline"),
      "/messages": t("messages"),
      "/notifications": t("notifications"),
      "/settings": t("accountSettings"),
      "/security": t("security"),
      "/help": t("help"),
    };
    return routes[pathname] || "SmartCare AI";
  };

  const notifications = [
    {
      id: "1",
      titleKey: "assessmentComplete",
      messageKey: "screeningResultsReady",
      time: t("fiveMinAgo"),
      unread: true,
    },
  ];

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:block"
          >
            <h1 className="text-xl font-semibold text-foreground font-heading">
              {getPageTitle()}
            </h1>
          </motion.div>
        </div>

        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-muted/50 border-transparent focus:bg-surface focus:border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/assessment"
            className="hidden md:flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t("newAssessment")}</span>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/assessment"}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white cursor-pointer shadow-md"
          >
            <Plus className="h-5 w-5" />
          </motion.button>

          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5 text-text-secondary" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5 text-text-secondary" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5 text-text-secondary" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-xl border border-border shadow-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">{t("notifications")}</h3>
                    <Link href="/notifications" className="text-xs text-primary hover:underline">
                      {t("view")}
                    </Link>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                          notif.unread && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground">{t(notif.titleKey)}</p>
                              {notif.unread && (
                                <span className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5">{t(notif.messageKey)}</p>
                            <p className="text-[10px] text-text-muted mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <Avatar size="sm">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform hidden sm:block", showUserMenu && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl border border-border shadow-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-sm text-text-secondary">{currentUser.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-text-muted" />
                      <span className="text-sm text-foreground">{t("accountSettings")}</span>
                    </Link>
                    <Link
                      href="/security"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Shield className="h-4 w-4 text-text-muted" />
                      <span className="text-sm text-foreground">{t("security")}</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-border">
                    <button
                      onClick={() => {
                        sessionStorage.removeItem("smartcare-user");
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors cursor-pointer w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">{t("logout")}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
