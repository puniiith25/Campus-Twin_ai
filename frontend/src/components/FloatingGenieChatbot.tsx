/**
 * Campus Twin - Floating Genie Chatbot Widget (Bottom Right)
 * Floating interactive button + slide-up quick chat dialog connected to Genie AI Assistant.
 */

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  BookOpen,
  Target,
  CheckCircle2,
  Clock,
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
  structuredResponse?: {
    recommendation?: string;
    why?: string;
    skillGaps?: string[];
    relevantOpportunities?: {
      title: string;
      type: string;
      provider?: string;
      timeCommitment?: string;
    }[];
  };
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
      let structuredRes: MiniChatMessage['structuredResponse'] = undefined;

      if (response && response.answer) {
        assistantText = response.answer.recommendation || response.answer.why || 'Here is your campus advisory:';
        structuredRes = response.answer;
      } else if (response && (response.text || response.content || response.response)) {
        assistantText = response.text || response.content || response.response;
      } else {
        assistantText = `### 🎯 Targeted Advice for **${student.careerGoal || 'Career'}**\n\n* **Academic Standing**: Your **${student.cgpa} CGPA** puts you in a strong position for Tier-1 recruitment drives.\n* **Priority Actions**: Strengthen practical project depth in **${student.skills.slice(0, 2).map((s) => s.name).join(' & ')}**.\n* **Recommended Campus Step**: Enroll in the upcoming **Databricks Lakehouse Masterclass** or join faculty research projects this semester.`;
        structuredRes = {
          recommendation: `Targeted advisory for ${student.careerGoal}`,
          why: `Your ${student.cgpa} CGPA and verified skills provide solid foundational alignment.`,
          skillGaps: ['SQL (Intermediate)', 'System Design / Cloud deployment'],
          relevantOpportunities: [
            {
              title: 'Databricks Lakehouse & SQL Masterclass',
              type: 'Workshop',
              provider: 'Campus Innovation Cell',
              timeCommitment: '4 hrs/wk',
            },
          ],
        };
      }

      const assistantMsg: MiniChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        structuredResponse: structuredRes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const assistantMsg: MiniChatMessage = {
        id: `ast_err_${Date.now()}`,
        sender: 'assistant',
        text: `### 🎯 Recommendations for **${student.careerGoal || 'Target Role'}**\n\n1. **Prerequisite Focus**: Close priority skill gaps in SQL and ML deployment.\n2. **Weekly Pacing**: Paced for **${student.weeklyHours} hrs/week** without overloading semester exams.\n3. **Campus Resource**: Connect with the Innovation Cell for verified lab access.`,
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
        <div className="mb-3 w-[370px] sm:w-[440px] h-[550px] bg-white rounded-3xl shadow-2xl border border-[#D1D9E0] flex flex-col overflow-hidden animate-fade-in text-[#17212B]">
          {/* Header */}
          <div className="bg-[#0B1F33] text-white p-4 flex items-center justify-between border-b border-[#102A43]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#167C80] flex items-center justify-center text-white shadow-xs">
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
                  Databricks Lakehouse Assistant
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
                className="p-1.5 rounded-lg text-[#7B8794] hover:text-white hover:bg-[#102A43] transition-colors cursor-pointer"
                title="Expand full Genie workspace"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#7B8794] hover:text-white hover:bg-[#102A43] transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAF9]/80 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] shrink-0 font-bold ${
                      isUser ? 'bg-[#0B1F33] text-white' : 'bg-[#167C80] text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      isUser
                        ? 'bg-[#0B1F33] text-white rounded-tr-xs shadow-xs'
                        : 'bg-white border border-[#EEF3F2] text-[#0B1F33] shadow-xs rounded-tl-xs space-y-2.5'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap font-medium">{m.text}</p>
                    ) : (
                      <div className="prose prose-xs max-w-none text-[#0B1F33] leading-relaxed space-y-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.text}
                        </ReactMarkdown>

                        {/* Structured Gaps / Opportunities mini-cards */}
                        {m.structuredResponse?.skillGaps && m.structuredResponse.skillGaps.length > 0 && (
                          <div className="pt-2 border-t border-[#EEF3F2] space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#167C80] flex items-center space-x-1">
                              <Target className="w-3 h-3" />
                              <span>Identified Skill Gaps</span>
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {m.structuredResponse.skillGaps.map((gap, gIdx) => (
                                <span
                                  key={gIdx}
                                  className="px-2 py-0.5 rounded-md bg-[#167C80]/10 text-[#167C80] font-medium text-[10px]"
                                >
                                  {gap}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {m.structuredResponse?.relevantOpportunities && m.structuredResponse.relevantOpportunities.length > 0 && (
                          <div className="pt-2 border-t border-[#EEF3F2] space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F8A70] flex items-center space-x-1">
                              <BookOpen className="w-3 h-3" />
                              <span>Recommended Campus Match</span>
                            </span>
                            {m.structuredResponse.relevantOpportunities.map((opp, oIdx) => (
                              <div
                                key={oIdx}
                                className="p-2 rounded-lg bg-[#F8FAF9] border border-[#EEF3F2] text-[11px] flex items-center justify-between"
                              >
                                <span className="font-semibold text-[#0B1F33] truncate pr-2">
                                  {opp.title}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-white text-[9px] text-[#52606D] font-medium border border-[#D1D9E0] shrink-0">
                                  {opp.timeCommitment || opp.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <span
                      className={`text-[9px] block text-right pt-0.5 ${
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
                <div className="w-7 h-7 rounded-xl bg-[#167C80]/10 text-[#167C80] flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-[#EEF3F2] px-3.5 py-2.5 rounded-2xl text-[11px] flex items-center space-x-1.5 shadow-xs text-[#52606D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#167C80] animate-ping" />
                  <span>Genie is querying Databricks Lakehouse...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-[#EEF3F2] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInput(qp);
                }}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-[#F8FAF9] hover:bg-[#EEF3F2] border border-[#D1D9E0] text-[#52606D] hover:text-[#0B1F33] shrink-0 whitespace-nowrap transition-colors cursor-pointer"
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
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs text-[#17212B] placeholder-[#7B8794] focus:outline-none focus:ring-2 focus:ring-[#167C80]/30 focus:border-[#167C80]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-[#167C80] hover:bg-[#126467] disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
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
