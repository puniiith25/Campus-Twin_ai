/**
 * Campus Twin - Floating Genie Chatbot Widget (Bottom Right)
 * Floating interactive button + slide-up quick chat dialog connected to Genie AI Assistant.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Maximize2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { queryGenieAssistant } from '../services/api';

interface FloatingGenieChatbotProps {
  student: StudentProfile;
  onOpenFullGenie: () => void;
}

interface MiniChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const FloatingGenieChatbot: React.FC<FloatingGenieChatbotProps> = ({
  student,
  onOpenFullGenie,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MiniChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hi ${student.name.split(' ')[0]}! I'm Genie, your Databricks Lakehouse Assistant. Ask me anything about electives, campus research labs, or your ${student.careerGoal || 'career'} roadmap!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: MiniChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await queryGenieAssistant(userText, student);
      let assistantText = '';
      if (response && (response.text || response.content || response.response || response.answer?.recommendation)) {
        assistantText = response.text || response.content || response.response || response.answer?.recommendation;
      } else {
        assistantText = `Based on your ${student.cgpa} CGPA and target ${student.careerGoal || 'career path'}, prioritize practical projects in ${student.skills.slice(0, 2).map((s) => s.name).join(' & ')} and close high-priority skill gaps. You can open the full Genie workspace for full SQL Lakehouse reasoning.`;
      }

      const assistantMsg: MiniChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const assistantMsg: MiniChatMessage = {
        id: `ast_err_${Date.now()}`,
        sender: 'assistant',
        text: `Based on your profile with ${student.cgpa} CGPA and target ${student.careerGoal || 'career'}, I recommend exploring the campus workshops and checking prerequisite electives.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    `What skills do I need for ${student.careerGoal || 'AI Engineer'}?`,
    'Which campus labs fit my weekly hours?',
    `Am I eligible for Tier-1 placements with ${student.cgpa} CGPA?`,
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Mini Chat Pop-up Window */}
      {isOpen && (
        <div className="mb-3 w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-[#D1D9E0] flex flex-col overflow-hidden animate-fade-in text-[#17212B]">
          {/* Header */}
          <div className="bg-[#0B1F33] text-white p-4 flex items-center justify-between border-b border-[#102A43]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#167C80] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-display font-bold text-sm tracking-tight text-white">
                    Genie
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                </div>
                <p className="text-[10px] text-[#7B8794]">
                  Databricks Lakehouse Career AI
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullGenie();
                }}
                className="p-1.5 rounded-lg text-[#7B8794] hover:text-white hover:bg-[#102A43] transition-colors"
                title="Expand full Genie workspace"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#7B8794] hover:text-white hover:bg-[#102A43] transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAF9]/60 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] shrink-0 font-bold ${
                      isUser ? 'bg-[#102A43] text-white' : 'bg-[#167C80] text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                      isUser
                        ? 'bg-[#167C80] text-white rounded-tr-xs'
                        : 'bg-white border border-[#EEF3F2] text-[#0B1F33] shadow-xs rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        isUser ? 'text-white/70' : 'text-[#7B8794]'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-[#7B8794]">
                <div className="w-6 h-6 rounded-lg bg-[#167C80]/10 text-[#167C80] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-[#EEF3F2] px-3 py-2 rounded-xl text-[11px] flex items-center space-x-1.5 shadow-xs">
                  <span>Genie is querying Databricks Lakehouse...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-[#EEF3F2] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInput(qp);
                }}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-[#F8FAF9] hover:bg-[#EEF3F2] border border-[#D1D9E0] text-[#52606D] hover:text-[#0B1F33] shrink-0 whitespace-nowrap transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#EEF3F2] flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Genie about courses, electives, skills..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs text-[#17212B] placeholder-[#7B8794] focus:outline-none focus:ring-2 focus:ring-[#167C80]/30 focus:border-[#167C80]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-[#167C80] hover:bg-[#126467] disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2.5 px-4 py-3.5 rounded-full bg-[#167C80] hover:bg-[#126467] text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/20"
        title="Chat with Genie Assistant"
      >
        <div className="relative">
          <MessageSquareText className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
        </div>
        <span className="font-display font-bold text-sm tracking-wide">
          Genie
        </span>
        <Sparkles className="w-4 h-4 text-[#C9A96E] animate-pulse" />
      </button>
    </div>
  );
};
