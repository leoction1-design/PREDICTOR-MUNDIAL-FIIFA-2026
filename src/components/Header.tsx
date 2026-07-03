/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Calendar, Zap } from "lucide-react";

interface HeaderProps {
  lastSync: string;
}

export default function Header({ lastSync }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-b-2xl border-b border-blue-500/30 bg-gradient-to-r from-blue-700 via-blue-900 to-[#0b1e4e] p-6 shadow-lg shadow-blue-500/10">
      {/* Decorative soccer pitch grid lines overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Highlight radial glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 animate-pulse">
              <Zap className="h-3.5 w-3.5" /> EN VIVO • COPA MUNDIAL 2026
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {/* Custom SVG Modern Soccer Ball Icon (White Sphere with Blue, Green, Red Curved swooshes) */}
            <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-white shadow-md shadow-black/20 border border-slate-200/50 shrink-0 transform hover:scale-105 transition-transform duration-300">
              <svg
                className="h-9 w-9 sm:h-11 sm:w-11"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                id="header-soccer-ball-icon"
              >
                {/* Base white sphere with subtle 3D lighting shadow */}
                <circle cx="50" cy="50" r="46" fill="url(#whiteSphere)" />
                
                {/* Soft ambient inner shadow / glow */}
                <circle cx="50" cy="50" r="46" fill="url(#innerShade)" opacity="0.3" />
                
                {/* Elegant red dynamic curved stripe (swoosh) */}
                <path 
                  d="M16,38 C28,24 52,20 72,27 C58,32 42,42 34,58 C29,52 21,46 16,38 Z" 
                  fill="url(#redCurve)" 
                  filter="url(#subtleShadow)"
                />
                
                {/* Elegant blue dynamic curved stripe */}
                <path 
                  d="M34,58 C44,40 68,36 84,48 C74,56 60,62 50,78 C44,70 38,64 34,58 Z" 
                  fill="url(#blueCurve)" 
                  filter="url(#subtleShadow)"
                />
                
                {/* Elegant green dynamic curved stripe */}
                <path 
                  d="M50,78 C60,62 80,64 86,76 C74,84 54,86 50,78 Z" 
                  fill="url(#greenCurve)" 
                  filter="url(#subtleShadow)"
                />

                {/* Extra glowing cyan-blue trace line for futuristic touch */}
                <path 
                  d="M12,50 C26,28 74,28 88,50" 
                  stroke="url(#neonTrace)" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  opacity="0.6" 
                />

                {/* Overlapping soccer ball panels (subtle grey lines for authentic soccer ball shape) */}
                <path d="M50,4 C30,25 30,75 50,96" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
                <path d="M50,4 C70,25 70,75 50,96" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
                <path d="M4,50 C25,30 75,30 96,50" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
                <path d="M4,50 C25,70 75,70 96,50" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

                {/* High tech gloss highlight on the top left */}
                <ellipse cx="35" cy="22" rx="14" ry="7" transform="rotate(-30 35 22)" fill="#ffffff" opacity="0.5" />

                <defs>
                  {/* Subtle drop shadow filter */}
                  <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#020617" floodOpacity="0.2" />
                  </filter>
                  
                  {/* Radial 3D sphere gradient */}
                  <radialGradient id="whiteSphere" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="65%" stopColor="#fafaf9" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </radialGradient>
                  
                  {/* Inner shadow/ambient light gradient */}
                  <radialGradient id="innerShade" cx="50%" cy="50%" r="50%">
                    <stop offset="70%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.25" />
                  </radialGradient>

                  {/* Swoosh Gradients */}
                  <linearGradient id="redCurve" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff4b4b" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  
                  <linearGradient id="blueCurve" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  
                  <linearGradient id="greenCurve" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>

                  <linearGradient id="neonTrace" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <h1 id="app-title" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              2026 FIFA <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">SCORE PREDICT</span>
            </h1>
          </div>
          <p className="text-sm font-medium text-blue-200 mt-1">
            Simulador y Predictor del Mundial 2026
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 self-stretch sm:self-auto text-right">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-blue-500/20 text-xs text-blue-200 backdrop-blur-sm">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sincronizado: {lastSync}</span>
          </div>
          <div className="text-[10px] font-mono text-blue-400 tracking-wider">
            APP ID: com.mundial.simulador
          </div>
        </div>
      </div>
    </header>
  );
}
