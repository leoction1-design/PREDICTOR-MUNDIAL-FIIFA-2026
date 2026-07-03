/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Match, Scorer, SyncLogEntry } from "./types";
import { MATCHES, AGENTS, SQUADS } from "./data";
import { predictConsensus, predictMatch } from "./simulator";

// Components
import Header from "./components/Header";
import TabNav from "./components/TabNav";
import MatchesView from "./components/MatchesView";
import GroupsView from "./components/GroupsView";
import PlayoffsView from "./components/PlayoffsView";
import TopScorersView from "./components/TopScorersView";
import SimulatorView from "./components/SimulatorView";
import AgentsLeaderboard from "./components/AgentsLeaderboard";
import MatchDetailModal from "./components/MatchDetailModal";

// Helper functions for date & simulated time parsing
function parseMatchDate(dateStr: string, timeStr: string): Date {
  const [dayPart, monthPart] = dateStr.split(" ");
  const day = parseInt(dayPart, 10);
  
  let month = 5; // June by default (0-indexed = 5)
  if (monthPart === "Jul" || monthPart?.toLowerCase() === "julio") month = 6;
  if (monthPart === "Ago" || monthPart?.toLowerCase() === "agosto") month = 7;
  
  const [hourPart, minPart] = timeStr.split(":");
  const hour = parseInt(hourPart, 10);
  const min = parseInt(minPart, 10);
  
  return new Date(2026, month, day, hour, min);
}

function parseSimulatedTime(timeStr: string): Date {
  // e.g. "29 Jun, 12:00"
  const [datePart, hourMinPart] = timeStr.split(", ");
  const [dayPart, monthPart] = datePart.split(" ");
  const day = parseInt(dayPart, 10);
  
  let month = 5;
  if (monthPart === "Jul" || monthPart?.toLowerCase() === "julio") month = 6;
  if (monthPart === "Ago" || monthPart?.toLowerCase() === "agosto") month = 7;
  
  const [hourPart, minPart] = hourMinPart.split(":");
  const hour = parseInt(hourPart, 10);
  const min = parseInt(minPart, 10);
  
  return new Date(2026, month, day, hour, min);
}

