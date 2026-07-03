/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Calendar, Play, Trophy, GitMerge, Award, Brain } from "lucide-react";

interface Tab {
  id: string;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

// Map of tab IDs to corresponding Lucide icons
const TAB_ICONS: Record<string, React.ComponentType<any>> = {
  partidos: Calendar,
  eliminatorias: Play,
  grupos: Trophy,
  siguientes_fases: GitMerge,
  goleadores: Award,
  leaderboard: Brain,
};

// Map of clean display names (removing the emoji prefix for the bottom nav)
const TAB_LABELS_CLEAN: Record<string, string> = {
  partidos: "Partidos",
  eliminatorias: "Simular",
  grupos: "Grupos",
  siguientes_fases: "Playoffs",
  goleadores: "Goleadores",
  leaderboard: "Agentes",
};

export default function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <>
      {/* 1. DESKTOP TABS: Sticky at the top (Visible on screens >= 640px) */}
      <div className="hidden sm:block border-b border-blue-500/20 bg-slate-950/60 backdrop-blur-md px-4 sticky top-0 z-40">
        <nav id="navigation-tabs-desktop" className="flex gap-1 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const IconComponent = TAB_ICONS[tab.id];

            return (
              <button
                key={tab.id}
                id={`tab-desktop-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 select-none cursor-pointer ${
                  isActive
                    ? "text-black bg-emerald-400 font-bold shadow-lg shadow-emerald-500/10"
                    : "text-blue-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-lime-300 opacity-90 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                {tab.label.replace(/^[\u2300-\u27BF|⚽|🏆|🥊|🥇|🧠]\s*/, "")}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. MOBILE BOTTOM NAVIGATION: Fixed at the bottom (Visible on screens < 640px) */}
      <div className="block sm:hidden fixed bottom-0 left-0 right-0 z-50 max-w-[640px] mx-auto bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] px-2 pb-safe-bottom">
        <nav id="navigation-tabs-mobile" className="grid grid-cols-6 gap-0.5 py-2.5">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const IconComponent = TAB_ICONS[tab.id];
            const cleanLabel = TAB_LABELS_CLEAN[tab.id] || tab.label;

            return (
              <button
                key={tab.id}
                id={`tab-mobile-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center gap-1 py-1 text-center transition-all duration-300 select-none cursor-pointer group"
              >
                {/* Visual active bubble / background trace */}
                <div 
                  className={`flex items-center justify-center h-7 w-12 rounded-full transition-all duration-300 ${
                    isActive 
                      ? "bg-emerald-400/20 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.15)] scale-110" 
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                </div>

                {/* Text Label */}
                <span 
                  className={`text-[8.5px] font-bold tracking-tight transition-colors duration-300 truncate max-w-full px-0.5 ${
                    isActive ? "text-emerald-400 font-extrabold" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {cleanLabel}
                </span>

                {/* Animated active dot below label */}
                {isActive && (
                  <motion.div 
                    layoutId="activeDotMobile"
                    className="absolute bottom-[-2px] h-1 w-1 rounded-full bg-emerald-400"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
