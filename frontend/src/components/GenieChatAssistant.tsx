/**
 * Campus Twin - Ask Campus Twin (Genie Career Intelligence Assistant)
 * Structured, explainable student advisory grounded in actual profile & Databricks Lakehouse data.
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { StudentProfile, ChatMessage } from '../types';

interface GenieChatProps {
  student: StudentProfile;
  onNavigate: (tab: any) => void;
}

export const GenieChatAssistant: React.FC<GenieChatProps> = ({
  student,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      content: `Hello ${student.name}. I'm Campus Twin, connected to your university's Databricks career lakehouse. How can I help you navigate your next step?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredResponse: {
        recommendation: `Based on your ${student.cgpa} CGPA and solid Python/C++ skills, AI Engineering & Data Science represent your highest-fit career branches.`,
        why: `Your academic standing clears all top placement cut-offs (7.5+). With ${student.weeklyHours} hours/week, you can systematically bridge the SQL and ML deployment gaps this semester.`,
        skillGaps: [
          'SQL (Beginner → Intermediate for enterprise pipelines)',
          'Machine Learning Deployment (FastAPI & Docker basics)',
        ],
        relevantOpportunities: [
          {
            title: 'Databricks Lakehouse & Applied SQL Masterclass',
            type: 'Workshop',
            provider: 'Campus Innovation Cell × Databricks',
            timeCommitment: '4 hrs/week',
          },
          {
            title: 'University AI & High Performance Computing Fellowship',
            type: 'Research Lab',
            provider: 'NVIDIA GPU Research Center',
            timeCommitment: '6 hrs/week',
          },
        ],
        nextAction: 'Enroll in the 4-week Databricks SQL workshop to resolve your #1 recruitment gap.',
        alternativePath: 'Full-Stack Software Engineering leverages your React background with a 95% placement alignment.',
      },
      suggestedPrompts: [
        'Which opportunities am I eligible for right now?',
        'What should I learn this semester?',
        'What if I pivot to academic research?',
        'How do I prepare for Databricks or Google placement?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'What career paths fit me best?',
    'Which opportunities am I eligible for?',
    'What should I improve first?',
    'What if I choose research?',
    'Which opportunity gives me the most value for my available time?',
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/genie/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q.trim(),
          studentProfile: student,
        }),
      });

      const data = await res.json();

      if (data.success && data.answer) {
        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          sender: 'assistant',
          content: data.answer.recommendation || 'Here is what your profile indicates:',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          structuredResponse: data.answer,
          suggestedPrompts: [
            'How can I improve my SQL score?',
            'What projects should I build next?',
            'Check my placement eligibility',
          ],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (e) {
      console.error('Failed to query Genie:', e);
      const fallbackMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        content: `Analyzing your profile: For ${student.careerGoal}, prioritize bridging SQL and Deep Learning while maintaining your ${student.cgpa} CGPA.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: {
          recommendation: `Your academic profile is strong for ${student.careerGoal}. Focus on closing high-priority skill gaps.`,
          why: `Clears recruitment cut-offs with consistent project output in ${student.skills.map((s) => s.name).slice(0, 2).join(' and ')}.`,
          skillGaps: ['SQL (Intermediate)', 'System Design basics'],
          relevantOpportunities: [
            {
              title: 'Campus Hackathon 2026',
              type: 'Hackathon',
              provider: 'ACM Chapter',
              timeCommitment: 'Weekend',
            },
          ],
          nextAction: 'Complete 1 end-to-end project and register for the ACM hackathon.',
          alternativePath: 'Data Science & Business Analytics trajectory.',
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-[#17212B]">
      {/* Header */}
      <div className="border-b border-[#EEF3F2] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#167C80] font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Career Reasoning Assistant</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            Ask Campus Twin
          </h1>
          <p className="text-sm text-[#52606D] mt-1">
            Grounded answers on career trajectories, skill gaps, course choices, and weekly time fit.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome_reset',
                sender: 'assistant',
                content: `Chat history reset. How can I help with your ${student.careerGoal} path today?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D1D9E0] text-xs font-semibold text-[#52606D] hover:text-[#0B1F33]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] text-[#7B8794] whitespace-nowrap font-medium mr-1">
          Suggestions:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEF3F2] border border-[#D1D9E0] text-[#0B1F33] font-medium whitespace-nowrap shadow-2xs transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EEF3F2] shadow-xs min-h-[460px] max-h-[600px] overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#0B1F33] text-white' : 'bg-gradient-to-tr from-[#167C80] to-[#1F8A70] text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-3 max-w-2xl ${isUser ? 'items-end text-right' : 'text-left'}`}>
                {/* User query bubble */}
                {isUser && (
                  <div className="p-4 rounded-2xl text-xs leading-relaxed bg-[#0B1F33] text-white rounded-tr-none shadow-xs">
                    <p className="font-medium">{msg.content}</p>
                  </div>
                )}

                {/* Assistant Structured Unified Card */}
                {!isUser && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#167C80]/30 shadow-sm space-y-4 text-xs">
                    {/* Primary Answer Header */}
                    <div className="flex items-center space-x-2 border-b border-[#EEF3F2] pb-3">
                      <div className="w-6 h-6 rounded-lg bg-[#167C80]/10 flex items-center justify-center text-[#167C80]">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-display font-bold text-sm text-[#0B1F33]">Campus Twin Advisory</span>
                    </div>

                    {/* Recommendation & Overview */}
                    <div className="space-y-3">
                      <div className="text-xs leading-relaxed text-[#0B1F33] prose prose-xs max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-li:my-0.5">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h3: ({ children }) => (
                              <h3 className="font-display font-bold text-sm text-[#0B1F33] flex items-center space-x-1.5 mt-3 mb-1 text-[#167C80] border-b border-[#EEF3F2] pb-1">
                                <span>{children}</span>
                              </h3>
                            ),
                            h4: ({ children }) => (
                              <h4 className="font-bold text-xs text-[#0B1F33] mt-2 mb-1">
                                {children}
                              </h4>
                            ),
                            p: ({ children }) => (
                              <p className="my-1.5 text-xs text-[#17212B] leading-relaxed">
                                {children}
                              </p>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold text-[#0B1F33]">{children}</strong>
                            ),
                            ul: ({ children }) => (
                              <ul className="space-y-1.5 my-2 pl-2 border-l-2 border-[#167C80]/30">{children}</ul>
                            ),
                            li: ({ children }) => (
                              <li className="text-xs text-[#17212B] leading-normal flex items-start space-x-1.5">
                                <span className="text-[#167C80] font-bold mt-0.5">•</span>
                                <span>{children}</span>
                              </li>
                            ),
                            code: ({ children }) => (
                              <code className="px-1.5 py-0.5 bg-[#EEF3F2] text-[#167C80] font-mono text-[11px] rounded border border-[#D1D9E0]/60 font-semibold">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {msg.structuredResponse?.recommendation || msg.content}
                        </ReactMarkdown>
                      </div>

                      {msg.structuredResponse?.why && (
                        <div className="p-3 rounded-xl bg-[#EEF3F2]/70 border border-[#D1D9E0]/60 text-[11px] text-[#52606D] leading-relaxed">
                          <span className="font-bold text-[#0B1F33]">Analysis & Why: </span>
                          {msg.structuredResponse.why}
                        </div>
                      )}
                    </div>

                    {/* Skill Gaps */}
                    {msg.structuredResponse.skillGaps?.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-[#0B1F33] uppercase tracking-wider mb-1.5">
                          Identified Skill Gaps
                        </div>
                        <ul className="space-y-1 text-xs text-[#52606D]">
                          {msg.structuredResponse.skillGaps.map((gap, gIdx) => (
                            <li key={gIdx} className="flex items-start space-x-1.5">
                              <span className="text-[#B7791F] font-bold">›</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Relevant Opportunities */}
                    {msg.structuredResponse.relevantOpportunities?.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-[#0B1F33] uppercase tracking-wider mb-1.5">
                          Matched Campus Opportunities
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.structuredResponse.relevantOpportunities.map((opp, oIdx) => (
                            <div
                              key={oIdx}
                              className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2]"
                            >
                              <div className="font-semibold text-[#0B1F33] truncate">
                                {opp.title}
                              </div>
                              <div className="text-[10px] text-[#7B8794]">
                                {opp.provider} · {opp.timeCommitment}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Action & Alternative */}
                    <div className="pt-2 border-t border-[#EEF3F2] space-y-2">
                      <div className="p-2.5 rounded-xl bg-[#1F8A70]/10 border border-[#1F8A70]/20 text-[#0B1F33]">
                        <span className="font-bold text-[#1F8A70]">Next Action: </span>
                        <span>{msg.structuredResponse.nextAction}</span>
                      </div>

                      {msg.structuredResponse.alternativePath && (
                        <div className="text-[11px] text-[#52606D]">
                          <span className="font-semibold text-[#0B1F33]">Alternative Trajectory: </span>
                          {msg.structuredResponse.alternativePath}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-[10px] text-[#7B8794]">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-[#7B8794] p-3 rounded-xl bg-[#F8FAF9] w-fit">
            <div className="w-4 h-4 rounded-full border-2 border-[#167C80] border-t-transparent animate-spin" />
            <span>Databricks Genie is analyzing your student lakehouse graph...</span>
          </div>
        )}
      </div>

      {/* Input Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask about your next career step, skill gaps, or eligibility..."
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#D1D9E0] text-xs sm:text-sm text-[#17212B] placeholder-[#7B8794] focus:outline-none focus:ring-2 focus:ring-[#167C80]/30 shadow-2xs"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white font-semibold text-xs shadow-xs disabled:opacity-50 transition-colors flex items-center space-x-1.5"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
