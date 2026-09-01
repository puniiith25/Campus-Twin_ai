/**
 * Campus Twin - Edit Profile Drawer
 * Instant reactivity: modifying any academic, skill, or schedule parameter recalculates all intelligence views.
 */

import React, { useState } from 'react';
import {
  X,
  Check,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  GraduationCap,
  Wrench,
  Clock,
  Target,
} from 'lucide-react';
import { StudentProfile, StudentSkill, SkillProficiency } from '../types';
import { SKILLS_CATALOG, MASTER_CAREER_ROLES } from '../data/campusIntelligenceData';

interface EditProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
}

export const EditProfileDrawer: React.FC<EditProfileDrawerProps> = ({
  isOpen,
  onClose,
  student,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(student.name);
  const [department, setDepartment] = useState(student.department);
  const [semester, setSemester] = useState(student.semester);
  const [cgpa, setCgpa] = useState(student.cgpa);
  const [weeklyHours, setWeeklyHours] = useState(student.weeklyHours);
  const [careerGoal, setCareerGoal] = useState(student.careerGoal);
  const [skills, setSkills] = useState<StudentSkill[]>(student.skills);
  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skillName: string) => {
    const existing = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (existing) {
      setSkills(skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setSkills([...skills, { name: skillName, level: 'Intermediate' }]);
    }
  };

  const updateSkillLevel = (skillName: string, level: SkillProficiency) => {
    setSkills(
      skills.map((s) => (s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s))
    );
  };

  const [activeDrawerTab, setActiveDrawerTab] = useState<'overview' | 'edit'>('overview');

  const addCustom = () => {
    if (customSkill.trim()) {
      if (!skills.some((s) => s.name.toLowerCase() === customSkill.trim().toLowerCase())) {
        setSkills([...skills, { name: customSkill.trim(), level: 'Intermediate' }]);
      }
      setCustomSkill('');
    }
  };

  const handleSave = () => {
    const updated: StudentProfile = {
      ...student,
      name,
      department,
      semester,
      year: Math.ceil(semester / 2),
      cgpa: Number(cgpa) || 8.0,
      weeklyHours: Number(weeklyHours) || 6,
      careerGoal,
      skills,
      updatedAt: new Date().toISOString(),
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F33]/80 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between text-[#17212B] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B1F33] text-white p-5 border-b border-[#102A43]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#167C80] text-white font-bold text-base flex items-center justify-center shadow-xs">
                {name.charAt(0)}
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white">
                  {name}
                </h2>
                <p className="text-xs text-white/70">
                  {department} · Semester {semester} ({cgpa} CGPA)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Tab Switcher */}
          <div className="flex items-center space-x-2 mt-4 bg-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveDrawerTab('overview')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeDrawerTab === 'overview'
                  ? 'bg-white text-[#0B1F33] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Profile Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawerTab('edit')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeDrawerTab === 'edit'
                  ? 'bg-white text-[#0B1F33] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Edit Parameters
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        {activeDrawerTab === 'overview' ? (
          <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-1">
                <span className="text-[11px] font-bold text-[#7B8794] uppercase tracking-wider">Target Goal</span>
                <p className="text-sm font-extrabold text-[#167C80]">{careerGoal}</p>
                <span className="text-[10px] text-[#1F8A70] font-semibold">Active Target Role</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-1">
                <span className="text-[11px] font-bold text-[#7B8794] uppercase tracking-wider">Weekly Budget</span>
                <p className="text-sm font-extrabold text-[#0B1F33]">{weeklyHours} Hours / Wk</p>
                <span className="text-[10px] text-[#52606D]">Extracurricular fit</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-1">
                <span className="text-[11px] font-bold text-[#7B8794] uppercase tracking-wider">Academic Standing</span>
                <p className="text-sm font-extrabold text-[#0B1F33]">{cgpa} CGPA</p>
                <span className="text-[10px] text-[#1F8A70] font-semibold">Placement cut-off cleared</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#EEF3F2] space-y-1">
                <span className="text-[11px] font-bold text-[#7B8794] uppercase tracking-wider">Skill Inventory</span>
                <p className="text-sm font-extrabold text-[#0B1F33]">{skills.length} Skills</p>
                <span className="text-[10px] text-[#52606D]">In technical matrix</span>
              </div>
            </div>

            {/* Current Skills List */}
            <div className="space-y-2 pt-2 border-t border-[#EEF3F2]">
              <h3 className="font-bold text-[#0B1F33] uppercase tracking-wider text-[11px]">
                Active Technical Matrix
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.name}
                    className="px-3 py-1 bg-[#EEF3F2] text-[#0B1F33] font-semibold text-xs rounded-xl border border-[#D1D9E0]/60"
                  >
                    {s.name} <span className="text-[10px] text-[#167C80]">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick action button to switch to edit */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveDrawerTab('edit')}
                className="w-full py-2.5 bg-[#EEF3F2] hover:bg-[#D1D9E0] text-[#0B1F33] font-bold rounded-xl text-xs transition-colors"
              >
                Edit Academic & Skill Parameters →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
            {/* Basics */}
            <div className="space-y-3">
              <h3 className="font-bold text-[#0B1F33] uppercase tracking-wider text-[11px]">
                Academic Credentials
              </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#52606D] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#52606D] mb-1">
                  CGPA (0.0 - 10.0)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs font-bold text-[#167C80]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#52606D] mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                  className="w-full p-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs font-medium"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#52606D] mb-1">
                  Weekly Hours
                </label>
                <select
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                  className="w-full p-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs font-medium"
                >
                  {[2, 4, 6, 8, 10, 12, 16].map((h) => (
                    <option key={h} value={h}>
                      {h} hrs / week
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Target Role */}
          <div className="space-y-2 pt-2 border-t border-[#EEF3F2]">
            <h3 className="font-bold text-[#0B1F33] uppercase tracking-wider text-[11px]">
              Career Trajectory Target
            </h3>
            <select
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs font-bold text-[#0B1F33]"
            >
              {MASTER_CAREER_ROLES.map((r) => (
                <option key={r.id} value={r.title}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Management */}
          <div className="space-y-3 pt-2 border-t border-[#EEF3F2]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#0B1F33] uppercase tracking-wider text-[11px]">
                Skills & Proficiency ({skills.length})
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="flex-1 p-2 rounded-xl bg-[#F8FAF9] border border-[#D1D9E0] text-xs"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
              />
              <button
                type="button"
                onClick={addCustom}
                className="px-3 py-2 rounded-xl bg-[#0B1F33] text-white text-xs font-medium"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-2 rounded-xl bg-[#F8FAF9] border border-[#EEF3F2] flex items-center justify-between"
                >
                  <span className="font-semibold text-[#0B1F33]">{skill.name}</span>
                  <div className="flex items-center space-x-1">
                    {(['Beginner', 'Intermediate', 'Advanced'] as SkillProficiency[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateSkillLevel(skill.name, lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                          skill.level === lvl
                            ? 'bg-[#167C80] text-white'
                            : 'bg-[#EEF3F2] text-[#52606D] hover:bg-[#D1D9E0]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill.name)}
                      className="p-1 text-[#7B8794] hover:text-[#C53030]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

        {/* Footer */}
        <div className="bg-[#F8FAF9] p-4 border-t border-[#EEF3F2] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#52606D] hover:text-[#0B1F33]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#167C80] hover:bg-[#126467] text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
