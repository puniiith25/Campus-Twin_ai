/**
 * Campus Twin - Meaningful Loading Sequence
 * Shows the multi-phase data connection process before rendering the main dashboard.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, Database, CheckCircle2, Sparkles } from 'lucide-react';

interface BuildingCareerTwinLoaderProps {
  onComplete: () => void;
  studentName: string;
}

const PHASES = [
  'Understanding your academic profile...',
  'Mapping your skills and interests...',
  'Connecting your profile with career and campus opportunity data...',
  'Finding the most useful next steps for you...',
];

export const BuildingCareerTwinLoader: React.FC<BuildingCareerTwinLoaderProps> = ({
  onComplete,
  studentName,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhaseIndex((prev) => {
        if (prev < PHASES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 700);
          return prev;
        }
      });
    }, 850);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F33]/90 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#EEF3F2] shadow-2xl text-center">
        {/* Animated Branching Logo */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#EEF3F2] border border-[#167C80]/30 flex items-center justify-center relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#167C80]/40"
          />
          <GitBranch className="w-8 h-8 text-[#167C80]" />
        </div>

        <h2 className="font-display text-2xl font-bold text-[#0B1F33] mb-2">
          Building your Career Twin...
        </h2>
        <p className="text-xs text-[#7B8794] mb-6">
          Synthesizing student intelligence for {studentName || 'Student'}
        </p>

        {/* Progress Bars */}
        <div className="w-full bg-[#EEF3F2] h-2 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-[#167C80]"
            initial={{ width: '10%' }}
            animate={{ width: `${((currentPhaseIndex + 1) / PHASES.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Phase List with Checkmarks */}
        <div className="space-y-3 text-left">
          {PHASES.map((phase, idx) => {
            const isDone = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 text-xs p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-[#EEF3F2] text-[#0B1F33] font-medium'
                    : isDone
                    ? 'text-[#1F8A70]'
                    : 'text-[#7B8794] opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1F8A70] shrink-0 mt-0.5" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#167C80] border-t-transparent animate-spin shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#D1D9E0] shrink-0 mt-0.5" />
                )}
                <span>{phase}</span>
              </div>
            );
          })}
        </div>

        {/* Lakehouse Security Tagline */}
        <div className="mt-6 pt-4 border-t border-[#EEF3F2] flex items-center justify-center space-x-2 text-[11px] text-[#7B8794]">
          <Database className="w-3.5 h-3.5 text-[#167C80]" />
          <span>Databricks Lakehouse Vector Indexing</span>
        </div>
      </div>
    </div>
  );
};
