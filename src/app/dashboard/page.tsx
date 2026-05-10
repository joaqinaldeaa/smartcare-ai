"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import {
  Plus,
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const childrenData = [
  {
    id: "1",
    name: "Leo Setiawan",
    age: 5,
    gender: "male",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    assessments: [
      { id: "a1", date: "2025-05-01", status: "completed", risk: "medium" },
      { id: "a2", date: "2025-04-15", status: "completed", risk: "low" },
    ],
  },
  {
    id: "2",
    name: "Maya Chen",
    age: 3,
    gender: "female",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    assessments: [],
  },
];

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [children, setChildren] = useState(childrenData);

  const handleAddChild = () => {
    if (newChildName && newChildAge) {
      setChildren([
        ...children,
        {
          id: String(Date.now()),
          name: newChildName,
          age: parseInt(newChildAge),
          gender: "male" as const,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newChildName.replace(/\s/g, "")}`,
          assessments: [],
        },
      ]);
      setNewChildName("");
      setNewChildAge("");
      setShowAddChild(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-tertiary rounded-3xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-2">{t("newAssessment")}</h2>
            <p className="text-white/80">{t("quickActionSubtitle")}</p>
          </div>
          <a
            href="/assessment"
            className="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            {t("startScreening")}
          </a>
        </div>
      </motion.div>

      {/* Child Profiles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading text-foreground">{t("childProfiles")}</h2>
          <button
            onClick={() => setShowAddChild(true)}
            className="px-4 py-2 bg-primary text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("addChild")}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child, i) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-soft transition-all group"
            >
              {/* Card Header */}
              <div className="p-6 flex items-center gap-4">
                <Avatar size="xl" className="ring-4 ring-primary/10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-tertiary text-white text-xl">
                    {child.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold font-heading text-foreground text-lg">{child.name}</h3>
                  <p className="text-sm text-text-secondary">{child.age} {lang === "id" ? "tahun" : "years"}</p>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-2",
                    child.gender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                  )}>
                    {child.gender === "male" ? (lang === "id" ? "Laki-laki" : "Boy") : (lang === "id" ? "Perempuan" : "Girl")}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 pb-6 flex gap-2">
                <a
                  href="/assessment"
                  className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-semibold text-center hover:bg-primary-hover transition-colors"
                >
                  + {t("addChild")}
                </a>
                <button className="py-2.5 px-4 border border-border rounded-xl text-sm text-text-secondary hover:bg-muted transition-colors">
                  {t("edit")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-bold font-heading text-foreground mb-6">{t("recentActivity")}</h2>
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          {children.flatMap((child) =>
            child.assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    assessment.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {assessment.status === "completed" ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{child.name}</p>
                    <p className="text-sm text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {assessment.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    assessment.risk === "low" ? "bg-success/10 text-success border border-success/20" : "",
                    assessment.risk === "medium" ? "bg-warning/10 text-warning border border-warning/20" : "",
                    assessment.risk === "high" ? "bg-error/10 text-error border border-error/20" : ""
                  )}>
                    {assessment.risk === "low" ? (lang === "id" ? "Rendah" : "Low") :
                     assessment.risk === "medium" ? (lang === "id" ? "Sedang" : "Medium") :
                     (lang === "id" ? "Tinggi" : "High")}
                  </span>
                  <a
                    href="/result"
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
                  >
                    {t("viewResults")}
                  </a>
                </div>
              </div>
            ))
          )}
          {children.every((c) => c.assessments.length === 0) && (
            <div className="p-12 text-center">
              <p className="text-text-secondary">{t("noScreeningActivity")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Child Modal */}
      <AnimatePresence>
        {showAddChild && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddChild(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-surface rounded-3xl shadow-xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold font-heading text-foreground mb-6">{t("addChild")}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t("childName")}</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder={t("placeholderChildName")}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground placeholder:text-text-muted focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t("childAge")}</label>
                  <input
                    type="number"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    placeholder={t("placeholderChildAge")}
                    min="1"
                    max="18"
                    className="w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground placeholder:text-text-muted focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowAddChild(false)}
                  className="flex-1 py-3 border border-border rounded-xl font-medium text-text-secondary hover:bg-muted transition-colors"
                >
                  {t("back")}
                </button>
                <button
                  onClick={handleAddChild}
                  disabled={!newChildName || !newChildAge}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-tertiary text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {t("saveProfile")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
