"use client";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Smartphone, Key, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

export default function SecurityPage() {
  const securityItems = [
    { icon: <Lock className="w-5 h-5" />, title: "Change Password", desc: "Last changed 30 days ago", action: "Change" },
    { icon: <Smartphone className="w-5 h-5" />, title: "Two-Factor Authentication", desc: "Not enabled — add an extra layer of security", action: "Enable", enabled: false },
    { icon: <Eye className="w-5 h-5" />, title: "Active Sessions", desc: "1 device currently logged in", action: "Manage" },
    { icon: <Key className="w-5 h-5" />, title: "API Keys", desc: "Manage your API access tokens", action: "View" },
  ];

  return (
    <PageShell title="Security & Privacy" subtitle="Protect your account and data">
      <div className="max-w-2xl space-y-6">
        {/* Security Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-tertiary/10 rounded-3xl border border-primary/20 p-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Account Security: Good</p>
            <p className="text-sm text-text-secondary mt-1">Your account is protected. Consider enabling 2FA for extra security.</p>
          </div>
        </motion.div>

        {/* Security Items */}
        {securityItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-text-secondary flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{item.title}</p>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
            <button className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              item.enabled === false
                ? "bg-warning/10 text-warning hover:bg-warning/20"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}>
              {item.action}
            </button>
          </motion.div>
        ))}

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-bold text-foreground">Privacy Settings</h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: "Share data with specialists", enabled: true },
              { label: "Receive marketing emails", enabled: false },
              { label: "Anonymous usage analytics", enabled: true },
              { label: "Auto-delete data after 2 years", enabled: false },
            ].map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <button className={`w-11 h-6 rounded-full transition-all relative ${item.enabled ? "bg-primary" : "bg-border"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${item.enabled ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
