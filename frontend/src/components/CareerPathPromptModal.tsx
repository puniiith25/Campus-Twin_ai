/**
 * Campus Twin - Career Path Requirement Notification Banner / Modal
 * Reminds new/incoming users that they must set their career path / profile before exploring.
 */

import React from 'react';
import {
  Compass,
  ArrowRight,
  Route,
  UserCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

interface CareerPathPromptModalProps {
  isOpen: boolean;
  onSetCareerPath: () => void;
  onUseDemoProfile: () => void;
  onDismiss?: () => void;
  hasProfile: boolean;
}

export const CareerPathPromptModal: React.FC<CareerPathPromptModalProps> = ({
  isOpen,
  onSetCareerPath,
  onUseDemoProfile,
  onDismiss,
  hasProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D1D9E0] relative overflow-hidden text-[#17212B]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#167C80] via-[#1F8A70] to-[#C9A96E]" />

        {/* Close/Dismiss Button (only if user already has an active profile) */}
        {hasProfile && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#7B8794] hover:text-[#0B1F33] hover:bg-[#EEF3F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#167C80]/10 border border-[#167C80]/20 flex items-center justify-center text-[#167C80] shrink-0">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#167C80] block">
              Step 1 Required
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1F33] tracking-tight">
              Set Your Career Path First
            </h2>
          </div>
        </div>

        <p className="text-sm text-[#52606D] leading-relaxed mb-5">
          Welcome to <strong className="text-[#0B1F33]">Campus Twin</strong>! To calculate your personalized readiness scores, generate your week-by-week roadmap, and diagnose skill gaps, <strong>you must first configure your career goal and profile</strong> before continuing.
        </p>

        {/* Value Highlights */}
        <div className="space-y-2.5 mb-6 p-4 rounded-2xl bg-[#F8FAF9] border border-[#EEF3F2] text-xs">
          <div className="flex items-center space-x-2.5 text-[#0B1F33] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#1F8A70] shrink-0" />
            <span>Multi-factor readiness calculation across your CGPA & skills</span>
          </div>
          <div className="flex items-center space-x-2.5 text-[#0B1F33] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#1F8A70] shrink-0" />
            <span>Interactive week-by-week actionable roadmap ("My Path")</span>
          </div>
          <div className="flex items-center space-x-2.5 text-[#0B1F33] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#1F8A70] shrink-0" />
            <span>Direct Lakehouse mapping to campus labs, electives & hackathons</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={onSetCareerPath}
            className="w-full flex items-center justify-center space-x-2 py-4 px-5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Set My Career Path & Target Role</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-center text-[#7B8794] mt-4">
          Takes under 60 seconds. You can modify your target role anytime from the profile drawer.
        </p>
      </div>
    </div>
  );
};
