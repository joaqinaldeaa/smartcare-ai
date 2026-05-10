"use client";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Book, Video, Mail, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

export default function HelpPage() {
  const faqs = [
    { q: "How does the AI assessment work?", a: "Our AI analyzes responses from the parent interview and uploaded video to identify behavioral patterns associated with autism and ADHD risk indicators." },
    { q: "Is my child's data secure?", a: "Yes. All data is encrypted end-to-end, HIPAA compliant, and never shared with third parties without your consent." },
    { q: "When will I get results?", a: "Results are generated within 7 seconds after completing the assessment. You can download a PDF report immediately." },
    { q: "Can I re-take the assessment?", a: "Yes. You can start a new assessment at any time from the dashboard. We recommend a follow-up every 3-6 months." },
    { q: "Is this a medical diagnosis?", a: "No. SmartCare AI provides screening indicators only. Please consult a pediatrician or child psychologist for official diagnosis." },
  ];

  const contactOptions = [
    { icon: <Mail className="w-5 h-5" />, label: "Email Support", desc: "support@smartcare.ai", action: "Send Email" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Live Chat", desc: "Available Mon-Fri, 9AM-6PM", action: "Start Chat" },
    { icon: <Book className="w-5 h-5" />, label: "Documentation", desc: "Guides and tutorials", action: "Browse Docs" },
    { icon: <Video className="w-5 h-5" />, label: "Video Tutorials", desc: "Step-by-step walkthroughs", action: "Watch Videos" },
  ];

  return (
    <PageShell title="Help & Support" subtitle="We're here to help you">
      <div className="max-w-2xl space-y-6">
        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          {contactOptions.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                {opt.icon}
              </div>
              <p className="font-bold text-foreground">{opt.label}</p>
              <p className="text-xs text-text-secondary mt-1">{opt.desc}</p>
              <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                {opt.action} <ChevronRight className="w-3 h-3" />
              </p>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <details key={i} className="group px-6 py-4 cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-foreground list-none">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-sm text-text-secondary mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
