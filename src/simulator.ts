/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match } from "./types";
import { TEAMS, AGENTS } from "./data";

// Seeded deterministic random number generator for consistent predictions per match + agent
export function seededRandom(matchId: string, agentId: string): () => number {
  const seed = `${matchId}_${agentId}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h ^= h >>> 16;
    h = Math.imul(h, 0x45d9f3b);
    h ^= h >>> 16;
    h = Math.imul(h, 0x45d9f3b);
    h ^= h >>> 16;
    return (h >>> 0) / 0xffffffff;
  };
}

// Calculate form bonus based on historical results
export function getFormBonus(teamCode: string, allMatches: Match[]): number {
  let points = 0;
  let games = 0;
  let goalDiff = 0;

  allMatches.forEach((match) => {
    if (match.finished && (match.teamA === teamCode || match.teamB === teamCode)) {
      games++;
      const isHome = match.teamA === teamCode;
      const goalsFor = isHome ? (match.scoreA ?? 0) : (match.scoreB ?? 0);
      const goalsAgainst = isHome ? (match.scoreB ?? 0) : (match.scoreA ?? 0);
      goalDiff += goalsFor - goalsAgainst;
      if (goalsFor > goalsAgainst) {
        points += 3;
      } else if (goalsFor === goalsAgainst) {
        points += 1;
      }
    }
  });

  if (games === 0) return 0;
  return (points / games - 1.25) * 0.18 + (goalDiff / games) * 0.12;
}

// Predict a single match with an agent
export function predictMatch(match: Match, agentId: string, allMatches: Match[] = []): { scoreA: number; scoreB: number } {
  const teamA = TEAMS[match.teamA];
  const teamB = TEAMS[match.teamB];
  if (!teamA || !teamB) return { scoreA: 0, scoreB: 0 };

  const rng = seededRandom(match.id, agentId);
  const rankDiff = teamB.rank - teamA.rank; // positive = A is better (smaller rank number)
  const valueDiff = Math.log10(teamA.value / teamB.value) * 1.5;
  const attVsDef_A = teamA.att - teamB.def; // offensive advantage of A
  const attVsDef_B = teamB.att - teamA.def; // offensive advantage of B
  const formA = getFormBonus(match.teamA, allMatches);
  const formB = getFormBonus(match.teamB, allMatches);

  // Base goal expectation (lambda approximation)
  let lambdaA = 1.35 + rankDiff * 0.015 + valueDiff * 0.35 + attVsDef_A * 0.015 + formA;
  let lambdaB = 1.35 - rankDiff * 0.015 - valueDiff * 0.35 + attVsDef_B * 0.015 + formB;

  lambdaA = Math.max(0.1, lambdaA);
  lambdaB = Math.max(0.1, lambdaB);

  // Modifier by agent
  switch (agentId) {
    case "alphapitch": {
      // Random neural variation
      const noise = rng() * 1.6 - 0.8;
      lambdaA += noise;
      lambdaB -= noise;
      break;
    }
    case "sportsradar":
      // Fatigue: reduce if racha is long
      if (rng() > 0.65) lambdaA -= 0.35;
      if (rng() < 0.35) lambdaB -= 0.35;
      break;

    case "538quantum":
      // Light advantage to ELO leader
      lambdaA += 0.05;
      lambdaB -= 0.05;
      break;

    case "transfermarkt":
      // Market value dominates
      lambdaA *= teamA.value > teamB.value ? 1.35 : 0.75;
      lambdaB *= teamB.value > teamA.value ? 1.35 : 0.75;
      break;

    case "globin": {
      // Recent form (last 6)
      const winsA = teamA.racha.filter((r) => r === "W").length;
      const winsB = teamB.racha.filter((r) => r === "W").length;
      lambdaA += (winsA - winsB) * 0.12;
      break;
    }
    case "sofascore":
      // Player rating: +5% on both
      lambdaA *= 1.05;
      lambdaB *= 1.05;
      break;

    case "scisports":
      // Chemistry: tends towards draw
      lambdaA = (lambdaA + lambdaB) / 2;
      lambdaB = lambdaA;
      break;

    case "deepgoal":
      // High scoring goal propensity
      lambdaA += 0.55;
      lambdaB += 0.55;
      break;

    case "tactical":
      // Monte Carlo simulation noise
      lambdaA = lambdaA * 0.85 + rng() * 0.45;
      lambdaB = lambdaB * 0.85 + rng() * 0.45;
      break;

    case "oddsmaster":
      // Betting consensus: balances close lambdas
      if (Math.abs(lambdaA - lambdaB) < 0.45) {
        lambdaA = (lambdaA + lambdaB) / 2;
        lambdaB = lambdaA;
      }
      break;

    case "historystats": {
      // H2H: favors a random selection historically
      const roll = rng();
      if (roll > 0.75) lambdaA += 0.5;
      else if (roll < 0.25) lambdaB += 0.5;
      break;
    }
    case "mourinho":
      // Defensive park-the-bus mojo
      lambdaA = Math.max(0, lambdaA * 0.55 - 0.1);
      lambdaB = Math.max(0, lambdaB * 0.55 - 0.1);
      break;

    case "bielsa":
      // Intense attack, open game, high scoring
      lambdaA = lambdaA * 1.35 + 0.45;
      lambdaB = lambdaB * 1.35 + 0.45;
      break;

    case "pep":
      // Positional play: heavily rewards quality (value)
      if (teamA.value > teamB.value) {
        lambdaA += 0.45;
        lambdaB = Math.max(0.1, lambdaB - 0.25);
      } else if (teamB.value > teamA.value) {
        lambdaB += 0.45;
        lambdaA = Math.max(0.1, lambdaA - 0.25);
      }
      break;

    case "besoccer":
      // ELO + Form mixture
      lambdaA = lambdaA * 0.9 + rankDiff * 0.005;
      lambdaB = lambdaB * 0.9 - rankDiff * 0.005;
      break;

    default:
      break;
  }

  // Final deterministic score with controlled random noise
  const scoreA = Math.max(0, Math.round(lambdaA + (rng() - 0.5) * 0.9));
  const scoreB = Math.max(0, Math.round(lambdaB + (rng() - 0.5) * 0.9));
  return { scoreA, scoreB };
}

// Consensus prediction: average of all agents
export function predictConsensus(match: Match, allMatches: Match[] = []): { scoreA: number; scoreB: number } {
  const predictions = AGENTS.map((agent) => predictMatch(match, agent.id, allMatches));
  const avgA = predictions.reduce((sum, p) => sum + p.scoreA, 0) / predictions.length;
  const avgB = predictions.reduce((sum, p) => sum + p.scoreB, 0) / predictions.length;
  return {
    scoreA: Math.round(avgA),
    scoreB: Math.round(avgB),
  };
}
