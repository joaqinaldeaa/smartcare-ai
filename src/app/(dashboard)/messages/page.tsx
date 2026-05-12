"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Phone, Video, Image, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const conversations = [
  {
    id: "1",
    name: "Dr. Siti Rahman",
    role: "Dokter Spesialis Anak",
    avatar: "SR",
    avatarBg: "from-[#006767] to-[#0d8282]",
    lastMessage: "Hasil screening anak Anda sudah bisa dilihat",
    time: "10.30",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Tim SmartCare AI",
    role: "AI Assistant",
    avatar: "AI",
    avatarBg: "from-[#26A69A] to-[#00897B]",
    lastMessage: "Assessment baru tersedia untuk diselesaikan",
    time: "Kemarin",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Psikolog Budi Santoso",
    role: "Konsultan",
    avatar: "BS",
    avatarBg: "from-[#7d5539] to-[#6a472f]",
    lastMessage: "Jadwal konsultasi telah dikonfirmasi",
    time: "2 hari lalu",
    unread: 0,
    online: false,
  },
];

const messages = {
  "1": [
    { id: 1, text: "Selamat pagi! Hasil screening terbaru sudah kami proses.", sent: false, time: "09.15" },
    { id: 2, text: "Baik terima kasih Dok. Apakah perlu tindakan lanjut?", sent: true, time: "09.20" },
    { id: 3, text: "Berdasarkan hasil, kami sarankan untuk kontrol rutin 3 bulan ke depan.", sent: false, time: "09.45" },
    { id: 4, text: "Hasil screening anak Anda sudah bisa dilihat", sent: false, time: "10.30" },
  ],
};

export default function MessagesPage() {
  const { t } = useLanguage();
  const [selected, setSelected] = React.useState("1");
  const [text, setText] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState(messages["1"]);

  const activeConv = conversations.find(c => c.id === selected);

  function sendMessage() {
    if (!text.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), text, sent: true, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
    setText("");
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white rounded-2xl border border-[#d8e4ed] shadow-sm overflow-hidden">
      {/* Conversation List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 border-r border-[#d8e4ed] flex flex-col"
      >
        <div className="p-4 border-b border-[#d8e4ed]">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#006767]" strokeWidth={2} />
            <h2 className="text-lg font-bold text-[#111d24]">Pesan</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7979]" />
            <input
              placeholder="Cari percakapan..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#d8e4ed] bg-[#f5faff] text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv, i) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 border-b border-[#d8e4ed] transition-colors text-left",
                selected === conv.id ? "bg-[#f3fffe]" : "hover:bg-[#f9fafb]"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", conv.avatarBg)}>
                  {conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#007a3d] border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#111d24] truncate">{conv.name}</p>
                  <span className="text-[10px] text-[#6e7979] ml-2 flex-shrink-0">{conv.time}</span>
                </div>
                <p className="text-[10px] text-[#6e7979] mb-1">{conv.role}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#6e7979] truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-[#006767] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-[#d8e4ed]">
              <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", activeConv.avatarBg)}>
                {activeConv.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#111d24]">{activeConv.name}</p>
                <p className="text-xs text-[#6e7979]">{activeConv.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl hover:bg-[#f3fffe] text-[#6e7979]">
                  <Phone className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl hover:bg-[#f3fffe] text-[#6e7979]">
                  <Video className="w-4 h-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl hover:bg-[#f3fffe] text-[#6e7979]">
                  <MoreVertical className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", msg.sent ? "justify-end" : "justify-start")}
                >
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                    msg.sent
                      ? "bg-gradient-to-r from-[#006767] to-[#0d8282] text-white rounded-br-md"
                      : "bg-[#f5faff] text-[#111d24] border border-[#d8e4ed] rounded-bl-md"
                  )}>
                    <p>{msg.text}</p>
                    <p className={cn("text-[10px] mt-1", msg.sent ? "text-white/60" : "text-[#6e7979]")}>{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-[#d8e4ed] flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.05 }} className="p-2 rounded-xl hover:bg-[#f3fffe] text-[#6e7979]">
                <Paperclip className="w-4 h-4" />
              </motion.button>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Ketik pesan..."
                className="flex-1 h-11 px-4 rounded-xl border border-[#d8e4ed] bg-white text-sm text-[#111d24] placeholder:text-[#6e7979] focus:outline-none focus:border-[#006767]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#006767] to-[#0d8282] flex items-center justify-center text-white"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#6e7979]">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" strokeWidth={1} />
              <p className="text-sm">Pilih percakapan untuk memulai</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}