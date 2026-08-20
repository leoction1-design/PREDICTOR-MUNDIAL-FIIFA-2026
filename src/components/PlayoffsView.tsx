/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Match, GroupStanding } from "../types";
import { TEAMS } from "../data";
import { ListChecks, AlertCircle, Sparkles, Award, GitMerge, Trophy, Calendar, Clock } from "lucide-react";

interface PlayoffsViewProps {
  matches: Match[];
}

export default function PlayoffsView({ matches }: PlayoffsViewProps) {
  const [subTab, setSubTab] = useState<"clasificados" | "cruces">("cruces");
  const [selectedRound, setSelectedRound] = useState<"r32" | "r16" | "qf" | "sf" | "final">("r32");
  const groupsList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  
  const r32DaysOrder = useMemo(() => [
    "DOMINGO 28 JUNIO",
    "LUNES 29 JUNIO",
    "MARTES 30 JUNIO",
    "MIÉRCOLES 1 JULIO",
    "JUEVES 2 JULIO",
    "VIERNES 3 JULIO"
  ], []);

  // Calculate standings for all groups
  const standingsByGroup = useMemo(() => {
    const standings: Record<string, GroupStanding[]> = {};

    groupsList.forEach((groupLetter) => {
      const groupMatches = matches.filter((m) => m.group === groupLetter);
      const teamSet = new Set<string>();
      groupMatches.forEach((m) => {
        teamSet.add(m.teamA);
        teamSet.add(m.teamB);
      });
      const teamCodes = Array.from(teamSet);

      const recordsMap: Record<string, GroupStanding> = {};
      teamCodes.forEach((code) => {
        recordsMap[code] = {
          teamCode: code,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      });

      groupMatches.forEach((m) => {
        if (!m.finished || m.scoreA === null || m.scoreB === null) return;

        const recordA = recordsMap[m.teamA];
        const recordB = recordsMap[m.teamB];

        if (!recordA || !recordB) return;

        recordA.played++;
        recordB.played++;

        recordA.goalsFor += m.scoreA;
        recordA.goalsAgainst += m.scoreB;

        recordB.goalsFor += m.scoreB;
        recordB.goalsAgainst += m.scoreA;

        if (m.scoreA > m.scoreB) {
          recordA.won++;
          recordA.points += 3;
          recordB.lost++;
        } else if (m.scoreB > m.scoreA) {
          recordB.won++;
          recordB.points += 3;
          recordA.lost++;
        } else {
          recordA.drawn++;
          recordA.points += 1;
          recordB.drawn++;
          recordB.points += 1;
        }
      });

      const standingsArray = teamCodes.map((code) => {
        const r = recordsMap[code];
        r.goalDifference = r.goalsFor - r.goalsAgainst;
        return r;
      });

      standingsArray.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        const rankA = TEAMS[a.teamCode]?.rank ?? 999;
        const rankB = TEAMS[b.teamCode]?.rank ?? 999;
        return rankA - rankB;
      });

      standings[groupLetter] = standingsArray;
    });

    return standings;
  }, [matches]);

  // Extract third place teams from all 12 groups
  const thirdPlaceTeams = useMemo(() => {
    const thirds: (GroupStanding & { group: string })[] = [];
    
    groupsList.forEach((groupLetter) => {
      const standings = standingsByGroup[groupLetter];
      if (standings && standings.length >= 3) {
        thirds.push({
          ...standings[2], // index 2 is third place
          group: groupLetter
        });
      }
    });

    // Sort thirds table
    thirds.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      const rankA = TEAMS[a.teamCode]?.rank ?? 999;
      const rankB = TEAMS[b.teamCode]?.rank ?? 999;
      return rankA - rankB;
    });

    return thirds;
  }, [standingsByGroup]);

  // Direct qualifiers (1st and 2nd from each group)
  const directQualifiers = useMemo(() => {
    const list: { teamCode: string; group: string; rank: number }[] = [];
    groupsList.forEach((g) => {
      const groupStandings = standingsByGroup[g];
      if (groupStandings && groupStandings.length >= 2) {
        list.push({ teamCode: groupStandings[0].teamCode, group: g, rank: 1 });
        list.push({ teamCode: groupStandings[1].teamCode, group: g, rank: 2 });
      }
    });
    return list;
  }, [standingsByGroup]);

  // Round of 32 Pairings (consistent with SimulatorView and exact to image)
  const r32Pairings = useMemo(() => {
    const getTeamCode = (group: string, pos: number) => {
      return directQualifiers.find((d) => d.group === group && d.rank === pos)?.teamCode || "";
    };

    const getThirdCode = (index: number) => {
      return thirdPlaceTeams[index]?.teamCode || "";
    };

    return [
      { id: 75, label: "Partido 75", slotA: "3°A", slotB: "2B", teamCodeA: getThirdCode(0), teamCodeB: getTeamCode("B", 2), date: "DOMINGO 28 JUNIO", time: "2:00 p.m.", dayLabel: "DOMINGO 28 JUNIO" },
      
      { id: 81, label: "Partido 81", slotA: "1C", slotB: "3°F", teamCodeA: getTeamCode("C", 1), teamCodeB: getThirdCode(3), date: "LUNES 29 JUNIO", time: "12:00 m.", dayLabel: "LUNES 29 JUNIO" },
      { id: 73, label: "Partido 73", slotA: "1E", slotB: "2D", teamCodeA: getTeamCode("E", 1), teamCodeB: getTeamCode("D", 2), date: "LUNES 29 JUNIO", time: "3:30 p.m.", dayLabel: "LUNES 29 JUNIO" },
      { id: 76, label: "Partido 76", slotA: "1F", slotB: "2C", teamCodeA: getTeamCode("F", 1), teamCodeB: getTeamCode("C", 2), date: "LUNES 29 JUNIO", time: "8:00 p.m.", dayLabel: "LUNES 29 JUNIO" },
      
      { id: 82, label: "Partido 82", slotA: "3°E", slotB: "2I", teamCodeA: getThirdCode(2), teamCodeB: getTeamCode("I", 2), date: "MARTES 30 JUNIO", time: "12:00 m.", dayLabel: "MARTES 30 JUNIO" },
      { id: 74, label: "Partido 74", slotA: "1I", slotB: "2F", teamCodeA: getTeamCode("I", 1), teamCodeB: getTeamCode("F", 2), date: "MARTES 30 JUNIO", time: "4:00 p.m.", dayLabel: "MARTES 30 JUNIO" },
      { id: 83, label: "Partido 83", slotA: "1A", slotB: "2E", teamCodeA: getTeamCode("A", 1), teamCodeB: getTeamCode("E", 2), date: "MARTES 30 JUNIO", time: "8:00 p.m.", dayLabel: "MARTES 30 JUNIO" },
      
      { id: 84, label: "Partido 84", slotA: "1L", slotB: "3°K", teamCodeA: getTeamCode("L", 1), teamCodeB: getThirdCode(6), date: "MIÉRCOLES 1 JULIO", time: "11:00 a.m.", dayLabel: "MIÉRCOLES 1 JULIO" },
      { id: 80, label: "Partido 80", slotA: "1G", slotB: "3°I", teamCodeA: getTeamCode("G", 1), teamCodeB: getThirdCode(5), date: "MIÉRCOLES 1 JULIO", time: "3:00 p.m.", dayLabel: "MIÉRCOLES 1 JULIO" },
      { id: 79, label: "Partido 79", slotA: "1D", slotB: "3°B", teamCodeA: getTeamCode("D", 1), teamCodeB: getThirdCode(1), date: "MIÉRCOLES 1 JULIO", time: "7:00 p.m.", dayLabel: "MIÉRCOLES 1 JULIO" },
      
      { id: 78, label: "Partido 78", slotA: "1H", slotB: "3°J", teamCodeA: getTeamCode("H", 1), teamCodeB: getThirdCode(4), date: "JUEVES 2 JULIO", time: "2:00 p.m.", dayLabel: "JUEVES 2 JULIO" },
      { id: 77, label: "Partido 77", slotA: "2K", slotB: "2L", teamCodeA: getTeamCode("K", 2), teamCodeB: getTeamCode("L", 2), date: "JUEVES 2 JULIO", time: "6:00 p.m.", dayLabel: "JUEVES 2 JULIO" },
      { id: 87, label: "Partido 87", slotA: "1B", slotB: "2J", teamCodeA: getTeamCode("B", 1), teamCodeB: getTeamCode("J", 2), date: "JUEVES 2 JULIO", time: "10:00 p.m.", dayLabel: "JUEVES 2 JULIO" },
      
      { id: 86, label: "Partido 86", slotA: "3°D", slotB: "2G", teamCodeA: getThirdCode(3), teamCodeB: getTeamCode("G", 2), date: "VIERNES 3 JULIO", time: "1:00 p.m.", dayLabel: "VIERNES 3 JULIO" },
      { id: 85, label: "Partido 85", slotA: "1J", slotB: "3°H", teamCodeA: getTeamCode("J", 1), teamCodeB: getThirdCode(7), date: "VIERNES 3 JULIO", time: "5:00 p.m.", dayLabel: "VIERNES 3 JULIO" },
      { id: 88, label: "Partido 88", slotA: "1K", slotB: "3°L", teamCodeA: getTeamCode("K", 1), teamCodeB: getThirdCode(7), date: "VIERNES 3 JULIO", time: "8:30 p.m.", dayLabel: "VIERNES 3 JULIO" },
    ];
  }, [directQualifiers, thirdPlaceTeams]);

  // Helper to project a winner between two teams using their FIFA rank (lower is better) or real-world results
  const getProjectedWinner = (codeA: string, codeB: string) => {
    if (!codeA && !codeB) return "";
    if (!codeA) return codeB;
    if (!codeB) return codeA;

    // Use FIFA rank as a simple projection for the bracket view
    const rA = TEAMS[codeA]?.rank ?? 999;
    const rB = TEAMS[codeB]?.rank ?? 999;
    return rA < rB ? codeA : codeB;
  };

  // Helper to get dynamic status of a team based on real-world timeline (today is July 2nd, 2026)
  const getTeamTournamentStatus = (teamCode: string) => {
    // 1. Did they qualify to Round of 32?
    const hasMatch = r32Pairings.some(m => m.teamCodeA === teamCode || m.teamCodeB === teamCode);
    if (!hasMatch) {
      return { status: "Eliminado", stage: "Fase de Grupos", label: "Eliminado en Grupos", isEliminated: true, isPlayingToday: false };
    }

    // 2. If they qualified, check if their R32 match has already been played in reality
    const r32Match = r32Pairings.find(m => m.teamCodeA === teamCode || m.teamCodeB === teamCode);
    if (!r32Match) return { status: "Activo", stage: "R32", label: "Activo (R32)", isEliminated: false, isPlayingToday: false };

    const playedDates = ["DOMINGO 28 JUNIO", "LUNES 29 JUNIO", "MARTES 30 JUNIO", "MIÉRCOLES 1 JULIO"];
    const isFinished = playedDates.includes(r32Match.dayLabel);

    if (isFinished) {
      const winner = getProjectedWinner(r32Match.teamCodeA, r32Match.teamCodeB);
      if (winner === teamCode) {
        return { status: "Activo", stage: "Octavos (R16)", label: "Clasificado a Octavos", isEliminated: false, isPlayingToday: false };
      } else {
        return { status: "Eliminado", stage: "Dieciseisavos (R32)", label: "Eliminado en R32", isEliminated: true, isPlayingToday: false };
      }
    }

    // Jueves 2 Julio (Today's matches) are playing today
    if (r32Match.dayLabel === "JUEVES 2 JULIO") {
      return { status: "Activo", stage: "Dieciseisavos (R32)", label: "Juega Hoy", isEliminated: false, isPlayingToday: true };
    }

    return { status: "Activo", stage: "Dieciseisavos (R32)", label: "Activo (R32)", isEliminated: false, isPlayingToday: false };
  };

  const r16Pairings = useMemo(() => {
    const getWinnerById = (id: number) => {
      const m = r32Pairings.find((x) => x.id === id);
      if (!m) return "";
      return getProjectedWinner(m.teamCodeA, m.teamCodeB);
    };
    return [
      { id: 89, label: "Partido 89 (Octavos)", slotA: "W73", slotB: "W74", teamCodeA: getWinnerById(73), teamCodeB: getWinnerById(74) },
      { id: 90, label: "Partido 90 (Octavos)", slotA: "W75", slotB: "W76", teamCodeA: getWinnerById(75), teamCodeB: getWinnerById(76) },
      { id: 91, label: "Partido 91 (Octavos)", slotA: "W77", slotB: "W78", teamCodeA: getWinnerById(77), teamCodeB: getWinnerById(78) },
      { id: 92, label: "Partido 92 (Octavos)", slotA: "W79", slotB: "W80", teamCodeA: getWinnerById(79), teamCodeB: getWinnerById(80) },
      { id: 93, label: "Partido 93 (Octavos)", slotA: "W81", slotB: "W82", teamCodeA: getWinnerById(81), teamCodeB: getWinnerById(82) },
      { id: 94, label: "Partido 94 (Octavos)", slotA: "W83", slotB: "W84", teamCodeA: getWinnerById(83), teamCodeB: getWinnerById(84) },
      { id: 95, label: "Partido 95 (Octavos)", slotA: "W85", slotB: "W86", teamCodeA: getWinnerById(85), teamCodeB: getWinnerById(86) },
      { id: 96, label: "Partido 96 (Octavos)", slotA: "W87", slotB: "W88", teamCodeA: getWinnerById(87), teamCodeB: getWinnerById(88) },
    ];
  }, [r32Pairings]);

  const qfPairings = useMemo(() => {
    const w = r16Pairings.map((m) => getProjectedWinner(m.teamCodeA, m.teamCodeB));
    return [
      { id: 97, label: "Partido 97 (Cuartos)", slotA: "W89", slotB: "W90", teamCodeA: w[0], teamCodeB: w[1] },
      { id: 98, label: "Partido 98 (Cuartos)", slotA: "W91", slotB: "W92", teamCodeA: w[2], teamCodeB: w[3] },
      { id: 99, label: "Partido 99 (Cuartos)", slotA: "W93", slotB: "W94", teamCodeA: w[4], teamCodeB: w[5] },
      { id: 100, label: "Partido 100 (Cuartos)", slotA: "W95", slotB: "W96", teamCodeA: w[6], teamCodeB: w[7] },
    ];
  }, [r16Pairings]);

  const sfPairings = useMemo(() => {
    const w = qfPairings.map((m) => getProjectedWinner(m.teamCodeA, m.teamCodeB));
    return [
      { id: 101, label: "Partido 101 (Semifinal 1)", slotA: "W97", slotB: "W98", teamCodeA: w[0], teamCodeB: w[1] },
      { id: 102, label: "Partido 102 (Semifinal 2)", slotA: "W99", slotB: "W100", teamCodeA: w[2], teamCodeB: w[3] },
    ];
  }, [qfPairings]);

  const finalPairing = useMemo(() => {
    const w = sfPairings.map((m) => getProjectedWinner(m.teamCodeA, m.teamCodeB));
    return { id: 104, label: "Partido 104 (Gran Final)", slotA: "W101", slotB: "W102", teamCodeA: w[0], teamCodeB: w[1] };
  }, [sfPairings]);

  return (
    <div id="playoffs-tab-view" className="p-4 space-y-5 animate-fadein">
      {/* Overview Intro Card */}
      <div className="rounded-2xl border border-blue-500/10 bg-slate-900/50 p-4 flex gap-3.5 items-start">
        <ListChecks className="h-5 w-5 text-emerald-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-slate-200">Fases Finales del Torneo</h3>
          <p className="text-xs text-blue-200/80 mt-1 leading-relaxed">
            Consulte en tiempo real la tabla de mejores terceros de grupo, los clasificados directos y el cuadro completo de los cruces de Dieciseisavos de Final.
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-800 p-0.5 bg-slate-950/40 rounded-xl">
        <button
          onClick={() => setSubTab("clasificados")}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
            subTab === "clasificados"
              ? "bg-slate-800 text-slate-100 shadow-md border-b border-emerald-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🏆 Clasificados & Terceros
        </button>
        <button
          onClick={() => setSubTab("cruces")}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
            subTab === "cruces"
              ? "bg-slate-800 text-slate-100 shadow-md border-b border-emerald-500/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🥊 Cruces Dieciseisavos (R32)
        </button>
      </div>

      {subTab === "clasificados" ? (
        <div className="space-y-6">
          {/* Best Thirds Table */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 space-y-4 shadow-lg">
            <div>
              <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-400" /> Tabla de Terceros de Grupo
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Los primeros <strong>8 terceros</strong> obtienen un pase especial a Dieciseisavos de Final.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
              {/* Headers */}
              <div className="grid grid-cols-12 gap-1 px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-800">
                <span className="col-span-1 text-left">#</span>
                <span className="col-span-4 text-left">Selección</span>
                <span className="col-span-1">Gr</span>
                <span className="col-span-1">PJ</span>
                <span className="col-span-1">PG</span>
                <span className="col-span-1">PP</span>
                <span className="col-span-1">GF</span>
                <span className="col-span-1">DG</span>
                <span className="col-span-2 text-emerald-400">Pts</span>
              </div>

              {/* List */}
              <div className="divide-y divide-slate-800/40">
                {thirdPlaceTeams.map((row, index) => {
                  const team = TEAMS[row.teamCode];
                  const position = index + 1;
                  const isQualified = position <= 8;

                  if (!team) return null;

                  const statusInfo = getTeamTournamentStatus(row.teamCode);

                  return (
                    <div
                      key={row.teamCode}
                      id={`third-row-${row.teamCode}`}
                      className={`grid grid-cols-12 gap-1 px-3 py-2 text-xs items-center text-center transition-all hover:bg-slate-800/30 ${
                        statusInfo.isEliminated 
                          ? "bg-rose-950/5 opacity-55" 
                          : isQualified 
                            ? "bg-emerald-500/5" 
                            : "bg-rose-500/5"
                      }`}
                    >
                      {/* Position */}
                      <span className={`col-span-1 text-left font-mono font-bold ${
                        statusInfo.isEliminated
                          ? "text-slate-500 line-through"
                          : isQualified 
                            ? "text-emerald-400" 
                            : "text-rose-400"
                      }`}>
                        {position}
                      </span>

                      {/* Team */}
                      <div className="col-span-4 flex items-center gap-1.5 text-left truncate">
                        <span className={`text-base filter drop-shadow flex-shrink-0 ${statusInfo.isEliminated ? "grayscale opacity-50" : ""}`} role="img" aria-label={team.name}>
                          {team.flag}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className={`font-semibold truncate text-[11px] sm:text-xs ${
                            statusInfo.isEliminated ? "text-slate-500 line-through font-normal" : "text-slate-200"
                          }`}>{team.name}</span>
                          <span className={`text-[8px] font-mono leading-none mt-0.5 ${
                            statusInfo.isEliminated ? "text-rose-400/80" : "text-emerald-400"
                          }`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Group */}
                      <span className="col-span-1 font-bold text-blue-400">{row.group}</span>
                      
                      {/* Stats */}
                      <span className="col-span-1 font-mono text-slate-400">{row.played}</span>
                      <span className="col-span-1 font-mono text-slate-400">{row.won}</span>
                      <span className="col-span-1 font-mono text-slate-400">{row.lost}</span>
                      <span className="col-span-1 font-mono text-slate-400">{row.goalsFor}</span>
                      <span className={`col-span-1 font-mono font-bold ${
                        row.goalDifference > 0 
                          ? "text-blue-400" 
                          : row.goalDifference < 0 
                            ? "text-rose-400" 
                            : "text-slate-500"
                      }`}>
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </span>

                      {/* Points status with beautiful badge */}
                      <span className="col-span-2 text-center">
                        <span className={`inline-block w-full text-[11px] font-mono font-black py-0.5 px-1.5 rounded-md border ${
                          statusInfo.isEliminated
                            ? "bg-slate-900 text-slate-500 border-slate-800"
                            : isQualified 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {row.points}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <AlertCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>
                La zona en <strong className="text-emerald-400">verde</strong> marca los clasificados por el momento. La zona <strong className="text-rose-400">roja</strong> representa los terceros eliminados.
              </span>
            </div>
          </div>

          {/* Direct Qualifiers Table List */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 space-y-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" /> Clasificados Directos (Top 2)
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Los ganadores (1°) y sublíderes (2°) de cada uno de los 12 grupos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {directQualifiers.map((q) => {
                const team = TEAMS[q.teamCode];
                if (!team) return null;

                const statusInfo = getTeamTournamentStatus(q.teamCode);

                return (
                  <div
                    key={`${q.group}-${q.teamCode}`}
                    id={`qualifier-badge-${q.group}-${q.teamCode}`}
                    className={`flex items-center justify-between bg-slate-950/40 border p-2.5 rounded-xl transition-all ${
                      statusInfo.isEliminated 
                        ? "border-slate-900 bg-slate-950/20 opacity-60" 
                        : "border-slate-800 hover:border-emerald-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex-shrink-0 text-center text-[10px] font-mono font-bold bg-slate-800 text-slate-300 w-5 h-5 rounded-full flex items-center justify-center">
                        {q.group}{q.rank}
                      </span>
                      <div className="truncate">
                        <div className="flex items-center gap-1">
                          <span className={`text-base ${statusInfo.isEliminated ? "grayscale opacity-50" : ""}`}>{team.flag}</span>
                          <span className={`text-xs font-bold truncate ${
                            statusInfo.isEliminated ? "text-slate-500 line-through font-normal" : "text-slate-200"
                          }`}>
                            {team.name}
                          </span>
                        </div>
                        <div className={`text-[8px] font-mono leading-none mt-0.5 ${
                          statusInfo.isEliminated ? "text-rose-400/80" : "text-emerald-400"
                        }`}>
                          {statusInfo.label}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${
                      statusInfo.isEliminated
                        ? "bg-rose-950/20 text-rose-500 border border-rose-900/30"
                        : statusInfo.isPlayingToday
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {statusInfo.isEliminated ? "Eliminado" : statusInfo.isPlayingToday ? "Hoy" : "Vivo"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div id="playoff-bracket-pairings" className="space-y-4">
          {/* Round Selector Tabs */}
          <div className="flex gap-1 p-1 bg-slate-950/60 rounded-xl overflow-x-auto scrollbar-none border border-slate-800/40">
            <button
              onClick={() => setSelectedRound("r32")}
              className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all flex-1 text-center whitespace-nowrap ${
                selectedRound === "r32" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Dieciseisavos (R32)
            </button>
            <button
              onClick={() => setSelectedRound("r16")}
              className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all flex-1 text-center whitespace-nowrap ${
                selectedRound === "r16" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Octavos (R16)
            </button>
            <button
              onClick={() => setSelectedRound("qf")}
              className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all flex-1 text-center whitespace-nowrap ${
                selectedRound === "qf" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cuartos
            </button>
            <button
              onClick={() => setSelectedRound("sf")}
              className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all flex-1 text-center whitespace-nowrap ${
                selectedRound === "sf" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Semifinal
            </button>
            <button
              onClick={() => setSelectedRound("final")}
              className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all flex-1 text-center whitespace-nowrap ${
                selectedRound === "final" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Final
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 space-y-4 shadow-lg">
            <div>
              <h4 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <GitMerge className="h-4.5 w-4.5 text-emerald-400" /> {
                  selectedRound === "r32" ? "Dieciseisavos de Final (32 Selecciones)" :
                  selectedRound === "r16" ? "Octavos de Final (16 Selecciones)" :
                  selectedRound === "qf" ? "Cuartos de Final (8 Selecciones)" :
                  selectedRound === "sf" ? "Semifinales (4 Selecciones)" :
                  "Gran Final (Copa del Mundo)"
                }
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {
                  selectedRound === "r32" ? "Enfrentamientos directos calculados automáticamente de las posiciones de los grupos en este momento." :
                  selectedRound === "r16" ? "Proyección de los Octavos de Final basada en la simulación o el ranking FIFA de los clasificados." :
                  selectedRound === "qf" ? "Proyección de los Cuartos de Final entre los mejores contendientes." :
                  selectedRound === "sf" ? "Proyección de las Semifinales en el camino al campeonato mundial." :
                  "Proyección de la gran final de la Copa del Mundo 2026."
                }
              </p>
            </div>

            {selectedRound === "r32" ? (
              <div className="space-y-4">
                {r32DaysOrder.map((dayLabel) => {
                  const dayMatches = r32Pairings.filter((m) => m.dayLabel === dayLabel);
                  if (dayMatches.length === 0) return null;

                  return (
                    <div key={dayLabel} className="rounded-xl border border-slate-800/80 bg-slate-950/20 overflow-hidden shadow-sm">
                      {/* Day Header */}
                      <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/60 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-black tracking-wider text-slate-300 uppercase">{dayLabel}</span>
                      </div>

                      {/* Day Matches */}
                      <div className="divide-y divide-slate-800/40">
                        {dayMatches.map((match) => {
                          const teamA = TEAMS[match.teamCodeA];
                          const teamB = TEAMS[match.teamCodeB];

                          return (
                            <div
                              key={match.id}
                              className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/10 transition-colors"
                            >
                              {/* Left: Time and Match label */}
                              <div className="flex items-center gap-2.5 min-w-[120px]">
                                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800/80 font-mono">
                                  <Clock className="h-3 w-3 text-emerald-400" />
                                  {match.time}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500">{match.label}</span>
                              </div>

                              {/* Middle: Teams comparison resembling the image */}
                              <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 max-w-xl">
                                {/* Team A */}
                                <div className="flex-1 flex items-center justify-end gap-2 text-right min-w-0">
                                  <span className="font-bold text-slate-100 text-sm truncate sm:block hidden">
                                    {teamA ? teamA.name.toUpperCase() : "POR DEFINIR"}
                                  </span>
                                  <span className="font-bold text-slate-100 text-sm sm:hidden truncate">
                                    {teamA ? teamA.name.slice(0, 3).toUpperCase() : "PD"}
                                  </span>
                                  <span className="text-2xl filter drop-shadow flex-shrink-0" role="img" aria-label={teamA?.name}>
                                    {teamA ? teamA.flag : "❓"}
                                  </span>
                                </div>

                                {/* VS Separator */}
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
                                  VS
                                </span>

                                {/* Team B */}
                                <div className="flex-1 flex items-center justify-start gap-2 text-left min-w-0">
                                  <span className="text-2xl filter drop-shadow flex-shrink-0" role="img" aria-label={teamB?.name}>
                                    {teamB ? teamB.flag : "❓"}
                                  </span>
                                  <span className="font-bold text-slate-100 text-sm truncate sm:block hidden">
                                    {teamB ? teamB.name.toUpperCase() : "POR DEFINIR"}
                                  </span>
                                  <span className="font-bold text-slate-100 text-sm sm:hidden truncate">
                                    {teamB ? teamB.name.slice(0, 3).toUpperCase() : "PD"}
                                  </span>
                                </div>
                              </div>

                              {/* Right: Slot info and Rank */}
                              <div className="flex items-center justify-between sm:justify-end gap-3 text-[10px] font-mono text-slate-500">
                                <span className="bg-slate-900/40 text-blue-400 px-2 py-0.5 rounded-md border border-slate-800">
                                  {match.slotA} vs {match.slotB}
                                </span>
                                {teamA && teamB && (
                                  <span className="hidden md:inline text-slate-600 font-mono">
                                    Rank: #{teamA.rank} vs #{teamB.rank}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  selectedRound === "r16" ? r16Pairings :
                  selectedRound === "qf" ? qfPairings :
                  selectedRound === "sf" ? sfPairings :
                  [finalPairing]
                ).map((match) => {
                  const teamA = TEAMS[match.teamCodeA];
                  const teamB = TEAMS[match.teamCodeB];

                  return (
                    <div
                      key={match.id}
                      id={`projected-match-${match.id}`}
                      className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex flex-col gap-2 relative overflow-hidden hover:border-slate-700/50 transition-all"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wider pb-1.5 border-b border-slate-800/60">
                        <span>{match.label || `Partido ${match.id}`}</span>
                        <span className="text-blue-400">{match.slotA} vs {match.slotB}</span>
                      </div>

                      {/* Team Row A */}
                      <div className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{teamA ? teamA.flag : "❓"}</span>
                          <span className={`font-semibold truncate ${teamA ? "text-slate-100 font-bold" : "text-slate-500 italic"}`}>
                            {teamA ? teamA.name : `Por definir (${match.slotA})`}
                          </span>
                        </div>
                        {teamA && (
                          <span className="text-[10px] font-mono text-slate-400">Rank: #{teamA.rank}</span>
                        )}
                      </div>

                      {/* Team Row B */}
                      <div className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{teamB ? teamB.flag : "❓"}</span>
                          <span className={`font-semibold truncate ${teamB ? "text-slate-100 font-bold" : "text-slate-500 italic"}`}>
                            {teamB ? teamB.name : `Por definir (${match.slotB})`}
                          </span>
                        </div>
                        {teamB && (
                          <span className="text-[10px] font-mono text-slate-400">Rank: #{teamB.rank}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
