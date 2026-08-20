/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Match, Agent } from "../types";
import { TEAMS, SQUADS } from "../data";
import { X, Sparkles, Brain, Landmark, ShieldAlert, Award, TrendingUp, Info, Zap, Loader2 } from "lucide-react";

interface MatchDetailModalProps {
  match: Match;
  agents: Agent[];
  allMatches: Match[];
  onClose: () => void;
  predictMatch: (match: Match, agentId: string, allMatches: Match[]) => { scoreA: number; scoreB: number };
  predictConsensus: (match: Match, allMatches: Match[]) => { scoreA: number; scoreB: number };
}

export default function MatchDetailModal({
  match,
  agents,
  allMatches,
  onClose,
  predictMatch,
  predictConsensus,
}: MatchDetailModalProps) {
  const teamA = TEAMS[match.teamA];
  const teamB = TEAMS[match.teamB];

  if (!teamA || !teamB) return null;

  // Compute predictions for each agent for this match
  const predictions = useMemo(() => {
    return agents.map((agent) => {
      const pred = predictMatch(match, agent.id, allMatches);
      return {
        agent,
        scoreA: pred.scoreA,
        scoreB: pred.scoreB,
      };
    });
  }, [match, agents, allMatches, predictMatch]);

  // Compute overall consensus prediction
  const consensus = useMemo(() => {
    return predictConsensus(match, allMatches);
  }, [match, allMatches, predictConsensus]);

  // Key players list
  const playersA = SQUADS[match.teamA] || [];
  const playersB = SQUADS[match.teamB] || [];

  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const fetchAiAnalysis = async () => {
    setLoadingAi(true);
    setAiAnalysis("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamA, teamB, match }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiAnalysis("No se pudo obtener el análisis en este momento.");
      }
    } catch (error) {
      setAiAnalysis("Error al conectar con el servidor de IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadein">
      <div
        id="match-detail-dialog"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#0a1128] text-white shadow-2xl animate-slideup no-scrollbar"
      >
        {/* Pitch lines overlay for soccer look */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Header Close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#0a1128]/95 border-b border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Análisis Táctico Grupo {match.group}
            </span>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="rounded-full bg-slate-900 border border-slate-800 p-2 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          
          {/* Main Scoreboard overlay */}
          <div className="rounded-2xl border border-blue-500/10 bg-slate-900/60 p-5 text-center relative overflow-hidden">
            <div className="grid grid-cols-7 items-center justify-center gap-1">
              {/* Team A */}
              <div className="col-span-3 flex flex-col items-center">
                <span className="text-5xl filter drop-shadow-md">{teamA.flag}</span>
                <span className="font-extrabold text-sm text-slate-100 mt-2">{teamA.name}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Rank #{teamA.rank}</span>
              </div>

              {/* Central Display */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                {match.finished ? (
                  <div className="space-y-0.5">
                    <span className="block text-[9px] uppercase font-black text-emerald-400 tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Final</span>
                    <div className="font-mono text-2xl font-black text-white mt-1">
                      {match.scoreA}:{match.scoreB}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-widest">Hora</span>
                    <span className="font-mono text-sm font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">{match.time}</span>
                  </div>
                )}
              </div>

              {/* Team B */}
              <div className="col-span-3 flex flex-col items-center">
                <span className="text-5xl filter drop-shadow-md">{teamB.flag}</span>
                <span className="font-extrabold text-sm text-slate-100 mt-2">{teamB.name}</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Rank #{teamB.rank}</span>
              </div>
            </div>

            {/* Stadium location info */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <Landmark className="h-3.5 w-3.5 text-slate-500" />
              <span>{match.stadium} • {match.dateFull}</span>
            </div>
          </div>

          {/* Consensus Prediction Display */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <Brain className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Pronóstico de Consenso</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Promedio ponderado calculado a través de los 18 agentes de modelado heurístico.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 bg-slate-950/80 px-4 py-2 rounded-xl border border-emerald-500/30 text-center">
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">PREDICCIÓN</span>
                <span className="block font-mono text-base font-black text-emerald-400 mt-0.5">
                  {consensus.scoreA} - {consensus.scoreB}
                </span>
                {/* Sin este número el marcador parece una certeza. Con él se lee como lo que
                    es: el más probable de muchos, y aun así improbable. */}
                <span className="block text-[9px] font-bold text-slate-400 mt-0.5">
                  {(consensus.confianza * 100).toFixed(0)}% probable
                </span>
              </div>
            </div>

            {/* Distribución: lo que un marcador único ocultaba */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                Marcadores más probables
              </h4>
              <div className="flex flex-wrap gap-2">
                {consensus.top.map((c, i) => (
                  <span
                    key={c.marcador}
                    className={
                      "font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border " +
                      (i === 0
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400")
                    }
                  >
                    {c.marcador}{" "}
                    <span className="opacity-60">{(c.p * 100).toFixed(1)}%</span>
                  </span>
                ))}
              </div>

              <div>
                <div className="flex h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500" style={{ width: `${consensus.p1x2.local * 100}%` }} />
                  <div className="bg-slate-500" style={{ width: `${consensus.p1x2.empate * 100}%` }} />
                  <div className="bg-amber-500" style={{ width: `${consensus.p1x2.visitante * 100}%` }} />
                </div>
                <div className="flex justify-between mt-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  <span>{teamA?.name} {(consensus.p1x2.local * 100).toFixed(0)}%</span>
                  <span>Empate {(consensus.p1x2.empate * 100).toFixed(0)}%</span>
                  <span>{teamB?.name} {(consensus.p1x2.visitante * 100).toFixed(0)}%</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                Goles esperados {consensus.lambda.A.toFixed(2)} &ndash; {consensus.lambda.B.toFixed(2)}.
                Más de 2,5 goles: {(consensus.over25 * 100).toFixed(0)}%.
              </p>
            </div>

            {/* AI Tactical Report Section */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider">Reporte Táctico IA Gemini</h4>
                </div>
                <button
                  onClick={fetchAiAnalysis}
                  disabled={loadingAi}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loadingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3 fill-current" />}
                  {aiAnalysis ? "Recalcular" : "Generar Análisis"}
                </button>
              </div>

              {aiAnalysis ? (
                <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/40 rounded-xl p-3 border border-blue-500/10 animate-fadein">
                  {aiAnalysis}
                </div>
              ) : !loadingAi && (
                <p className="text-[10px] text-slate-500 italic">
                  Haz clic en el botón para generar un análisis táctico profundo basado en los datos de ambas selecciones.
                </p>
              )}

              {loadingAi && (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  <span className="text-[10px] text-blue-400 font-bold animate-pulse">Procesando variables tácticas...</span>
                </div>
              )}
            </div>
          </div>

          {/* Team Comparison Attributes */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Comparativa Técnica</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Team A Details */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800/60 pb-1.5">
                  <span className="text-xl">{teamA.flag}</span>
                  <span className="font-bold text-xs text-slate-200 truncate">{teamA.name}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Ataque:</span>
                    <strong className="text-slate-200 font-mono">{teamA.att}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Defensa:</span>
                    <strong className="text-slate-200 font-mono">{teamA.def}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Valor de Mercado:</span>
                    <strong className="text-emerald-400 font-mono">{teamA.value} M€</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span>Racha:</span>
                    <div className="flex gap-1">
                      {teamA.racha.slice(0, 5).map((r, i) => (
                        <span key={i} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-black font-mono ${
                          r === "W" ? "bg-emerald-400" : r === "D" ? "bg-amber-400" : "bg-rose-400"
                        }`}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team B Details */}
              <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800/60 pb-1.5">
                  <span className="text-xl">{teamB.flag}</span>
                  <span className="font-bold text-xs text-slate-200 truncate">{teamB.name}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Ataque:</span>
                    <strong className="text-slate-200 font-mono">{teamB.att}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Defensa:</span>
                    <strong className="text-slate-200 font-mono">{teamB.def}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Valor de Mercado:</span>
                    <strong className="text-emerald-400 font-mono">{teamB.value} M€</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span>Racha:</span>
                    <div className="flex gap-1">
                      {teamB.racha.slice(0, 5).map((r, i) => (
                        <span key={i} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-black font-mono ${
                          r === "W" ? "bg-emerald-400" : r === "D" ? "bg-amber-400" : "bg-rose-400"
                        }`}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Players squads section */}
          {(playersA.length > 0 || playersB.length > 0) && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <Award className="h-4 w-4 text-emerald-400" /> Jugadores Destacados en Convocatoria
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Players A */}
                <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-2xl">
                  <ul className="space-y-1">
                    {playersA.map((p, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                        <TrendingUp className="h-3 w-3 text-emerald-400" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Players B */}
                <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-2xl">
                  <ul className="space-y-1">
                    {playersB.map((p, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                        <TrendingUp className="h-3 w-3 text-emerald-400" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Grid of 18 Agents Predictions */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
              🎯 Predicción de Todos los Agentes (18 Modelos)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {predictions.map((pred) => {
                return (
                  <div
                    key={pred.agent.id}
                    id={`modal-agent-pred-${pred.agent.id}`}
                    className="bg-slate-950/50 hover:bg-slate-950 border border-slate-800 hover:border-blue-500/40 p-3 rounded-xl space-y-1.5 transition-colors relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-200 truncate pr-1">
                        {pred.agent.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-medium truncate w-[60%]">
                        {pred.agent.label}
                      </span>
                      <span className="font-mono text-xs font-black text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {pred.scoreA} - {pred.scoreB}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] text-slate-400 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
            <Info className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
            <span>
              Cada agente evalúa variables de forma particular: <strong>Mourinho</strong> prioriza el repliegue defensivo y pronostica pocos goles; <strong>Bielsa</strong> acelera transiciones apostando por alta efectividad ofensiva; <strong>Transfermarkt</strong> pondera el peso del mercado financiero.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
