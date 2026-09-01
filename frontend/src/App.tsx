/**
 * Campus Twin - Student Career Intelligence Platform
 * Main Application Hub & State Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, CareerRole, SkillProficiency } from './types';
import { DEFAULT_DEMO_PROFILE, MASTER_CAREER_ROLES } from './data/campusIntelligenceData';
import {
  calculateProfileReadiness,
  getStrengthsAndGaps,
  getAnalyzedCareerRoles,
} from './services/careerIntelligenceEngine';

import { syncProfileWithBackend } from './services/api';

// Components
import { Navigation, NavTab } from './components/Navigation';
import { WelcomeLanding } from './components/WelcomeLanding';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { BuildingCareerTwinLoader } from './components/BuildingCareerTwinLoader';
import { MainDashboard } from './components/MainDashboard';
import { CareerMapView } from './components/CareerMapView';
import { CategoryHubAndOpportunities } from './components/CategoryHubAndOpportunities';
import { PlacementsView } from './components/PlacementsView';
import { SkillGapView } from './components/SkillGapView';
import { PersonalizedRoadmapView } from './components/PersonalizedRoadmapView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { GenieChatAssistant } from './components/GenieChatAssistant';
import { EditProfileDrawer } from './components/EditProfileDrawer';
import { CareerPathPromptModal } from './components/CareerPathPromptModal';
import { FloatingGenieChatbot } from './components/FloatingGenieChatbot';

export default function App() {
  // Session / Local Storage Persistence
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('campus_twin_student_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [viewState, setViewState] = useState<'welcome' | 'app'>(student ? 'app' : 'welcome');
  const [currentTab, setCurrentTab] = useState<NavTab>('profile');

  // Career Path Mandatory Notification Modal state:
  // Shows immediately if user hasn't set a profile or career path
  const [isCareerPathPromptOpen, setIsCareerPathPromptOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('campus_twin_student_profile');
      return !saved; // Show by default on first entry
    } catch {
      return true;
    }
  });

  // Modals & Drawers
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupInitialPrompt, setSetupInitialPrompt] = useState<string | undefined>(undefined);
  const [isBuildingLoaderOpen, setIsBuildingLoaderOpen] = useState(false);
  const [pendingBuiltProfile, setPendingBuiltProfile] = useState<StudentProfile | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedRoleForGaps, setSelectedRoleForGaps] = useState<string | undefined>(undefined);

  // Sync to LocalStorage and backend
  useEffect(() => {
    if (student) {
      localStorage.setItem('campus_twin_student_profile', JSON.stringify(student));
      syncProfileWithBackend(student);
    }
  }, [student]);

  // Handle Demo Profile Selection
  const handleUseDemoProfile = () => {
    setIsCareerPathPromptOpen(false);
    setPendingBuiltProfile(DEFAULT_DEMO_PROFILE);
    setIsBuildingLoaderOpen(true);
  };

  // Handle Profile Building complete
  const handleProfileBuilt = (newProfile: StudentProfile) => {
    setIsSetupModalOpen(false);
    setIsCareerPathPromptOpen(false);
    setPendingBuiltProfile(newProfile);
    setIsBuildingLoaderOpen(true);
  };

  // Complete Building Loader
  const handleBuildingLoaderComplete = () => {
    if (pendingBuiltProfile) {
      setStudent(pendingBuiltProfile);
      setViewState('app');
      setCurrentTab('dashboard');
    }
    setIsBuildingLoaderOpen(false);
  };

  // Start path CTA
  const handleStartPath = () => {
    setIsCareerPathPromptOpen(false);
    setSetupInitialPrompt(undefined);
    setIsSetupModalOpen(true);
  };

  // Open Natural setup with prompt
  const handleOpenNaturalSetup = (prompt?: string) => {
    setIsCareerPathPromptOpen(false);
    setSetupInitialPrompt(prompt);
    setIsSetupModalOpen(true);
  };

  // Reset / Return to welcome
  const handleResetToWelcome = () => {
    setViewState('welcome');
  };

  // Calculations on current student
  const activeStudent = student || DEFAULT_DEMO_PROFILE;
  const readiness = calculateProfileReadiness(activeStudent, activeStudent.careerGoal);
  const { strengths, gaps } = getStrengthsAndGaps(activeStudent, activeStudent.careerGoal);
  const analyzedRoles = getAnalyzedCareerRoles(activeStudent);

  const handleSelectRoleFromMap = (role: CareerRole) => {
    setSelectedRoleForGaps(role.title);
    setCurrentTab('skillgaps');
  };

  const handleSetTargetRole = (roleTitle: string) => {
    if (student) {
      const updated: StudentProfile = {
        ...student,
        careerGoal: roleTitle,
        updatedAt: new Date().toISOString(),
      };
      setStudent(updated);
    }
  };

  const handleApplyScenario = (updatedParams: {
    careerGoal: string;
    weeklyHours: number;
    skills: { name: string; level: SkillProficiency }[];
    primaryFocus: 'career' | 'research' | 'entrepreneurship';
  }) => {
    if (student) {
      const updated: StudentProfile = {
        ...student,
        careerGoal: updatedParams.careerGoal,
        weeklyHours: updatedParams.weeklyHours,
        skills: updatedParams.skills,
        primaryFocus: updatedParams.primaryFocus,
        updatedAt: new Date().toISOString(),
      };
      setStudent(updated);
      setCurrentTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#17212B] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (viewState === 'welcome' && student) {
            setViewState('app');
          }
          setCurrentTab(tab);
        }}
        student={student}
        onOpenEditProfile={() => setIsEditDrawerOpen(true)}
        onOpenDatabricksModal={() => setIsDatabricksModalOpen(true)}
        onOpenGenie={() => {
          if (viewState === 'welcome') setViewState('app');
          setCurrentTab('genie');
        }}
        onResetToWelcome={handleResetToWelcome}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewState === 'welcome' ? (
          <WelcomeLanding
            onStartPath={handleStartPath}
            onUseDemoProfile={handleUseDemoProfile}
            onOpenNaturalSetup={handleOpenNaturalSetup}
            onOpenGenie={() => {
              handleUseDemoProfile();
              setTimeout(() => setCurrentTab('genie'), 300);
            }}
          />
        ) : (
          <div>
            {(currentTab === 'dashboard' || currentTab === 'profile') && (
              <MainDashboard
                student={activeStudent}
                readiness={readiness}
                strengths={strengths}
                gaps={gaps}
                topRoles={analyzedRoles}
                onOpenEditProfile={() => setIsEditDrawerOpen(true)}
                onNavigate={(tab) => setCurrentTab(tab)}
                onSelectRole={(role) => {
                  setSelectedRoleForGaps(role.title);
                  setCurrentTab('careermap');
                }}
              />
            )}

            {currentTab === 'careermap' && (
              <CareerMapView
                student={activeStudent}
                roles={analyzedRoles}
                onSelectRoleForGaps={handleSelectRoleFromMap}
                onSetTargetRole={handleSetTargetRole}
              />
            )}

            {currentTab === 'opportunities' && (
              <CategoryHubAndOpportunities
                student={activeStudent}
                onNavigate={(tab) => setCurrentTab(tab)}
                onSelectRoleForGaps={(roleTitle) => {
                  setSelectedRoleForGaps(roleTitle);
                  setCurrentTab('skillgaps');
                }}
              />
            )}

            {currentTab === 'placements' && (
              <PlacementsView
                student={activeStudent}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'skillgaps' && (
              <SkillGapView
                student={activeStudent}
                initialRoleTitle={selectedRoleForGaps || activeStudent.careerGoal}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'roadmap' && (
              <PersonalizedRoadmapView
                student={activeStudent}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'whatif' && (
              <WhatIfSimulator
                student={activeStudent}
                onApplyScenarioToProfile={handleApplyScenario}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'genie' && (
              <GenieChatAssistant
                student={activeStudent}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}
          </div>
        )}
      </main>

      {/* Profile Creation Modal */}
      <ProfileSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onProfileBuilt={handleProfileBuilt}
        initialPrompt={setupInitialPrompt}
      />

      {/* Building Career Twin Sequence Loader */}
      {isBuildingLoaderOpen && (
        <BuildingCareerTwinLoader
          studentName={pendingBuiltProfile?.name || 'Student'}
          onComplete={handleBuildingLoaderComplete}
        />
      )}

      {/* Quick Edit Profile Slide-Over Drawer */}
      {student && (
        <EditProfileDrawer
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          student={student}
          onSaveProfile={(updated) => setStudent(updated)}
        />
      )}

      {/* Mandatory Initial Career Path Setup Notification Modal */}
      <CareerPathPromptModal
        isOpen={isCareerPathPromptOpen}
        onSetCareerPath={handleStartPath}
        onUseDemoProfile={handleUseDemoProfile}
        onDismiss={() => setIsCareerPathPromptOpen(false)}
        hasProfile={!!student}
      />

      {/* Floating Genie Chatbot in Right Bottom */}
      <FloatingGenieChatbot
        student={activeStudent}
        onOpenFullGenie={() => {
          if (viewState === 'welcome') setViewState('app');
          setCurrentTab('genie');
        }}
      />
    </div>
  );
}
