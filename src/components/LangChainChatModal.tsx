import React, { useState, useRef, useEffect } from "react";
import {
  Close,
  Send,
  Renew,
  Flash,
  DataBase,
  Copy,
  Checkmark,
  Security,
  Terminal,
} from "@carbon/icons-react";
import { executeLangChainTroubleshoot, ChatMessage } from "../lib/langchainAssistant";

interface LangChainChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const QUICK_PROMPTS = [
  "Docker engine not running on my Linux server",
  "How to fix IBM Db2 SQL30082N security authentication failed?",
  "Error: listen EADDRINUSE :::3000 port conflict",
  "Missing requests module in Python virtualenv",
];

export const LangChainChatModal: React.FC<LangChainChatModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro_1",
      role: "assistant",
      content:
        "Hello! I am **Resolve AI Assistant**, built with **LangChain Core** and backed by **IBM Db2 Vector Search**.\n\nAsk me any developer error, stack trace, or infrastructure issue. I will query our IBM Db2 vector memory, calculate the Wilson confidence lower bounds, and provide battle-tested command steps with real community verification rates.",
      timestamp: "Just now",
      langchainMetadata: {
        model: "IBM Granite 4.2",
        chain: "LangChain RunnableSequence [PromptTemplate -> Db2Retriever -> OutputParser]",
        latencyMs: 32,
        db2RecordsRetrieved: 5,
        confidenceFloor: 88,
        safetyChecked: true,
      },
    },
  ]);

  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const assistantMsg = await executeLangChainTroubleshoot(query, "all");
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: `Error executing LangChain RAG pipeline: ${err?.message || "Failed to query Db2 vector store"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0e1722] border border-[#1d2d3e] rounded-2xl w-full max-w-3xl h-[650px] flex flex-col justify-between shadow-2xl relative font-sans">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1d2d3e] flex items-center justify-between bg-[#090e14] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#162231] border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8]">
              <Terminal size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Resolve AI Assistant
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#162231] text-[#38bdf8] border border-[#38bdf8]/30 rounded">
                  LangChain RAG
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Retrieval-Augmented Generation across IBM Db2 Vector Knowledge Base
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#162231] transition-colors cursor-pointer"
          >
            <Close size={18} />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1d4ed8] text-white rounded-br-none"
                    : "bg-[#090e14] border border-[#162231] text-[#cbd5e1] rounded-bl-none space-y-2"
                }`}
              >
                {/* Assistant header banner if present */}
                {msg.role === "assistant" && msg.langchainMetadata && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[#162231] text-[10px] font-mono text-[#94a3b8]">
                    <span className="flex items-center gap-1 text-[#38bdf8]">
                      <Flash size={11} />
                      <span>{msg.langchainMetadata.chain}</span>
                    </span>
                    <span className="text-[#42be65]">
                      Db2 Latency: {msg.langchainMetadata.latencyMs}ms
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans select-text">
                  {msg.content}
                </div>

                {/* Footer copy action for assistant replies */}
                {msg.role === "assistant" && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#162231] text-[11px] text-[#64748b]">
                    <span className="font-mono">{msg.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-[#38bdf8] hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Checkmark size={12} className="text-[#42be65]" />
                          <span className="text-[#42be65]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Resolution</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-[#090e14] border border-[#162231] rounded-xl max-w-sm text-xs text-[#94a3b8] font-mono">
              <Renew size={14} className="animate-spin text-[#38bdf8]" />
              <span>Querying IBM Db2 & executing LangChain chain...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Strip */}
        <div className="px-4 py-2 border-t border-[#1d2d3e] bg-[#090e14] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#64748b] text-[11px] font-mono">Suggested:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-[#101923] hover:bg-[#162231] border border-[#1e2f42] hover:border-[#38bdf8] text-[#94a3b8] hover:text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer truncate max-w-[220px]"
              title={prompt}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-[#1d2d3e] bg-[#0c131a] rounded-b-2xl flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LangChain assistant about any error or command..."
            className="flex-1 bg-[#090e14] border border-[#162231] focus:border-[#38bdf8] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#475569] outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              !input.trim() || isLoading
                ? "bg-[#162231] text-[#64748b] cursor-not-allowed"
                : "bg-[#70a5ff] hover:bg-[#85b2ff] text-[#0a1320]"
            }`}
          >
            <span>Ask</span>
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
};
