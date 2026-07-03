/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  name: string;
  flag: string;
  rank: number;
  att: number;
  def: number;
  value: number; // in Millions of EUR
  racha: string[]; // Recent form (W, D, L)
}

export interface PlayerStats {
  physicalForm: number;
  attackingTactics: string;
  playerProgression: string;
}

export interface Agent {
  id: string;
  name: string;
  label: string;
  desc: string;
  flag?: string;
}

export interface Match {
  id: string;
  date: string;
  dateFull: string;
  group: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  time: string;
  stadium: string;
  finished: boolean;
  // Dynamic simulation outcomes if stored or simulated
  predictedByAgents?: Record<string, { scoreA: number; scoreB: number }>;
}

export interface Scorer {
  name: string;
  teamCode: string;
  goals: number;
  assists: number;
  matchesPlayed: number;
  shotsOnTarget: number;
}

export interface SyncLogEntry {
  matchId: string;
  teamA: string;
  teamB: string;
  predictedScore: string;
  realScore: string;
  accuracy: "Exacto" | "Ganador" | "Desviado";
  date: string;
}

export interface GroupStanding {
  teamCode: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
