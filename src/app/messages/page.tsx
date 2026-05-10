"use client";

import { motion } from "framer-motion";
import { MessageSquare, Send, Search, Phone } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

export default function MessagesPage() {
  const conversations = [
    { id: 1, name: "Dr. Maya Wijaya", role: "Pediatric Specialist", last: "Your assessment results are ready for review", time: "2 min ago", unread: true },
    { id: 2, name: "SmartCare AI Team", role: "Support", last: "Thank you for using SmartCare AI!", time: "1 hour ago", unread: false },
    { id: 3, name: "Dr. Ahmad Pratama", role: "Child Psychologist", last: "Please upload the video as requested", time: "3 hours ago", unread: true },
  ];

  return (
    <PageShell title="Messages" subtitle="Communicate with specialists" badge={conversations.filter(c => c.unread).length}>
      <div className="flex gap-6">
        {/* Conversation list */}
        <div className="w-80 flex-shrink-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* List */}
          <div className="space-y-2">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  conv.unread
                    ? "bg-primary/5 border-primary/20 shadow-sm"
                    : "bg-white border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground truncate">{conv.name}</p>
                      <span className="text-xs text-text-muted flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-xs text-text-muted">{conv.role}</p>
                    <p className={`text-sm mt-1 truncate ${conv.unread ? "text-foreground font-medium" : "text-text-secondary"}`}>
                      {conv.last}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-white rounded-3xl border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold text-sm">M</div>
            <div>
              <p className="font-bold text-foreground">Dr. Maya Wijaya</p>
              <p className="text-xs text-success">Online</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="p-2 rounded-xl hover:bg-muted transition-colors"><Phone className="w-5 h-5 text-text-secondary" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-start">
              <div className="max-w-md bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-foreground">Hello! I've reviewed your child's assessment. The results look promising. Would you like to schedule a consultation?</p>
                <span className="text-xs text-text-muted mt-1 block">10:30 AM</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-md bg-gradient-to-r from-primary to-tertiary text-white rounded-2xl rounded-tr-sm px-4 py-3">
                <p className="text-sm">Yes, please! When are you available this week?</p>
                <span className="text-xs text-white/70 mt-1 block">10:32 AM</span>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-md bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-foreground">I'm available Thursday at 2 PM or Friday at 10 AM. Which works better for you?</p>
                <span className="text-xs text-text-muted mt-1 block">10:35 AM</span>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 h-11 px-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button className="h-11 px-4 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
