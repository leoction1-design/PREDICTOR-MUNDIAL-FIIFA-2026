/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Globe, Filter } from "lucide-react";
import { desdeLambdas, calibrarAlMercado } from "../dixonColes";
import real from "../realData.json";

/**
 * Partidos reales de Forebet con la distribución del modelo.
 *
 * A diferencia de las vistas del Mundial, aquí no hay grupos ni eliminatorias: son fixtures
 * de ligas de club de todo el mundo. Las lambdas vienen precalculadas por el pipeline
 * (Dixon-Coles ajustado liga por liga sobre 17.276 partidos jugados), así que esta vista
 * solo las pasa por la distribución y las presenta.
 */

interface RealTeam {
  name: string;
  league: string;
  rank: number;
  att: number;
  def: number;
  racha: string[];
}

interface RealMatch {
  id: string;
  date: string;
  time: string;
  league: string;
  teamA: string;
  teamB: string;
  lambdaA: number;
  lambdaB: number;
  forebetPick: string | null;
  odds: number[] | null;
}

const TEAMS = real.teams as unknown as Record<string, RealTeam>;
const MATCHES = real.matches as unknown as RealMatch[];

const PAGE = 40;

export const RealMatchesView: React.FC = () => {
  const [fecha, setFecha] = useState<string>("");
  const [liga, setLiga] = useState<string>("");
  const [busca, setBusca] = useState<string>("");
  const [visibles, setVisibles] = useState(PAGE);

  const fechas = useMemo(
    () => Array.from(new Set(MATCHES.map((m) => m.date))).sort(),
    []
  );
  const ligas = useMemo(
    () => Array.from(new Set(MATCHES.map((m) => m.league))).filter(Boolean).sort(),
    []
  );

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return MATCHES.filter((m) => {
      if (fecha && m.date !== fecha) return false;
      if (liga && m.league !== liga) return false;
      if (q) {
        const nombres = `${TEAMS[m.teamA]?.name ?? ""} ${TEAMS[m.teamB]?.name ?? ""}`.toLowerCase();
        if (!nombres.includes(q)) return false;
      }
      return true;
    });
  }, [fecha, liga, busca]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-5 w-5 text-cyan-400" />
          <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
            Partidos reales &middot; {MATCHES.length} pendientes en {ligas.length} ligas
          </h3>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Modelo Dixon-Coles ajustado liga por liga sobre {real.entrenamiento.partidos.toLocaleString("es")} partidos
          jugados de los últimos 90 días. Cada marcador viene con su probabilidad: el más
          probable de un partido de fútbol ronda el 10-20%, así que trátalo como tal.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-slate-500" />
        <select
          value={fecha}
          onChange={(e) => { setFecha(e.target.value); setVisibles(PAGE); }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200"
        >
          <option value="">Todas las fechas</option>
          {fechas.map((f) => (
            <option key={f} value={f}>
              {f.slice(8)}/{f.slice(5, 7)} ({MATCHES.filter((m) => m.date === f).length})
            </option>
          ))}
        </select>
        <select
          value={liga}
          onChange={(e) => { setLiga(e.target.value); setVisibles(PAGE); }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200"
        >
          <option value="">Todas las ligas</option>
          {ligas.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <input
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setVisibles(PAGE); }}
          placeholder="Buscar equipo..."
          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 flex-1 min-w-[140px]"
        />
        <span className="text-[10px] font-mono text-slate-500">
          {filtrados.length} de {MATCHES.length}
        </span>
      </div>

      <div className="space-y-2">
        {filtrados.slice(0, visibles).map((m) => {
          const A = TEAMS[m.teamA];
          const B = TEAMS[m.teamB];
          // Con cuotas, el reparto 1X2 lo manda el mercado y la forma del
          // marcador la pone el modelo. Sin cuotas, el modelo va solo.
          const p = calibrarAlMercado(m.lambdaA, m.lambdaB, m.odds);
          return (
            <div key={m.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 space-y-2">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wide text-slate-500">
                <span>{m.league} &middot; {m.date.slice(8)}/{m.date.slice(5, 7)} {m.time}</span>
                <span>
                  {m.odds ? "Calibrado al mercado" : "Solo modelo"}
                  {m.forebetPick ? ` · Forebet: ${m.forebetPick}` : ""}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-slate-100 truncate">{A?.name}</div>
                  <div className="text-[13px] text-slate-400 truncate">{B?.name}</div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="font-mono text-base font-black text-emerald-400">
                    {p.scoreA} - {p.scoreB}
                  </div>
                  <div className="text-[9px] font-bold text-slate-500">
                    {(p.confianza * 100).toFixed(0)}% probable
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.top.slice(0, 4).map((c, i) => (
                  <span
                    key={c.marcador}
                    className={
                      "font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border " +
                      (i === 0
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400")
                    }
                  >
                    {c.marcador} <span className="opacity-60">{(c.p * 100).toFixed(1)}%</span>
                  </span>
                ))}
              </div>

              <div>
                <div className="flex h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500" style={{ width: `${p.p1x2.local * 100}%` }} />
                  <div className="bg-slate-500" style={{ width: `${p.p1x2.empate * 100}%` }} />
                  <div className="bg-amber-500" style={{ width: `${p.p1x2.visitante * 100}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-500">
                  <span>{(p.p1x2.local * 100).toFixed(0)}%</span>
                  <span>X {(p.p1x2.empate * 100).toFixed(0)}%</span>
                  <span>{(p.p1x2.visitante * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibles < filtrados.length && (
        <button
          onClick={() => setVisibles((v) => v + PAGE * 2)}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
        >
          Ver más ({filtrados.length - visibles} restantes)
        </button>
      )}
    </div>
  );
};
