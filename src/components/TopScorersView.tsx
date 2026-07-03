/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { SQUADS, TEAMS } from "../data";
import { Scorer } from "../types";
import { Trophy, Search, ChevronRight, Zap, Target, Sparkles, X } from "lucide-react";

interface TopScorersViewProps {
  scorers?: Scorer[];
}

export default function TopScorersView({ scorers }: TopScorersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Scorer | null>(null);

  // Dynamic or static list of players
  const scorersData: Scorer[] = useMemo(() => {
    const baseList = scorers && scorers.length > 0 ? [...scorers] : [
      { name: "Lionel Messi", teamCode: "ar", goals: 6, assists: 2, matchesPlayed: 7, shotsOnTarget: 18 },
      { name: "Erling Haaland", teamCode: "no", goals: 6, assists: 1, matchesPlayed: 6, shotsOnTarget: 15 },
      { name: "Aymen Hussein", teamCode: "iq", goals: 6, assists: 1, matchesPlayed: 7, shotsOnTarget: 11 },
      { name: "Kylian Mbappé", teamCode: "fr", goals: 5, assists: 3, matchesPlayed: 6, shotsOnTarget: 14 },
      { name: "Darwin Núñez", teamCode: "uy", goals: 5, assists: 2, matchesPlayed: 6, shotsOnTarget: 14 },
      { name: "Yazan Al-Naimat", teamCode: "jo", goals: 5, assists: 2, matchesPlayed: 8, shotsOnTarget: 12 },
      { name: "Lamine Yamal", teamCode: "es", goals: 4, assists: 5, matchesPlayed: 8, shotsOnTarget: 11 },
      { name: "Bruno Fernandes", teamCode: "pt", goals: 4, assists: 4, matchesPlayed: 7, shotsOnTarget: 10 },
      { name: "Luis Díaz", teamCode: "co", goals: 4, assists: 1, matchesPlayed: 8, shotsOnTarget: 10 },
    ];
    
    // Dynamically sort by goals, assists, shots on target desc
    return baseList.sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.assists !== a.assists) return b.assists - a.assists;
      return b.shotsOnTarget - a.shotsOnTarget;
    });
  }, [scorers]);

  // Filter list by query
  const filteredScorers = useMemo(() => {
    return scorersData.filter((s) => {
      const team = TEAMS[s.teamCode];
      return (
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team && team.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [scorersData, searchQuery]);

  // Player Stats retrieval helper
  const playerStats = useMemo(() => {
    if (!selectedPlayer) return null;
    
    // Exact or generated deterministic physical statistics
    const defaultStats = {
      physicalForm: 92,
      attackingTactics: "Juego Asociativo Rápido, Contraataque Ofensivo",
      playerProgression: "Excelente estado de forma física, desatando el volumen de ataque de su equipo.",
    };

    // Predefined stats
    const list: Record<string, typeof defaultStats> = {
      "Kylian Mbappé": {
        physicalForm: 98,
        attackingTactics: "Transición Ofensiva Rápida, Ataque por Bandas y Diagonales Explosivas",
        playerProgression: "Imparable: Goleador letal en fase de grupos y velocista indiscutible.",
      },
      "Erling Haaland": {
        physicalForm: 95,
        attackingTactics: "Presión Alta Directiva, Extremos Abiertos Centrando al Área Chica",
        playerProgression: "De Alto Impacto: Fuerza física demoledora y efectividad aérea letal.",
      },
      "Vinícius Júnior": {
        physicalForm: 97,
        attackingTactics: "Juego Asociativo Fluido, Dribbling por la Banda Izquierda",
        playerProgression: "Destacado: Muy alta madurez táctica en definición y desequilibrio.",
      },
      "Jude Bellingham": {
        physicalForm: 94,
        attackingTactics: "Llegadas Sorpresivas de Segunda Línea y Soporte Central",
        playerProgression: "Consistente: Creador box-to-box con gran llegada a gol.",
      },
      "Harry Kane": {
        physicalForm: 90,
        attackingTactics: "Falso 9 Pivotante, Liberando Bandas y Definiciones Fijas",
        playerProgression: "Garantizado: Líder de área inteligente y ejecutor de penales perfecto.",
      },
      "Lamine Yamal": {
        physicalForm: 95,
        attackingTactics: "Ataque Posicional, Creación Abierta por Derecha y Recortes Interiores a Puerta",
        playerProgression: "Brillante: Progreso histórico imparable generando peligro continuo.",
      },
      "Lautaro Martínez": {
        physicalForm: 93,
        attackingTactics: "Presión Asfixiante de Salida, Juego Directo en Área de Castigo",
        playerProgression: "Letal: Oportunismo puro del 'Toro' con remates instantáneos.",
      },
      "Lionel Messi": {
        physicalForm: 91,
        attackingTactics: "Falso Extremo Derecho, Creación de Juego Central con Conducción y Filtro de Pases",
        playerProgression: "Legendario: Visión de juego perfecta de 10, creador de juego total.",
      },
    };

    return list[selectedPlayer.name] || {
      ...defaultStats,
      physicalForm: 85 + selectedPlayer.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 14
    };
  }, [selectedPlayer]);

  return (
    <div id="scorers-tab-view" className="p-4 space-y-6 animate-fadein">
      {/* View Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" /> Bota de Oro • Goleadores
        </h2>
        <p className="text-xs text-blue-200">
          Tabla de goleo individual de las grandes superestrellas de la Copa del Mundo 2026.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          id="scorer-search-input"
          type="text"
          placeholder="Buscar jugador o país..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/95 border border-slate-800 rounded-xl px-4 py-2.5 pl-11 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-all font-semibold"
        />
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Leaderboard list */}
        <div className="md:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-lg">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-1 px-4 py-3 bg-slate-950/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800">
            <span className="col-span-1 text-left">#</span>
            <span className="col-span-6 text-left">Jugador / Equipo</span>
            <span className="col-span-2 text-emerald-400">Goles</span>
            <span className="col-span-2">Asist</span>
            <span className="col-span-1"></span>
          </div>

          <div className="divide-y divide-slate-800/40">
            {filteredScorers.map((scorer, index) => {
              const team = TEAMS[scorer.teamCode];
              const isSelected = selectedPlayer?.name === scorer.name;
              const isLeader = index === 0;

              return (
                <div
                  key={scorer.name}
                  id={`scorer-row-${scorer.name.replace(" ", "-")}`}
                  onClick={() => setSelectedPlayer(scorer)}
                  className={`grid grid-cols-12 gap-1 px-4 py-3 text-xs items-center text-center cursor-pointer transition-all hover:bg-blue-500/5 ${
                    isSelected ? "bg-blue-500/10 border-l-2 border-emerald-400 pl-3.5" : ""
                  } ${isLeader ? "bg-amber-500/5 hover:bg-amber-500/10" : ""}`}
                >
                  {/* Position number */}
                  <span className="col-span-1 text-left font-mono font-extrabold">
                    {index === 0 ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black shadow-md shadow-amber-500/20">
                        1
                      </span>
                    ) : index === 1 ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-300 text-slate-950 text-[10px] font-bold">
                        2
                      </span>
                    ) : index === 2 ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-700/60 text-white text-[10px] font-bold">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-500 pl-1.5">{index + 1}</span>
                    )}
                  </span>

                  {/* Player Name and Flag */}
                  <div className="col-span-6 flex items-center gap-2 text-left truncate">
                    <span className="text-lg flex-shrink-0" role="img" aria-label={team?.name}>
                      {team?.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className={`font-extrabold truncate ${isLeader ? "text-amber-400 font-black" : "text-slate-200"}`}>
                          {scorer.name}
                        </span>
                        {isLeader && (
                          <span className="text-[10px] bg-amber-400/10 text-amber-400 px-1 py-0.2 rounded border border-amber-400/20 font-black flex items-center gap-0.5">
                            👑 LÍDER
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">{team?.name}</div>
                    </div>
                  </div>

                  {/* Goals */}
                  <span className="col-span-2 font-mono font-black text-sm text-emerald-400 bg-emerald-500/5 py-0.5 rounded border border-emerald-500/10 max-w-[40px] mx-auto w-full">
                    {scorer.goals}
                  </span>

                  {/* Assists */}
                  <span className="col-span-2 font-mono font-bold text-slate-300">
                    {scorer.assists}
                  </span>

                  {/* Arrow Indicator */}
                  <span className="col-span-1 flex justify-end">
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed profile card of selected player */}
        <div className="md:col-span-5">
          {selectedPlayer && playerStats ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm md:relative md:inset-auto md:z-0 md:p-0 md:bg-transparent md:backdrop-blur-none animate-fadein"
              onClick={() => setSelectedPlayer(null)}
            >
              <div
                id="scorer-profile-card"
                className="w-full max-w-md md:max-w-none rounded-2xl border border-slate-800 bg-[#0a1128] md:bg-slate-900/90 p-5 space-y-4 shadow-2xl relative overflow-hidden animate-slideup"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Pitch grid decoration */}
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl filter drop-shadow" role="img" aria-label={TEAMS[selectedPlayer.teamCode]?.name}>
                      {TEAMS[selectedPlayer.teamCode]?.flag}
                    </span>
                    <div>
                      <h4 className="font-black text-slate-200">{selectedPlayer.name}</h4>
                      <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">
                        Seleccionado Nacional • {TEAMS[selectedPlayer.teamCode]?.name}
                      </p>
                    </div>
                  </div>
                  {/* Close button - visible on mobile only */}
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="md:hidden rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white transition-colors border border-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Grid of stats */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Target className="h-3.5 w-3.5 text-emerald-400" /> Rendimiento
                    </span>
                    <span className="block text-2xl font-black text-emerald-400 mt-1">
                      {selectedPlayer.goals} <span className="text-xs text-slate-500 font-normal">GF</span>
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {selectedPlayer.assists} asistencias en {selectedPlayer.matchesPlayed} PJ
                    </span>
                  </div>

                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-amber-400" /> Forma Física
                    </span>
                    <span className="block text-2xl font-black text-amber-400 mt-1">
                      {playerStats.physicalForm}%
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {selectedPlayer.shotsOnTarget} disparos al arco
                    </span>
                  </div>
                </div>

                {/* Tactical Tactics */}
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Táctica de Ataque Ofensivo
                  </span>
                  <p className="text-[11px] text-blue-200 font-medium leading-relaxed">
                    {playerStats.attackingTactics}
                  </p>
                </div>

                {/* Player Progression */}
                <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    🚀 Evolución en el Torneo
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed italic">
                    "{playerStats.playerProgression}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/10 p-10 text-center text-slate-500">
              <Trophy className="h-10 w-10 text-slate-600 mx-auto opacity-50 mb-3" />
              <p className="text-xs">Selecciona un jugador para ver sus estadísticas tácticas y de estado de gracia en tiempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
