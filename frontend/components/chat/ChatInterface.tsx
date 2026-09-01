"use client";

import React, { useState } from "react";
import { askChat } from "@/lib/api";
import { OpportunityItem, StudentProfile } from "@/types";
import { Sparkles, Send, Bot, User, Database, ArrowRight, Clock, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "genie";
  text: string;
  recommendations?: OpportunityItem[];
  sources?: string[];
  queryExecuted?: string;
}

interface ChatInterfaceProps {
  studentProfile?: StudentProfile;
}

export function ChatInterface({ studentProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "genie",
      text: "Hello! I am your Databricks Genie campus advisor. Describe your goal (e.g. 'I want to become an AI engineer. I know Python and have 6 hours per week') and I will discover connected opportunities for you.",
      sources: ["campus.courses", "campus.clubs", "campus.research_projects", "campus.opportunities"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "I want to become an AI engineer. I know Python and have 6 hours per week.",
    "What research projects are related to computer vision?",
    "Which clubs help with machine learning?",
    "What if I replace AI Club with research?",
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await askChat(q, studentProfile);
      const genieMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "genie",
        text: res.answer,
        recommendations: res.recommendations,
        sources: res.sources,
        queryExecuted: res.query_executed,
      };
      setMessages((prev) => [...prev, genieMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "genie",
        text: "I encountered an issue connecting to Databricks Genie. Please verify backend connection.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-brand-700 to-indigo-700 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Databricks Genie Agent</h3>
            <div className="flex items-center space-x-1.5 text-xs text-brand-200">
              <Database className="w-3 h-3" />
              <span>Querying Connected Campus Datasets</span>
            </div>
          </div>
        </div>

        <div className="text-xs px-2.5 py-1 bg-white/10 rounded-full font-medium text-brand-100 border border-white/20">
          Synthetic Open Data Mode
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-brand-600 text-white shadow-glow"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="max-w-[85%] space-y-2">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.queryExecuted && (
                  <div className="mt-3 p-2 bg-slate-900 text-emerald-400 text-[11px] font-mono rounded border border-slate-800 overflow-x-auto">
                    <span className="text-slate-500">// Databricks Genie Text-to-SQL Executed</span>
                    <br />
                    {msg.queryExecuted}
                  </div>
                )}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap gap-1">
                    <span>Sources:</span>
                    {msg.sources.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations Cards */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {msg.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-50 text-brand-700 rounded border border-brand-200">
                          {rec.type}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">{rec.score}% match</span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{rec.name}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 my-1">{rec.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {rec.hours_per_week}h/wk
                        </span>
                        <Link href="/path" className="text-brand-600 hover:text-brand-800 font-semibold flex items-center">
                          <span>View Path</span>
                          <ArrowRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
            <span>Databricks Genie is exploring connected datasets...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts & Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 rounded-lg transition-colors text-left"
            >
              {qp}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Campus Twin (e.g. 'I want to become an AI engineer with 6h/wk')..."
            className="flex-1 text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
