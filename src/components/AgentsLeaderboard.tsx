/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { Match, Agent } from "../types";
import { AGENTS } from "../data";
import { predictMatch } from "../simulator";
import { Award, Brain, Info, HelpCircle, Activity, Star } from "lucide-react";

interface AgentsLeaderboardProps {
  matches: Match[];
}

interface AgentAccuracy {
  agent: Agent;
  predictedCount: number;
  outcomesCorrect: number;
  exactScoresCorrect: number;
  totalPoints: number;
  accuracyRate: number;
}

export default function AgentsLeaderboard({ matches }: AgentsLeaderboardProps) {
  // Find all finished matches
  const finishedMatches = useMemo(() => {
    return matches.filter((m) => m.finished);
  }, [matches]);

  // Compute accuracy statistics dynamically for each agent
  const leaderboardData = useMemo(() => {
    const list: AgentAccuracy[] = AGENTS.map((agent) => {
      let outcomesCorrect = 0;
      let exactScoresCorrect = 0;

      finishedMatches.forEach((m) => {
        if (m.scoreA === null || m.scoreB === null) return;

        // Predict using this specific agent
        const pred = predictMatch(m, agent.id, matches);

        const actualWinA = m.scoreA > m.scoreB;
        const actualWinB = m.scoreB > m.scoreA;
        const actualDraw = m.scoreA === m.scoreB;

        const predWinA = pred.scoreA > pred.scoreB;
        const predWinB = pred.scoreB > pred.scoreA;
        const predDraw = pred.scoreA === pred.scoreB;

        // Exact score match
        const isExact = pred.scoreA === m.scoreA && pred.scoreB === m.scoreB;
        if (isExact) {
          exactScoresCorrect++;
        }

        // Outcome match
        const isOutcomeCorrect =
          (actualWinA && predWinA) ||
          (actualWinB && predWinB) ||
          (actualDraw && predDraw);

        if (isOutcomeCorrect) {
          outcomesCorrect++;
        }
      });

      // Prediction scoring: 3 points for exact score, 1 point for correct outcome
      const totalPoints = exactScoresCorrect * 3 + outcomesCorrect * 1;
      const count = finishedMatches.length;
      const accuracyRate = count > 0 ? (outcomesCorrect / count) * 100 : 0;

      return {
        agent,
        predictedCount: count,
        outcomesCorrect,
        exactScoresCorrect,
        totalPoints,
        accuracyRate,
      };
    });

    // Sort by points desc, exact count desc, accuracyRate desc
    return list.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.exactScoresCorrect !== a.exactScoresCorrect) return b.exactScoresCorrect - a.exactScoresCorrect;
      return b.accuracyRate - a.accuracyRate;
    });
  }, [finishedMatches, matches]);

  const topAgent = leaderboardData[0];

  return (
    <div id="agents-leaderboard-tab" className="p-4 space-y-6 animate-fadein">
      {/* Title & Banner */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <Brain className="h-5 w-5 text-emerald-400" /> Clasificación de Agentes Predictivos
        </h2>
        <p className="text-xs text-blue-200">
          Evaluación en tiempo real de los 18 algoritmos de predicción basados en los partidos completados del mundial.
        </p>
      </div>

      {finishedMatches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 p-8 text-center text-slate-500">
          <Activity className="h-10 w-10 text-slate-600 mx-auto opacity-50 mb-3" />
          <p className="text-xs">
            Aún no hay partidos finalizados. Simula o completa partidos de la fase de grupos para ver el rendimiento dinámico de los agentes predictivos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Highlight Top Performing Agent */}
          {topAgent && (
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-5 flex items-center gap-4 shadow-lg">
              <span className="text-4xl">👑</span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">LÍDER DE PRECISIÓN</span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-amber-400 stroke-none" /> ELO TOP</span>
                </div>
                <h4 className="font-extrabold text-slate-100 text-sm">{topAgent.agent.name}</h4>
                <p className="text-xs text-blue-200/80 leading-relaxed max-w-lg">
                  Lidera el certamen con un <strong className="text-emerald-400">{topAgent.accuracyRate.toFixed(1)}% de efectividad</strong>, acertando {topAgent.outcomesCorrect} resultados ganadores y {topAgent.exactScoresCorrect} marcadores exactos.
                </p>
              </div>
            </div>
          )}

          {/* Leaders Board Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
            {/* Table headers */}
            <div className="grid grid-cols-12 gap-1 px-4 py-3 bg-slate-950/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800">
              <span className="col-span-1 text-left">#</span>
              <span className="col-span-4 text-left">Modelo de Agente</span>
              <span className="col-span-2">Precisión</span>
              <span className="col-span-2">Acertados</span>
              <span className="col-span-2">Exactos</span>
              <span className="col-span-1 text-emerald-400 text-right">Pts</span>
            </div>

            {/* List rows */}
            <div className="divide-y divide-slate-800/40">
              {leaderboardData.map((row, index) => {
                const isLeader = index === 0;

                return (
                  <div
                    key={row.agent.id}
                    id={`agent-row-${row.agent.id}`}
                    className="grid grid-cols-12 gap-1 px-4 py-3.5 text-xs items-center text-center hover:bg-slate-800/20 transition-all"
                  >
                    {/* Rank */}
                    <span className={`col-span-1 text-left font-mono font-black ${
                      isLeader ? "text-emerald-400" : "text-slate-400"
                    }`}>
                      {index + 1}
                    </span>

                    {/* Agent Name & description */}
                    <div className="col-span-4 text-left truncate pr-2">
                      <div className="font-extrabold text-slate-200 truncate">{row.agent.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">{row.agent.label}</div>
                    </div>

                    {/* Accuracy rate */}
                    <span className="col-span-2 font-mono font-bold text-slate-300">
                      {row.accuracyRate.toFixed(0)}%
                    </span>

                    {/* Outcomes correct */}
                    <span className="col-span-2 font-mono text-slate-400">
                      {row.outcomesCorrect} <span className="text-[10px] text-slate-600">/{row.predictedCount}</span>
                    </span>

                    {/* Exact scores correct */}
                    <span className="col-span-2 font-mono text-slate-400">
                      {row.exactScoresCorrect}
                    </span>

                    {/* Points total */}
                    <span className="col-span-1 font-mono font-black text-emerald-400 text-right bg-emerald-500/5 py-0.5 px-2.5 rounded border border-emerald-500/10 justify-self-end">
                      {row.totalPoints}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation Footer Card */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4 flex gap-3.5 items-start">
            <Info className="h-4.5 w-4.5 text-blue-400 mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-300">Puntuación del Campeonato de Agentes</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Los agentes acumulan <strong>3 puntos por marcador exacto</strong> (por ejemplo, predecir 2-1 y que finalice 2-1) y <strong>1 punto por resultado correcto</strong> (acertar victoria de local, empate, o victoria de visita sin embocar el marcador exacto).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
