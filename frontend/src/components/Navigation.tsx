/**
 * Campus Twin - Navigation & TopBar
 * Locked palette: Deep Navy (#0B1F33), Teal (#167C80), Warm White (#F8FAF9)
 */

import React from 'react';
import {
  Compass,
  GitBranch,
  Sparkles,
  Briefcase,
  Target,
  Route,
  SlidersHorizontal,
  MessageSquareText,
  Database,
  User,
  ExternalLink,
} from 'lucide-react';
import { StudentProfile } from '../types';

export type NavTab =
  | 'profile'
  | 'careermap'
  | 'opportunities'
  | 'placements'
  | 'skillgaps'
  | 'roadmap'
  | 'whatif'
  | 'genie';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  student: StudentProfile | null;
  onOpenEditProfile: () => void;
  onOpenGenie: () => void;
  onResetToWelcome: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  student,
  onOpenEditProfile,
  onOpenGenie,
  onResetToWelcome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'careermap', label: 'Career Map', icon: GitBranch },
    { id: 'opportunities', label: 'Campus Ecosystem', icon: Sparkles },
    { id: 'placements', label: 'Placements', icon: Briefcase },
    { id: 'skillgaps', label: 'Skill Gaps', icon: Target },
    { id: 'roadmap', label: 'My Path', icon: Route },
    { id: 'whatif', label: 'What-If?', icon: SlidersHorizontal },
    { id: 'genie', label: 'Genie', icon: MessageSquareText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1F33] text-white border-b border-[#102A43] shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Wordmark */}
          <div className="flex items-center space-x-6">
            <button
              onClick={onResetToWelcome}
              className="flex items-center space-x-3 text-left group focus:outline-none"
              title="Return to Welcome Screen"
            >
              {/* Minimal converging / branching path logo */}
              <div className="w-9 h-9 rounded-lg bg-[#102A43] border border-[#167C80]/40 flex items-center justify-center text-[#167C80] group-hover:border-[#167C80] transition-colors">
                <svg
                  className="w-5 h-5 stroke-current text-[#167C80]"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 18c4 0 6-8 10-8h6" />
                  <path d="M4 6c4 0 6 8 10 8h6" />
                  <circle cx="4" cy="18" r="1.5" fill="#167C80" />
                  <circle cx="4" cy="6" r="1.5" fill="#167C80" />
                  <circle cx="20" cy="10" r="1.5" fill="#C9A96E" />
                  <circle cx="20" cy="14" r="1.5" fill="#1F8A70" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-display font-bold text-lg tracking-tight text-white">
                    Campus Twin
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#102A43] text-[#167C80] border border-[#167C80]/30">
                    Intelligence
                  </span>
                </div>
                <p className="text-[11px] text-[#7B8794] hidden sm:block">
                  Student Career Intelligence Platform
                </p>
              </div>
            </button>
          </div>

          {/* Center/Right Navigation Tabs (Desktop) */}
          <nav className="hidden xl:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isProfile = item.id === 'profile';
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${isActive
                      ? 'bg-[#167C80] text-white shadow-md'
                      : isProfile
                        ? 'bg-white/10 text-white hover:bg-white/15 border border-white/20'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  <span className="text-white">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex items-center space-x-2">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5 stroke-current text-white" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 px-2 border-t border-[#102A43] grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0B1F33]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                      ? 'bg-[#167C80] text-white shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  <span className="text-white truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Horizontal Quick Scroll for Tablets & Mobile */}
        <div className="xl:hidden flex items-center space-x-2 py-2 overflow-x-auto border-t border-[#102A43] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${isActive
                    ? 'bg-[#167C80] text-white shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-white/70'}`} />
                <span className="text-white">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
