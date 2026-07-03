/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { Match, Team, SyncLogEntry } from "../types";
import { TEAMS } from "../data";
import { Calendar, Play, RefreshCw, Trophy, Clock, Landmark, Zap, Server, ChevronRight } from "lucide-react";

interface MatchesViewProps {
  matches: Match[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onMatchSelect: (match: Match) => void;
  onSimulate: () => void;
  onReset: () => void;
  currentTime: string;
  syncLogs: SyncLogEntry[];
  refinementLogs: string[];
  onSyncSixHours: () => void;
  onSyncSingleMatch: (matchId: string) => void;
}

export default function MatchesView({
  matches,
  selectedDate,
  onDateChange,
  onMatchSelect,
  onSimulate,
  onReset,
  currentTime,
  syncLogs,
  refinementLogs,
  onSyncSixHours,
  onSyncSingleMatch,
}: MatchesViewProps) {
  // Extract all unique dates present in matches in chronological order
  const uniqueDates = useMemo(() => {
    const dates = matches.map((m) => m.date);
    return Array.from(new Set(dates)).sort((a, b) => {
      const dayA = parseInt(a.split(" ")[0]);
      const dayB = parseInt(b.split(" ")[0]);
      return dayA - dayB;
    });
  }, [matches]);

  // Filter matches of selected day
  const matchesOfDay = useMemo(() => {
    return matches.filter((m) => m.date === selectedDate);
  }, [matches, selectedDate]);

  // Statistics
  const pendingCount = useMemo(() => matches.filter((m) => !m.finished).length, [matches]);
  const finishedCount = useMemo(() => matches.filter((m) => m.finished).length, [matches]);

  return (
    <div id="matches-tab-view" className="p-4 space-y-6 animate-fadein">
      {/* FIFA Live Sync and Agent Calibration Widget */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 p-5 shadow-lg relative overflow-hidden">
        {/* Radial subtle glow */}
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl" />
        
        <div className="flex flex-col md:flex-row gap-5 justify-between">
          {/* Timeline & Action Control */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="h-4 w-4" /> Servidor de Sincronización FIFA.com (Al Instante)
              </h3>
            </div>
            
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400 font-medium">Cronograma del Campeonato:</div>
              <div className="text-xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                <span>{currentTime}</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">UTC-6</span>
              </div>
              <p className="text-[11px] text-blue-200">
                Sincroniza los marcadores reales con FIFA.com en cualquier momento. El sistema recalibrará automáticamente los modelos matemáticos de los agentes al instante.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-sync-6h"
                onClick={onSyncSixHours}
                disabled={pendingCount === 0}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 ${
                  pendingCount > 0
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Zap className="h-3.5 w-3.5 fill-current" /> Sincronizar Marcadores Ahora
              </button>
              
              <div className="text-[10px] text-slate-400 font-mono">
                Sincronización: <span className="text-emerald-400 font-bold">Disponible en cualquier momento</span>
              </div>
            </div>
          </div>

          {/* Machine Learning Tuning Terminal */}
          <div className="flex-1 flex flex-col h-[150px] rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-[10px] text-slate-300 overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-slate-400 uppercase tracking-wider font-bold">
              <span>🎛️ Algoritmo de Refinamiento</span>
              <span className="text-[9px] text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> ONLINE
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
              {refinementLogs.slice(0, 5).map((log, i) => (
                <div key={i} className="leading-relaxed border-l-2 border-emerald-500/30 pl-1.5">
                  <span className="text-emerald-400 font-bold">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync logs comparison table */}
        {syncLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>📊 Historial de Comparación (Predicciones vs Realidad FIFA)</span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <th className="p-2">Hora Sync</th>
                    <th className="p-2">Partido</th>
                    <th className="p-2 text-center">Predicho</th>
                    <th className="p-2 text-center">Real (FIFA)</th>
                    <th className="p-2 text-right">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[10px] font-mono">
                  {syncLogs.slice(0, 3).map((log, index) => {
                    const tA = TEAMS[log.teamA];
                    const tB = TEAMS[log.teamB];
                    return (
                      <tr key={index} className="hover:bg-slate-900/40">
                        <td className="p-2 text-slate-400">{log.date.split(", ")[1]}</td>
                        <td className="p-2 font-sans font-medium flex items-center gap-1.5">
                          <span>{tA?.flag}</span>
                          <span className="font-bold text-white">{tA?.name}</span>
                          <span className="text-slate-500">vs</span>
                          <span>{tB?.flag}</span>
                          <span className="font-bold text-white">{tB?.name}</span>
                        </td>
                        <td className="p-2 text-center text-blue-300 font-bold">{log.predictedScore}</td>
                        <td className="p-2 text-center text-emerald-400 font-bold">{log.realScore}</td>
                        <td className="p-2 text-right">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                            log.accuracy === "Exacto"
                              ? "bg-green-500/15 text-green-400 border border-green-500/30"
                              : log.accuracy === "Ganador"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}>
                            {log.accuracy}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Controls Card */}
      <div className="rounded-2xl border border-blue-500/20 bg-slate-900/80 p-5 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" /> Control del Simulador
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              Ejecuta el consenso de los 18 agentes para predecir todos los partidos pendientes ({pendingCount} partidos).
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {pendingCount > 0 ? (
              <button
                id="btn-simulate-all"
                onClick={onSimulate}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/10 hover:from-emerald-400 hover:to-lime-300 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Simular Pendientes
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-400">
                ✓ Todo Simulado
              </div>
            )}
            
            <button
              id="btn-reset-matches"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Restablecer
            </button>
          </div>
        </div>

        {/* Global Progress Indicators */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/60">
          <div className="text-center rounded-xl bg-slate-950/40 p-2.5 border border-slate-800">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Completados / Jugados</span>
            <span className="block text-lg font-extrabold text-blue-300">{finishedCount} <span className="text-xs font-normal text-slate-500">de {matches.length}</span></span>
          </div>
          <div className="text-center rounded-xl bg-slate-950/40 p-2.5 border border-slate-800">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">Por Jugar / Pendientes</span>
            <span className="block text-lg font-extrabold text-amber-400">{pendingCount} <span className="text-xs font-normal text-slate-500">partidos</span></span>
          </div>
        </div>
      </div>

      {/* Date Carousel Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-blue-400" /> Calendario de Partidos
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {uniqueDates.map((date) => {
            const isSelected = date === selectedDate;
            const count = matches.filter((m) => m.date === date).length;
            const finishedInDay = matches.filter((m) => m.date === date && m.finished).length;
            const isAllFinished = finishedInDay === count;

            return (
              <button
                key={date}
                id={`date-pill-${date.replace(" ", "-")}`}
                onClick={() => onDateChange(date)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400/40 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                <span className="text-xs font-bold">{date.split(" ")[0]}</span>
                <span className="text-[10px] uppercase tracking-tighter opacity-85">{date.split(" ")[1]}</span>
                
                {/* Micro-badge of completed count in that day */}
                <span className={`text-[8px] mt-1 px-1 rounded-md font-mono ${
                  isSelected 
                    ? "bg-white/20 text-white" 
                    : isAllFinished 
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-slate-500"
                }`}>
                  {finishedInDay}/{count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
            Partidos del día {selectedDate}
          </h4>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            {matchesOfDay.length} partidos
          </span>
        </div>

        {matchesOfDay.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-800 bg-slate-950/20">
            <p className="text-slate-500 text-sm">No hay partidos programados para este día.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matchesOfDay.map((match) => {
              const teamA = TEAMS[match.teamA];
              const teamB = TEAMS[match.teamB];

              if (!teamA || !teamB) return null;

              const isDraw = match.finished && match.scoreA === match.scoreB;
              const isWinnerA = match.finished && (match.scoreA ?? 0) > (match.scoreB ?? 0);
              const isWinnerB = match.finished && (match.scoreB ?? 0) > (match.scoreA ?? 0);

              return (
                <div
                  key={match.id}
                  id={`match-card-${match.id}`}
                  onClick={() => onMatchSelect(match)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 hover:bg-slate-800/80 p-4 transition-all duration-300 cursor-pointer hover:border-blue-500/35 hover:shadow-lg hover:shadow-blue-500/5 active:scale-[0.99] transform animate-slideup"
                >
                  {/* Subtle top indicator based on status */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-500/20 group-hover:via-emerald-500/20 group-hover:to-blue-500/20 transition-all" />

                  {/* Top info line */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-3 border-b border-slate-800/50 pb-2">
                    <span className="bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800 text-blue-300">
                      Grupo {match.group}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" /> {match.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-widest ${
                        match.finished 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                      }`}>
                        {match.finished ? "Finalizado" : "Por Jugar"}
                      </span>
                    </div>
                  </div>

                  {/* Main Scoreboard Area */}
                  <div className="grid grid-cols-7 items-center justify-center py-2">
                    {/* Team A */}
                    <div className="col-span-3 flex flex-col items-center text-center gap-1">
                      <span className="text-3xl filter drop-shadow" role="img" aria-label={teamA.name}>
                        {teamA.flag}
                      </span>
                      <span className={`text-xs font-bold truncate max-w-full ${isWinnerA ? "text-emerald-400" : "text-slate-200"}`}>
                        {teamA.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        Rank #{teamA.rank}
                      </span>
                    </div>

                    {/* Score / VS Display */}
                    <div className="col-span-1 flex flex-col items-center justify-center text-center">
                      {match.finished ? (
                        <div className="flex items-center justify-center gap-1.5 bg-black/40 px-3 py-1 rounded-xl border border-slate-800 font-mono text-lg font-black text-white">
                          <span className={isWinnerA ? "text-emerald-400" : isDraw ? "text-slate-300" : "text-slate-500"}>
                            {match.scoreA}
                          </span>
                          <span className="text-slate-600 text-sm font-normal">:</span>
                          <span className={isWinnerB ? "text-emerald-400" : isDraw ? "text-slate-300" : "text-slate-500"}>
                            {match.scoreB}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                            VS
                          </div>
                          <button
                            id={`sync-match-${match.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSyncSingleMatch(match.id);
                            }}
                            className="inline-flex items-center gap-1 rounded bg-emerald-500 hover:bg-emerald-400 px-1.5 py-0.5 text-[8px] font-bold text-slate-950 transition-all shadow shadow-emerald-500/10 hover:shadow-emerald-500/30 transform hover:scale-105 active:scale-95 cursor-pointer mt-1"
                            title="Sincronizar este partido al instante"
                          >
                            <Zap className="h-2.5 w-2.5 fill-current" /> Sincronizar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Team B */}
                    <div className="col-span-3 flex flex-col items-center text-center gap-1">
                      <span className="text-3xl filter drop-shadow" role="img" aria-label={teamB.name}>
                        {teamB.flag}
                      </span>
                      <span className={`text-xs font-bold truncate max-w-full ${isWinnerB ? "text-emerald-400" : "text-slate-200"}`}>
                        {teamB.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        Rank #{teamB.rank}
                      </span>
                    </div>
                  </div>

                  {/* Stadium bottom info */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Landmark className="h-3 w-3 text-slate-600" /> {match.stadium}
                    </span>
                    <span className="text-blue-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Analizar agentes →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