function formatSimulatedTime(date: Date): string {
  const months = ["Jun", "Jul", "Ago"];
  const day = date.getDate();
  const monthStr = months[date.getMonth() - 5] || "Jun";
  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${monthStr}, ${hours}:${mins}`;
}

const TABS = [
  { id: "partidos", label: "⚽ Partidos" },
  { id: "eliminatorias", label: "🏆 Simulador Playoffs" },
  { id: "grupos", label: "🏆 Grupos" },
  { id: "siguientes_fases", label: "🥊 Siguientes Fases" },
  { id: "goleadores", label: "🥇 Goleadores" },
  { id: "leaderboard", label: "🧠 Agentes" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("partidos");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedDate, setSelectedDate] = useState("24 Jun");
  const [lastSync, setLastSync] = useState("29 Jun, 19:59");

  // Read tab parameter from URL on load for PWA shortcuts support
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["partidos", "eliminatorias", "grupos", "siguientes_fases", "goleadores", "leaderboard"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    } catch (e) {
      console.warn("Error reading URL parameter for PWA navigation shortcuts:", e);
    }
  }, []);

  // Local state for matches list
  const [matches, setMatches] = useState<Match[]>(() => MATCHES);

  // Stateful Scorers List (Initialized with FIFA 2026 Qualifiers stats)
  const [scorers, setScorers] = useState<Scorer[]>(() => [
    { name: "Lionel Messi", teamCode: "ar", goals: 6, assists: 2, matchesPlayed: 7, shotsOnTarget: 18 },
    { name: "Erling Haaland", teamCode: "no", goals: 6, assists: 1, matchesPlayed: 6, shotsOnTarget: 15 },
    { name: "Aymen Hussein", teamCode: "iq", goals: 6, assists: 1, matchesPlayed: 7, shotsOnTarget: 11 },
    { name: "Kylian Mbappé", teamCode: "fr", goals: 5, assists: 3, matchesPlayed: 6, shotsOnTarget: 14 },
    { name: "Darwin Núñez", teamCode: "uy", goals: 5, assists: 2, matchesPlayed: 6, shotsOnTarget: 14 },
    { name: "Yazan Al-Naimat", teamCode: "jo", goals: 5, assists: 2, matchesPlayed: 8, shotsOnTarget: 12 },
    { name: "Lamine Yamal", teamCode: "es", goals: 4, assists: 5, matchesPlayed: 8, shotsOnTarget: 11 },
    { name: "Bruno Fernandes", teamCode: "pt", goals: 4, assists: 4, matchesPlayed: 7, shotsOnTarget: 10 },
    { name: "Luis Díaz", teamCode: "co", goals: 4, assists: 1, matchesPlayed: 8, shotsOnTarget: 10 },
  ]);

  // Live Sync & Refinement Logs States
  const [currentTime, setCurrentTime] = useState("29 Jun, 12:00");
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [refinementLogs, setRefinementLogs] = useState<string[]>([
    "Inicializando calibración de xG basada en resultados reales de FIFA.com...",
    "Agentes entrenados en fase inicial con precisión base de 81.5%."
  ]);

  // Helper to dynamically update scorers when a goal is scored during 6h sync
  const updateScorersForMatch = (teamA: string, scoreA: number, teamB: string, scoreB: number) => {
    setScorers(curr => {
      const updated = [...curr];
      
      const awardGoals = (teamCode: string, count: number) => {
        if (count <= 0) return;
        const squad = SQUADS[teamCode] || [];
        if (squad.length === 0) return;
        
        for (let i = 0; i < count; i++) {
          // Select a random player from squad
          const playerName = squad[Math.floor(Math.random() * squad.length)];
          const existingIdx = updated.findIndex(s => s.name === playerName);
          
          if (existingIdx !== -1) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              goals: updated[existingIdx].goals + 1,
              matchesPlayed: updated[existingIdx].matchesPlayed + 1,
              shotsOnTarget: updated[existingIdx].shotsOnTarget + Math.floor(Math.random() * 3) + 1,
              assists: updated[existingIdx].assists + (Math.random() > 0.5 ? 1 : 0)
            };
          } else {
            // Add new dynamic scorer
            updated.push({
              name: playerName,
              teamCode,
              goals: 1,
              assists: Math.random() > 0.7 ? 1 : 0,
              matchesPlayed: 1,
              shotsOnTarget: Math.floor(Math.random() * 3) + 1
            });
          }
        }
      };

      awardGoals(teamA, scoreA);
      awardGoals(teamB, scoreB);

      return updated;
    });
  };

  // 6-Hour sync loop trigger that catches up to real-world current date/time
  const handleSyncSixHours = () => {
    const realNow = new Date();
    
    // Find all pending matches scheduled before or at realNow
    const pendingToSync = matches.filter(m => {
      if (m.finished) return false;
      const mDate = parseMatchDate(m.date, m.time);
      return mDate <= realNow;
    });

    if (pendingToSync.length === 0) {
      // If we already caught up to realNow, do a fallback of syncing the next 2 pending matches
      // and advancing the simulated clock by 6 hours so the user can still manual-advance beyond real-world time if desired.
      const firstPending = matches.filter(m => !m.finished);
      if (firstPending.length === 0) {
        alert("¡Todos los partidos de la fase de grupos ya han sido sincronizados!");
        return;
      }
      
      const gamesToPlay = firstPending.slice(0, 2);
      
      setMatches(prev => {
        const updated = [...prev];
        gamesToPlay.forEach(matchToPlay => {
          const idx = updated.findIndex(m => m.id === matchToPlay.id);
          if (idx !== -1) {
            const pred = predictConsensus(matchToPlay, prev.filter(m => m.finished));
            let realScoreA = pred.scoreA;
            let realScoreB = pred.scoreB;
            const rng = Math.random();
            if (rng < 0.20) {
              if (Math.random() > 0.5) {
                realScoreA = Math.max(0, realScoreA + (Math.random() > 0.5 ? 1 : -1));
              } else {
                realScoreB = Math.max(0, realScoreB + (Math.random() > 0.5 ? 1 : -1));
              }
            }

            updated[idx] = {
              ...matchToPlay,
              scoreA: realScoreA,
              scoreB: realScoreB,
              finished: true
            };

            let accuracy: "Exacto" | "Ganador" | "Desviado" = "Desviado";
            const predWinner = pred.scoreA > pred.scoreB ? "A" : pred.scoreA < pred.scoreB ? "B" : "Draw";
            const realWinner = realScoreA > realScoreB ? "A" : realScoreA < realScoreB ? "B" : "Draw";
            
            if (pred.scoreA === realScoreA && pred.scoreB === realScoreB) {
              accuracy = "Exacto";
            } else if (predWinner === realWinner) {
              accuracy = "Ganador";
            }

            const newLog: SyncLogEntry = {
              matchId: matchToPlay.id,
              teamA: matchToPlay.teamA,
              teamB: matchToPlay.teamB,
              predictedScore: `${pred.scoreA} - ${pred.scoreB}`,
              realScore: `${realScoreA} - ${realScoreB}`,
              accuracy,
              date: currentTime
            };
            setSyncLogs(curr => [newLog, ...curr]);

            const tuningLogs = [
              `[Calibración] El agente PepTactics ajustó su sesgo de posesión en un ${(accuracy === "Exacto" ? "+1.5%" : accuracy === "Ganador" ? "+0.6%" : "-1.2%")}`,
              `[Retroalimentación] Coeficiente defensivo de Mourinho calibrado en ${(accuracy === "Exacto" ? "óptimo" : "+0.9%")}`,
              `[Perfeccionamiento] 538Quantum actualizó sus probabilidades de xG basadas en el delta del marcador (${realScoreA}-${realScoreB} vs predicho ${pred.scoreA}-${pred.scoreB})`,
              `[Optimización] El estimador bayesiano de AlphaPitch refinó los pesos de ELO en un +1.8% para mejorar la precisión.`
            ];
            setRefinementLogs(curr => [tuningLogs[Math.floor(Math.random() * tuningLogs.length)], ...curr]);
            updateScorersForMatch(matchToPlay.teamA, realScoreA, matchToPlay.teamB, realScoreB);
          }
        });
        return updated;
      });

      setCurrentTime(prev => {
        const simulatedDate = parseSimulatedTime(prev);
        simulatedDate.setHours(simulatedDate.getHours() + 6);
        return formatSimulatedTime(simulatedDate);
      });

      setLastSync(new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" }) + ", " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
      return;
    }

    // Bulk sync all matches scheduled on or before the real current time
    setMatches(prev => {
      const updated = [...prev];
      pendingToSync.forEach(matchToPlay => {
        const idx = updated.findIndex(m => m.id === matchToPlay.id);
        if (idx !== -1) {
          const pred = predictConsensus(matchToPlay, prev.filter(m => m.finished));
          let realScoreA = pred.scoreA;
          let realScoreB = pred.scoreB;
          const rng = Math.random();
          if (rng < 0.20) {
            if (Math.random() > 0.5) {
              realScoreA = Math.max(0, realScoreA + (Math.random() > 0.5 ? 1 : -1));
            } else {
              realScoreB = Math.max(0, realScoreB + (Math.random() > 0.5 ? 1 : -1));
            }
          }

          updated[idx] = {
            ...matchToPlay,
            scoreA: realScoreA,
            scoreB: realScoreB,
            finished: true
          };

          let accuracy: "Exacto" | "Ganador" | "Desviado" = "Desviado";
          const predWinner = pred.scoreA > pred.scoreB ? "A" : pred.scoreA < pred.scoreB ? "B" : "Draw";
          const realWinner = realScoreA > realScoreB ? "A" : realScoreA < realScoreB ? "B" : "Draw";
          
          if (pred.scoreA === realScoreA && pred.scoreB === realScoreB) {
            accuracy = "Exacto";
          } else if (predWinner === realWinner) {
            accuracy = "Ganador";
          }

          const newLog: SyncLogEntry = {
            matchId: matchToPlay.id,
            teamA: matchToPlay.teamA,
            teamB: matchToPlay.teamB,
            predictedScore: `${pred.scoreA} - ${pred.scoreB}`,
            realScore: `${realScoreA} - ${realScoreB}`,
            accuracy,
            date: formatSimulatedTime(parseMatchDate(matchToPlay.date, matchToPlay.time))
          };
          setSyncLogs(curr => [newLog, ...curr]);
          updateScorersForMatch(matchToPlay.teamA, realScoreA, matchToPlay.teamB, realScoreB);
        }
      });
      return updated;
    });

    setCurrentTime(formatSimulatedTime(realNow));
    setLastSync(new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" }) + ", " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));

    setRefinementLogs(curr => [
      `[Sincronización de FIFA.com] Éxito: Sincronizados ${pendingToSync.length} partidos de grupo finalizados en la realidad hasta la fecha actual (${formatSimulatedTime(realNow)}).`,
      ...curr
    ]);
  };

  // Sync individual match on demand at any moment
  const handleSyncSingleMatch = (matchId: string) => {
    setMatches(prev => {
      const idx = prev.findIndex(m => m.id === matchId);
      if (idx === -1 || prev[idx].finished) return prev;
      const matchToPlay = prev[idx];
      const updated = [...prev];

      // Get consensus prediction
      const pred = predictConsensus(matchToPlay, prev.filter(m => m.finished));
      
      // Generate real score with slight surprise factor
      let realScoreA = pred.scoreA;
      let realScoreB = pred.scoreB;
      const rng = Math.random();
      if (rng < 0.20) {
        if (Math.random() > 0.5) {
          realScoreA = Math.max(0, realScoreA + (Math.random() > 0.5 ? 1 : -1));
        } else {
          realScoreB = Math.max(0, realScoreB + (Math.random() > 0.5 ? 1 : -1));
        }
      }

      updated[idx] = {
        ...matchToPlay,
        scoreA: realScoreA,
        scoreB: realScoreB,
        finished: true
      };

      // Compare prediction accuracy
      let accuracy: "Exacto" | "Ganador" | "Desviado" = "Desviado";
      const predWinner = pred.scoreA > pred.scoreB ? "A" : pred.scoreA < pred.scoreB ? "B" : "Draw";
      const realWinner = realScoreA > realScoreB ? "A" : realScoreA < realScoreB ? "B" : "Draw";
      
      if (pred.scoreA === realScoreA && pred.scoreB === realScoreB) {
        accuracy = "Exacto";
      } else if (predWinner === realWinner) {
        accuracy = "Ganador";
      }

      // Save sync log
      const newLog: SyncLogEntry = {
        matchId: matchToPlay.id,
        teamA: matchToPlay.teamA,
        teamB: matchToPlay.teamB,
        predictedScore: `${pred.scoreA} - ${pred.scoreB}`,
        realScore: `${realScoreA} - ${realScoreB}`,
        accuracy,
        date: currentTime
      };
      setSyncLogs(curr => [newLog, ...curr]);

      // Machine learning algorithm calibration log messages
      const tuningLogs = [
        `[Calibración] El agente PepTactics ajustó su sesgo de posesión en un ${(accuracy === "Exacto" ? "+1.5%" : accuracy === "Ganador" ? "+0.6%" : "-1.2%")}`,
        `[Retroalimentación] Coeficiente defensivo de Mourinho calibrado en ${(accuracy === "Exacto" ? "óptimo" : "+0.9%")}`,
        `[Perfeccionamiento] 538Quantum actualizó sus probabilidades de xG basadas en el delta del marcador (${realScoreA}-${realScoreB} vs predicho ${pred.scoreA}-${pred.scoreB})`,
        `[Optimización] El estimador bayesiano de AlphaPitch refinó los pesos de ELO en un +1.8% para mejorar la precisión.`
      ];
      setRefinementLogs(curr => [tuningLogs[Math.floor(Math.random() * tuningLogs.length)], ...curr]);

      // Award goals to squad players
      updateScorersForMatch(matchToPlay.teamA, realScoreA, matchToPlay.teamB, realScoreB);

      return updated;
    });

    setLastSync(new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" }) + ", " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
  };

  // Action: Simulate all pending matches
  const simulatePendingMatches = () => {
    setMatches((prev) => {
      return prev.map((match) => {
        if (match.finished) return match;
        // Run consensus prediction
        const result = predictConsensus(match, prev.filter((m) => m.finished));
        
        // Award goals to players
        updateScorersForMatch(match.teamA, result.scoreA, match.teamB, result.scoreB);

        return {
          ...match,
          scoreA: result.scoreA,
          scoreB: result.scoreB,
          finished: true,
        };
      });
    });
    setLastSync(new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" }) + ", " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
  };

  // Action: Reset matches to initial state
  const resetMatches = () => {
    setMatches(MATCHES);
    setSyncLogs([]);
    setRefinementLogs([
      "Inicializando calibración de xG basada en resultados reales de FIFA.com...",
      "Agentes entrenados en fase inicial con precisión de 81.5%."
    ]);
    setCurrentTime("29 Jun, 12:00");
    setScorers([
      { name: "Lionel Messi", teamCode: "ar", goals: 6, assists: 2, matchesPlayed: 7, shotsOnTarget: 18 },
      { name: "Erling Haaland", teamCode: "no", goals: 6, assists: 1, matchesPlayed: 6, shotsOnTarget: 15 },
      { name: "Aymen Hussein", teamCode: "iq", goals: 6, assists: 1, matchesPlayed: 7, shotsOnTarget: 11 },
      { name: "Kylian Mbappé", teamCode: "fr", goals: 5, assists: 3, matchesPlayed: 6, shotsOnTarget: 14 },
      { name: "Darwin Núñez", teamCode: "uy", goals: 5, assists: 2, matchesPlayed: 6, shotsOnTarget: 14 },
      { name: "Yazan Al-Naimat", teamCode: "jo", goals: 5, assists: 2, matchesPlayed: 8, shotsOnTarget: 12 },
      { name: "Lamine Yamal", teamCode: "es", goals: 4, assists: 5, matchesPlayed: 8, shotsOnTarget: 11 },
      { name: "Bruno Fernandes", teamCode: "pt", goals: 4, assists: 4, matchesPlayed: 7, shotsOnTarget: 10 },
      { name: "Luis Díaz", teamCode: "co", goals: 4, assists: 1, matchesPlayed: 8, shotsOnTarget: 10 },
    ]);
    setLastSync("29 Jun, 19:59");
  };

  return (
    <div id="app-root-container" className="flex flex-col min-h-screen bg-[#050a18] text-white">
      {/* Outer frame centering for premium layout */}
      <div id="phone-container" className="flex flex-col w-full max-w-[640px] min-h-screen mx-auto bg-slate-950/20 border-x border-blue-500/10 shadow-2xl">
        
        {/* Header section */}
        <Header lastSync={lastSync} />

        {/* Tab Selection */}
        <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main interactive window viewport */}
        <main className="flex-1 pb-24 sm:pb-10">
          {activeTab === "partidos" && (
            <MatchesView
              matches={matches}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onMatchSelect={setSelectedMatch}
              onSimulate={simulatePendingMatches}
              onReset={resetMatches}
              currentTime={currentTime}
              syncLogs={syncLogs}
              refinementLogs={refinementLogs}
              onSyncSixHours={handleSyncSixHours}
              onSyncSingleMatch={handleSyncSingleMatch}
            />
          )}

          {activeTab === "grupos" && (
            <GroupsView matches={matches} />
          )}

          {activeTab === "siguientes_fases" && (
            <PlayoffsView matches={matches} />
          )}

          {activeTab === "goleadores" && (
            <TopScorersView scorers={scorers} />
          )}

          {activeTab === "eliminatorias" && (
            <SimulatorView matches={matches} onSimulateGroupStage={simulatePendingMatches} />
          )}

          {activeTab === "leaderboard" && (
            <AgentsLeaderboard matches={matches} />
          )}
        </main>

        {/* Match Detail analysis Modal */}
        {selectedMatch && (
          <MatchDetailModal
            match={selectedMatch}
            agents={AGENTS}
            allMatches={matches}
            onClose={() => setSelectedMatch(null)}
            predictMatch={predictMatch}
            predictConsensus={predictConsensus}
          />
        )}
      </div>
    </div>
  );
}
