/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Match, GroupStanding } from "../types";
import { TEAMS } from "../data";
import { Trophy, HelpCircle, ChevronDown, Award } from "lucide-react";

interface GroupsViewProps {
  matches: Match[];
}

export default function GroupsView({ matches }: GroupsViewProps) {
  const groupsList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("ALL");

  // Calculate standings for all groups
  const standingsByGroup = useMemo(() => {
    const standings: Record<string, GroupStanding[]> = {};

    groupsList.forEach((groupLetter) => {
      // Find all matches for this group
      const groupMatches = matches.filter((m) => m.group === groupLetter);
      
      // Get all unique teams in this group from the matches
      const teamSet = new Set<string>();
      groupMatches.forEach((m) => {
        teamSet.add(m.teamA);
        teamSet.add(m.teamB);
      });
      const teamCodes = Array.from(teamSet);

      // Initialize standings records
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

      // Populate records from finished matches
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

      // Calculate goal differences and compile array
      const standingsArray = teamCodes.map((code) => {
        const r = recordsMap[code];
        r.goalDifference = r.goalsFor - r.goalsAgainst;
        return r;
      });

      // Sort standings by points (desc), goalDifference (desc), goalsFor (desc), and ELO rank (asc)
      standingsArray.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        
        // Tie breaker by ELO rank (smaller rank is better)
        const rankA = TEAMS[a.teamCode]?.rank ?? 999;
        const rankB = TEAMS[b.teamCode]?.rank ?? 999;
        return rankA - rankB;
      });

      standings[groupLetter] = standingsArray;
    });

    return standings;
  }, [matches]);

  const filteredGroups = selectedGroupFilter === "ALL" 
    ? groupsList 
    : [selectedGroupFilter];

  return (
    <div id="groups-tab-view" className="p-4 space-y-6 animate-fadein">
      {/* Title / Filter header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" /> Clasificación por Grupos
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Los dos mejores de cada grupo y los 8 mejores terceros avanzan a Dieciseisavos (R32).
          </p>
        </div>
        
        {/* Dropdown Filter */}
        <div className="relative">
          <select
            id="group-filter-select"
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl px-4 py-2.5 pr-10 hover:bg-slate-800 cursor-pointer focus:outline-none focus:border-blue-500 transition-all w-full sm:w-auto"
          >
            <option value="ALL">Mostrar Todos los Grupos</option>
            {groupsList.map((g) => (
              <option key={g} value={g}>Grupo {g}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((groupLetter) => {
          const standings = standingsByGroup[groupLetter] ?? [];

          return (
            <div
              key={groupLetter}
              id={`group-card-${groupLetter}`}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md p-4 space-y-3 shadow-md transform hover:-translate-y-0.5 transition-all"
            >
              {/* Group Title Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-sm font-black text-emerald-400 tracking-wider">
                  GRUPO {groupLetter}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <Award className="h-3.5 w-3.5 text-amber-500" /> R32 Clasificación
                </span>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-12 gap-1 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-800/40 pb-1">
                <span className="col-span-1 text-left">#</span>
                <span className="col-span-5 text-left">Selección</span>
                <span className="col-span-1">PJ</span>
                <span className="col-span-1">PG</span>
                <span className="col-span-1">PE</span>
                <span className="col-span-1">PP</span>
                <span className="col-span-1">DG</span>
                <span className="col-span-1 text-emerald-400">Pts</span>
              </div>

              {/* Standings Rows */}
              <div className="space-y-1">
                {standings.map((row, index) => {
                  const team = TEAMS[row.teamCode];
                  const position = index + 1;
                  const isQualified = position <= 2; // Direct qualification
                  
                  if (!team) return null;

                  return (
                    <div
                      key={row.teamCode}
                      id={`standing-row-${groupLetter}-${row.teamCode}`}
                      className="grid grid-cols-12 gap-1 items-center text-center py-2 text-[10.5px] sm:text-xs border-b border-slate-800/30 last:border-0 hover:bg-slate-800/20 px-1 rounded-lg transition-colors"
                    >
                      {/* Position */}
                      <span className={`col-span-1 text-left font-mono font-bold ${
                        isQualified ? "text-emerald-400" : "text-slate-500"
                      }`}>
                        {position}
                      </span>

                      {/* Team Name and flag */}
                      <div className="col-span-5 flex items-center gap-1.5 text-left truncate">
                        <span className="text-lg filter drop-shadow-sm flex-shrink-0" role="img" aria-label={team.name}>
                          {team.flag}
                        </span>
                        <span className="font-semibold text-slate-200 truncate text-[10.5px] sm:text-xs">
                          {team.name}
                        </span>
                      </div>

                      {/* Played */}
                      <span className="col-span-1 font-mono text-slate-400">{row.played}</span>
                      {/* Won */}
                      <span className="col-span-1 font-mono text-slate-400">{row.won}</span>
                      {/* Drawn */}
                      <span className="col-span-1 font-mono text-slate-400">{row.drawn}</span>
                      {/* Lost */}
                      <span className="col-span-1 font-mono text-slate-400">{row.lost}</span>
                      {/* Goal Difference */}
                      <span className={`col-span-1 font-mono font-bold ${
                        row.goalDifference > 0 
                          ? "text-blue-400" 
                          : row.goalDifference < 0 
                            ? "text-rose-400" 
                            : "text-slate-500"
                      }`}>
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </span>
                      {/* Points */}
                      <span className="col-span-1 font-mono font-extrabold text-emerald-400 bg-emerald-500/5 py-0.5 rounded border border-emerald-500/10">
                        {row.points}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
