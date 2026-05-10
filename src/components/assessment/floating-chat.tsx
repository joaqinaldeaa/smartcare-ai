"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

async function getAIResponse(prompt: string): Promise<string> {
  try {
    const { callStitchChat } = await import("@/lib/mcp/stitch");
    return await callStitchChat(prompt);
  } catch {
    return "Maaf, AI assistant sedang unavailable. Silakan coba lagi nanti.";
  }
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Halo! Saya AI Assistant SmartCareAI. Ada yang bisa saya bantu tentang perkembangan anak Anda?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setInput("");
    setError(false);

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const reply = await getAIResponse(userText);
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: "ai", text: reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setError(true);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: "Maaf, saya sedang unavailable. Silakan coba lagi nanti." },
      ]);
    }
    setIsTyping(false);
  }

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#FF8A65] to-[#FF7043] shadow-xl flex items-center justify-center z-50 cursor-pointer border-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Chat dengan AI Assistant"
      >
        <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-[#FF8A65]"
          animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-[#FFE0B2]"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#FF8A65] to-[#FF7043]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">AI Assistant</p>
                  <p className="text-white/70 text-xs">SmartCare AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FEF7F0]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[#FF8A65] to-[#FF7043] text-white rounded-br-sm"
                        : "bg-white text-[#3E2723] rounded-bl-sm shadow-sm border border-[#FFE0B2]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-[#FFE0B2]">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-2 h-2 rounded-full bg-[#FF8A65] animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-xs text-red-500 px-2">
                  AI unavailable — pesan terakhir mungkin tidak terbalas
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-[#FFE0B2]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ketik pertanyaan Anda..."
                  disabled={isTyping}
                  className="flex-1 h-11 rounded-xl border-2 border-[#FFE0B2] bg-[#FEF7F0] px-4 text-sm text-[#3E2723] placeholder:text-[#8D6E63] focus:outline-none focus:border-[#FF8A65] transition-colors disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF8A65] to-[#FF7043] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
