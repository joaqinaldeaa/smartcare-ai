"use client";
import { motion } from "framer-motion";
import { Settings, User, Bell, Globe, Moon, Shield, LogOut } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);

type SettingItem =
  | { label: string; value: string; editable?: boolean; type?: string }
  | { label: string; toggle: true; value: boolean; onChange: (v: boolean) => void };

interface SettingsSection {
  title: string;
  items: SettingItem[];
}

const sections: SettingsSection[] = [
  {
    title: "Account",
    items: [
      { label: "Full Name", value: "Ayah / Ibu", editable: true },
      { label: "Email", value: "demo@smartcare.ai", editable: true },
      { label: "Phone", value: "+62 812 3456 7890", editable: true },
      { label: "Password", value: "••••••••••", editable: true, type: "password" },
    ]
  },
  {
    title: "Preferences",
    items: [
      { label: "Language", value: lang === "id" ? "Bahasa Indonesia" : lang === "fil" ? "Filipino" : "English", editable: false },
      { label: "Notifications", toggle: true, value: notifications, onChange: setNotifications },
      { label: "Email Updates", toggle: true, value: emailUpdates, onChange: setEmailUpdates },
      { label: "Dark Mode", toggle: true, value: darkMode, onChange: setDarkMode },
    ]
  },
];

  return (
    <PageShell title="Account Settings" subtitle="Manage your account preferences">
      <div className="max-w-2xl space-y-6">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="bg-white rounded-3xl border border-border overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                {section.title === "Account" ? <User className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {section.title}
              </h2>
            </div>
            <div className="divide-y divide-border">
              {section.items.map((item) => (
                <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    {'toggle' in item ? null : item.value ? (
                      <p className="text-sm text-text-secondary mt-0.5">
                        {String(item.value).replace(/./g, '•')}
                      </p>
                    ) : null}
                  </div>
                  {'toggle' in item ? (
                    <button
                      onClick={() => item.onChange?.(!item.value)}
                      className={`w-12 h-7 rounded-full transition-all relative ${
                        item.value ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        item.value ? "right-1" : "left-1"
                      }`} />
                    </button>
                  ) : item.editable ? (
                    <button className="text-sm font-semibold text-primary hover:underline">
                      Edit
                    </button>
                  ) : (
                    <span className="text-sm text-text-secondary">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-error/20 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-error/20 bg-error/5">
            <h2 className="font-bold text-error flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Danger Zone
            </h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-text-secondary">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-error/10 text-error font-semibold text-sm hover:bg-error/20 transition-colors">
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
