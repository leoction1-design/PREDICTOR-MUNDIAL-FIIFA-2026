/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team, Agent, Match } from "./types";

export const TEAMS: Record<string, Team> = {
  // Group A
  mx: { name: "México", flag: "🇲🇽", rank: 16, att: 76, def: 74, value: 350, racha: ["W", "W", "D", "W", "W", "W"] },
  cz: { name: "Rep. Checa", flag: "🇨🇿", rank: 25, att: 75, def: 73, value: 220, racha: ["D", "W", "D", "L", "W", "D"] },
  za: { name: "Sudáfrica", flag: "🇿🇦", rank: 60, att: 68, def: 65, value: 80, racha: ["D", "L", "W", "D", "L", "W"] },
  kr: { name: "Corea del Sur", flag: "🇰🇷", rank: 22, att: 78, def: 72, value: 210, racha: ["W", "W", "D", "W", "D", "L"] },

  // Group B
  ca: { name: "Canadá", flag: "🇨🇦", rank: 22, att: 77, def: 73, value: 300, racha: ["W", "W", "W", "W", "D", "W"] },
  ch: { name: "Suiza", flag: "🇨🇭", rank: 18, att: 78, def: 79, value: 360, racha: ["W", "W", "D", "W", "W", "D"] },
  ba: { name: "Bosnia-Herzegovina", flag: "🇧🇦", rank: 74, att: 69, def: 68, value: 90, racha: ["L", "D", "L", "W", "D", "L"] },
  qa: { name: "Qatar", flag: "🇶🇦", rank: 34, att: 71, def: 67, value: 80, racha: ["W", "D", "W", "L", "D", "W"] },

  // Group C
  br: { name: "Brasil", flag: "🇧🇷", rank: 3, att: 88, def: 84, value: 1050, racha: ["W", "D", "W", "W", "W", "W"] },
  ma: { name: "Marruecos", flag: "🇲🇦", rank: 13, att: 81, def: 82, value: 340, racha: ["W", "D", "W", "W", "D", "W"] },
  gb_sct: { name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rank: 39, att: 73, def: 74, value: 190, racha: ["D", "L", "W", "D", "L", "W"] },
  ht: { name: "Haití", flag: "🇭🇹", rank: 86, att: 66, def: 63, value: 30, racha: ["L", "L", "D", "W", "L", "D"] },

  // Group D
  us: { name: "EE.UU.", flag: "🇺🇸", rank: 11, att: 80, def: 78, value: 520, racha: ["W", "D", "W", "W", "W", "W"] },
  py: { name: "Paraguay", flag: "🇵🇾", rank: 50, att: 73, def: 75, value: 140, racha: ["D", "D", "W", "L", "W", "D"] },
  tr: { name: "Turquía", flag: "🇹🇷", rank: 26, att: 79, def: 75, value: 320, racha: ["W", "L", "W", "D", "L", "W"] },
  au: { name: "Australia", flag: "🇦🇺", rank: 24, att: 74, def: 73, value: 120, racha: ["W", "D", "W", "L", "W", "D"] },

  // Group E
  de: { name: "Alemania", flag: "🇩🇪", rank: 7, att: 85, def: 82, value: 820, racha: ["W", "D", "W", "W", "L", "W"] },
  ec: { name: "Ecuador", flag: "🇪🇨", rank: 30, att: 77, def: 78, value: 240, racha: ["W", "D", "W", "W", "D", "L"] },
  ci: { name: "Costa de Marfil", flag: "🇨🇮", rank: 38, att: 76, def: 74, value: 250, racha: ["W", "D", "W", "L", "W", "D"] },
  cw: { name: "Curazao", flag: "🇨🇼", rank: 90, att: 63, def: 62, value: 25, racha: ["L", "L", "D", "L", "W", "D"] },

  // Group F
  nl: { name: "Países Bajos", flag: "🇳🇱", rank: 8, att: 83, def: 81, value: 780, racha: ["W", "W", "W", "W", "D", "W"] },
  se: { name: "Suecia", flag: "🇸🇪", rank: 28, att: 78, def: 75, value: 290, racha: ["W", "W", "L", "D", "W", "L"] },
  jp: { name: "Japón", flag: "🇯🇵", rank: 15, att: 80, def: 78, value: 390, racha: ["W", "W", "L", "W", "W", "W"] },
  tn: { name: "Túnez", flag: "🇹🇳", rank: 41, att: 72, def: 73, value: 110, racha: ["D", "W", "L", "D", "W", "L"] },

  // Group G
  be: { name: "Bélgica", flag: "🇧🇪", rank: 9, att: 82, def: 79, value: 750, racha: ["D", "W", "L", "W", "D", "W"] },
  eg: { name: "Egipto", flag: "🇪🇬", rank: 35, att: 77, def: 72, value: 150, racha: ["W", "D", "W", "W", "D", "W"] },
  ir: { name: "Irán", flag: "🇮🇷", rank: 21, att: 75, def: 74, value: 120, racha: ["W", "D", "W", "W", "D", "W"] },
  nz: { name: "Nueva Zelanda", flag: "🇳🇿", rank: 85, att: 65, def: 64, value: 45, racha: ["L", "W", "D", "L", "W", "D"] },

  // Group H
  es: { name: "España", flag: "🇪🇸", rank: 6, att: 86, def: 83, value: 870, racha: ["W", "W", "D", "W", "W", "W"] },
  uy: { name: "Uruguay", flag: "🇺🇾", rank: 14, att: 81, def: 80, value: 380, racha: ["W", "D", "W", "W", "L", "W"] },
  cv: { name: "Cabo Verde", flag: "🇨🇻", rank: 65, att: 69, def: 68, value: 70, racha: ["D", "W", "L", "D", "W", "L"] },
  sa: { name: "Arabia Saudita", flag: "🇸🇦", rank: 56, att: 71, def: 69, value: 95, racha: ["D", "L", "W", "L", "W", "D"] },

  // Group I
  fr: { name: "Francia", flag: "🇫🇷", rank: 2, att: 90, def: 85, value: 1200, racha: ["W", "W", "W", "D", "W", "W"] },
  no: { name: "Noruega", flag: "🇳🇴", rank: 20, att: 83, def: 74, value: 420, racha: ["W", "W", "W", "W", "W", "D"] },
  sn: { name: "Senegal", flag: "🇸🇳", rank: 17, att: 79, def: 77, value: 310, racha: ["W", "W", "D", "W", "D", "W"] },
  iq: { name: "Irak", flag: "🇮🇶", rank: 58, att: 70, def: 67, value: 65, racha: ["W", "L", "D", "W", "L", "D"] },

  // Group J
  ar: { name: "Argentina", flag: "🇦🇷", rank: 1, att: 89, def: 84, value: 1100, racha: ["W", "W", "W", "W", "D", "W"] },
  dz: { name: "Argelia", flag: "🇩🇿", rank: 44, att: 75, def: 73, value: 180, racha: ["D", "W", "L", "W", "D", "W"] },
  at: { name: "Austria", flag: "🇦🇹", rank: 23, att: 78, def: 76, value: 280, racha: ["W", "L", "W", "D", "W", "L"] },
  jo: { name: "Jordania", flag: "🇯🇴", rank: 71, att: 68, def: 66, value: 40, racha: ["L", "D", "W", "L", "D", "W"] },

  // Group K
  co: { name: "Colombia", flag: "🇨🇴", rank: 12, att: 82, def: 78, value: 480, racha: ["W", "W", "W", "D", "W", "W"] },
  pt: { name: "Portugal", flag: "🇵🇹", rank: 5, att: 86, def: 81, value: 900, racha: ["W", "W", "W", "D", "W", "W"] },
  cd: { name: "RD Congo", flag: "🇨🇩", rank: 62, att: 71, def: 69, value: 85, racha: ["W", "L", "D", "D", "W", "L"] },
  uz: { name: "Uzbekistán", flag: "🇺🇿", rank: 66, att: 69, def: 68, value: 50, racha: ["D", "W", "D", "L", "W", "L"] },

  // Group L
  gb_eng: { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rank: 4, att: 87, def: 82, value: 980, racha: ["W", "W", "D", "W", "W", "L"] },
  hr: { name: "Croacia", flag: "🇭🇷", rank: 10, att: 81, def: 79, value: 410, racha: ["W", "D", "L", "W", "W", "D"] },
  gh: { name: "Ghana", flag: "🇬🇭", rank: 64, att: 73, def: 71, value: 150, racha: ["L", "D", "W", "L", "W", "D"] },
  pa: { name: "Panamá", flag: "🇵🇦", rank: 43, att: 72, def: 70, value: 75, racha: ["W", "D", "L", "W", "L", "D"] },
};

export const SQUADS: Record<string, string[]> = {
  fr: ["Kylian Mbappé", "Antoine Griezmann", "Ousmane Dembélé", "Marcus Thuram"],
  no: ["Erling Haaland", "Martin Ødegaard", "Alexander Sørloth"],
  ar: ["Lionel Messi", "Lautaro Martínez", "Julián Álvarez", "Alexis Mac Allister"],
  co: ["Luis Díaz", "James Rodríguez", "Jhon Durán", "Richard Ríos"],
  ca: ["Jonathan David", "Alphonso Davies", "Cyle Larin", "Tajon Buchanan"],
  pt: ["Cristiano Ronaldo", "Bruno Fernandes", "Rafael Leão", "Bernardo Silva"],
  jp: ["Ayase Ueda", "Kaoru Mitoma", "Takumi Minamino", "Ritsu Doan"],
  gb_eng: ["Harry Kane", "Jude Bellingham", "Bukayo Saka", "Phil Foden"],
  es: ["Álvaro Morata", "Lamine Yamal", "Nico Williams", "Dani Olmo"],
  de: ["Kai Havertz", "Florian Wirtz", "Jamal Musiala", "Niclas Füllkrug"],
  uy: ["Darwin Núñez", "Federico Valverde", "Facundo Pellistri", "Rodrigo Bentancur"],
  br: ["Vinícius Júnior", "Rodrygo Goes", "Raphinha", "Endrick"],
  nl: ["Memphis Depay", "Cody Gakpo", "Xavi Simons", "Donyell Malen"],
  be: ["Romelu Lukaku", "Kevin De Bruyne", "Leandro Trossard", "Jeremy Doku"],
  mx: ["Santiago Giménez", "Uriel Antuna", "Luis Chávez", "Edson Álvarez"],
  us: ["Christian Pulisic", "Folarin Balogun", "Timothy Weah", "Weston McKennie"],
  ch: ["Breel Embolo", "Xherdan Shaqiri", "Zeki Amdouni", "Granit Xhaka"],
  cz: ["Patrik Schick", "Tomas Soucek", "Jan Kuchta", "Vaclav Cerny"],
  za: ["Percy Tau", "Themba Zwane", "Teboho Mokoena"],
  eg: ["Mohamed Salah", "Mostafa Mohamed", "Trézéguet"],
  ma: ["Youssef En-Nesyri", "Hakim Ziyech", "Achraf Hakimi", "Brahim Díaz"],
  qa: ["Almoez Ali", "Akram Afif", "Hassan Al-Haydos"],
  kr: ["Son Heung-min", "Lee Kang-in", "Hwang Hee-chan"],
  iq: ["Aymen Hussein", "Ali Jasim", "Mohanad Ali"],
  jo: ["Yazan Al-Naimat", "Musa Al-Taamari", "Ali Olwan"],
};

export const PLAYER_STATS: Record<string, { physicalForm: number; attackingTactics: string; playerProgression: string }> = {
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
  "Jamal Musiala": {
    physicalForm: 96,
    attackingTactics: "Presión Tras Pérdida, Juego de Posesión en Espacios Reducidos",
    playerProgression: "Dinámico: Regate indescifrable en el área con alta efectividad.",
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
};

export const AGENTS: Agent[] = [
  { id: "ptasport", name: "PtaSport", label: "ELO e Intensidad", desc: "Ponderación pesada del histórico ELO y ritmo físico del equipo." },
  { id: "alphapitch", name: "AlphaPitch", label: "Modelado Neuronal", desc: "Modelado heurístico que proyecta marcadores con variación neuronal." },
  { id: "statsbomb", name: "StatsBomb", label: "Goles Esperados", desc: "Predicción basada en xG histórico y probabilidad de tiros." },
  { id: "sportsradar", name: "SportsRadar", label: "Desgaste y Fatiga", desc: "Descuenta efectividad según la cercanía de partidos previos." },
  { id: "538quantum", name: "538 Quantum", label: "Probabilístico", desc: "Distribución de Poisson basada en el Soccer Power Index (SPI)." },
  { id: "transfermarkt", name: "Transfermarkt", label: "Valor de Plantilla", desc: "Dominancia del valor de mercado acumulado de los planteles." },
  { id: "globin", name: "Globin IA", label: "Rendimiento y Forma", desc: "Peso absoluto sobre la racha en los últimos 6 encuentros." },
  { id: "gracenote", name: "Gracenote", label: "Probabilístico ELO", desc: "Modelado clásico de ratings de selecciones nacionales." },
  { id: "sofascore", name: "Sofascore", label: "Calificación Jugadores", desc: "Agregación del rendimiento individual de las estrellas de cada selección." },
  { id: "scisports", name: "SciSports", label: "Química y Táctica", desc: "Valora la química del plantel, estabilidad de cuerpo técnico y empates." },
  { id: "deepgoal", name: "DeepGoal Neural", label: "Rendimiento Ofensivo", desc: "Algoritmo con propensión a proyectar marcadores de alta cantidad de goles." },
  { id: "tactical", name: "TacticalAnalyst", label: "Simulación Monte Carlo", desc: "Moda estadística resultante de 10,000 iteraciones rápidas." },
  { id: "oddsmaster", name: "OddsMaster", label: "Consenso Apuestas", desc: "Alineado con las cuotas de apuestas de los mercados internacionales." },
  { id: "historystats", name: "HistoryStats", label: "Historial H2H", desc: "Pondera el historial cara a cara y el peso histórico de la camiseta." },
  { id: "mourinho", name: "Mourinho Mojo", label: "Mojo Defensivo", desc: "Prioriza bloque bajo y contraataque ultraeficiente. Pronostica pocos goles." },
  { id: "bielsa", name: "Bielsa Simulator", label: "Presión y Locura", desc: "Esquema ultra ofensivo de alta presión. Proyecta partidos con muchos goles." },
  { id: "pep", name: "PepTactics AI", label: "Juego de Posición", desc: "Favorece a equipos con alta calidad técnica y volumen de juego posicional.", flag: "🧠" },
  { id: "besoccer", name: "BeSoccer AI", label: "Análisis Integral", desc: "Combina métricas de rendimiento con datos de mercado local." }
];
export const MATCHES: Match[] = [
  // ── JORNADA 1 ──
  { id: "m1", date: "15 Jun", dateFull: "Lunes, 15 de junio 2026", group: "H", teamA: "es", teamB: "cv", scoreA: 1, scoreB: 1, time: "15:00", stadium: "Estadio Atlanta", finished: true },
  { id: "m2", date: "15 Jun", dateFull: "Lunes, 15 de junio 2026", group: "G", teamA: "be", teamB: "eg", scoreA: 1, scoreB: 1, time: "18:00", stadium: "Estadio Seattle", finished: true },
  { id: "m3", date: "15 Jun", dateFull: "Lunes, 15 de junio 2026", group: "H", teamA: "sa", teamB: "uy", scoreA: 1, scoreB: 1, time: "20:00", stadium: "Estadio Miami", finished: true },
  { id: "m4", date: "15 Jun", dateFull: "Lunes, 15 de junio 2026", group: "G", teamA: "ir", teamB: "nz", scoreA: 1, scoreB: 1, time: "22:00", stadium: "Estadio Los Ángeles", finished: true },
  { id: "m5", date: "16 Jun", dateFull: "Martes, 16 de junio 2026", group: "I", teamA: "fr", teamB: "sn", scoreA: 3, scoreB: 1, time: "15:00", stadium: "Estadio Nueva York", finished: true },
  { id: "m6", date: "16 Jun", dateFull: "Martes, 16 de junio 2026", group: "I", teamA: "iq", teamB: "no", scoreA: 1, scoreB: 4, time: "18:00", stadium: "Estadio Boston", finished: true },
  { id: "m7", date: "16 Jun", dateFull: "Martes, 16 de junio 2026", group: "J", teamA: "ar", teamB: "dz", scoreA: 3, scoreB: 0, time: "20:00", stadium: "Estadio Kansas City", finished: true },
  { id: "m8", date: "16 Jun", dateFull: "Martes, 16 de junio 2026", group: "J", teamA: "at", teamB: "jo", scoreA: 3, scoreB: 1, time: "22:00", stadium: "Estadio Bahía de San Francisco", finished: true },
  { id: "m9", date: "17 Jun", dateFull: "Miércoles, 17 de junio 2026", group: "K", teamA: "pt", teamB: "cd", scoreA: 0, scoreB: 0, time: "15:00", stadium: "Estadio Houston", finished: true },
  { id: "m10", date: "17 Jun", dateFull: "Miércoles, 17 de junio 2026", group: "L", teamA: "gb_eng", teamB: "hr", scoreA: 4, scoreB: 2, time: "18:00", stadium: "Estadio Dallas", finished: true },
  { id: "m11", date: "17 Jun", dateFull: "Miércoles, 17 de junio 2026", group: "L", teamA: "gh", teamB: "pa", scoreA: 1, scoreB: 0, time: "20:00", stadium: "Estadio Toronto", finished: true },
  { id: "m12", date: "17 Jun", dateFull: "Miércoles, 17 de junio 2026", group: "K", teamA: "uz", teamB: "co", scoreA: 1, scoreB: 3, time: "22:00", stadium: "Estadio Ciudad de México", finished: true },
  { id: "m13", date: "18 Jun", dateFull: "Jueves, 18 de junio 2026", group: "A", teamA: "cz", teamB: "za", scoreA: 2, scoreB: 2, time: "15:00", stadium: "Estadio Atlanta", finished: true },
  { id: "m14", date: "18 Jun", dateFull: "Jueves, 18 de junio 2026", group: "B", teamA: "ch", teamB: "ba", scoreA: 4, scoreB: 1, time: "18:00", stadium: "Estadio Los Ángeles", finished: true },
  { id: "m15", date: "18 Jun", dateFull: "Jueves, 18 de junio 2026", group: "B", teamA: "ca", teamB: "qa", scoreA: 6, scoreB: 0, time: "20:00", stadium: "Estadio BC Place Vancouver", finished: true },
  { id: "m16", date: "18 Jun", dateFull: "Jueves, 18 de junio 2026", group: "A", teamA: "mx", teamB: "kr", scoreA: 2, scoreB: 0, time: "22:00", stadium: "Estadio Guadalajara", finished: true },
  
  // ── JORNADA 2 ──
  { id: "m17", date: "19 Jun", dateFull: "Viernes, 19 de junio 2026", group: "D", teamA: "us", teamB: "au", scoreA: 2, scoreB: 0, time: "15:00", stadium: "Estadio Seattle", finished: true },
  { id: "m18", date: "19 Jun", dateFull: "Viernes, 19 de junio 2026", group: "C", teamA: "gb_sct", teamB: "ma", scoreA: 0, scoreB: 1, time: "18:00", stadium: "Estadio Boston", finished: true },
  { id: "m19", date: "19 Jun", dateFull: "Viernes, 19 de junio 2026", group: "C", teamA: "br", teamB: "ht", scoreA: 3, scoreB: 0, time: "20:00", stadium: "Estadio Filadelfia", finished: true },
  { id: "m20", date: "19 Jun", dateFull: "Viernes, 19 de junio 2026", group: "D", teamA: "tr", teamB: "py", scoreA: 0, scoreB: 1, time: "22:00", stadium: "Estadio Bahía de San Francisco", finished: true },
  { id: "m21", date: "20 Jun", dateFull: "Sábado, 20 de junio 2026", group: "F", teamA: "nl", teamB: "se", scoreA: 4, scoreB: 0, time: "15:00", stadium: "Estadio Houston", finished: true },
  { id: "m22", date: "20 Jun", dateFull: "Sábado, 20 de junio 2026", group: "E", teamA: "de", teamB: "ci", scoreA: 2, scoreB: 1, time: "18:00", stadium: "Estadio Toronto", finished: true },
  { id: "m23", date: "20 Jun", dateFull: "Sábado, 20 de junio 2026", group: "E", teamA: "ec", teamB: "cw", scoreA: 0, scoreB: 0, time: "20:00", stadium: "Estadio Kansas City", finished: true },
  { id: "m24", date: "20 Jun", dateFull: "Sábado, 20 de junio 2026", group: "F", teamA: "tn", teamB: "jp", scoreA: 0, scoreB: 4, time: "22:00", stadium: "Estadio Monterrey", finished: true },
  { id: "m25", date: "21 Jun", dateFull: "Domingo, 21 de junio 2026", group: "H", teamA: "es", teamB: "sa", scoreA: 4, scoreB: 0, time: "15:00", stadium: "Estadio Atlanta", finished: true },
  { id: "m26", date: "21 Jun", dateFull: "Domingo, 21 de junio 2026", group: "G", teamA: "be", teamB: "ir", scoreA: 0, scoreB: 0, time: "18:00", stadium: "Estadio Los Ángeles", finished: true },
  { id: "m27", date: "21 Jun", dateFull: "Domingo, 21 de junio 2026", group: "H", teamA: "uy", teamB: "cv", scoreA: 1, scoreB: 1, time: "20:00", stadium: "Estadio Miami", finished: true },
  { id: "m28", date: "21 Jun", dateFull: "Domingo, 21 de junio 2026", group: "G", teamA: "nz", teamB: "eg", scoreA: 1, scoreB: 3, time: "22:00", stadium: "Estadio BC Place Vancouver", finished: true },
  { id: "m29", date: "22 Jun", dateFull: "Lunes, 22 de junio 2026", group: "J", teamA: "ar", teamB: "at", scoreA: 2, scoreB: 0, time: "15:00", stadium: "Estadio Dallas", finished: true },
  { id: "m30", date: "22 Jun", dateFull: "Lunes, 22 de junio 2026", group: "I", teamA: "fr", teamB: "iq", scoreA: 3, scoreB: 0, time: "18:00", stadium: "Estadio Filadelfia", finished: true },
  { id: "m31", date: "22 Jun", dateFull: "Lunes, 22 de junio 2026", group: "I", teamA: "no", teamB: "sn", scoreA: 3, scoreB: 2, time: "20:00", stadium: "Estadio Nueva York", finished: true },
  { id: "m32", date: "22 Jun", dateFull: "Lunes, 22 de junio 2026", group: "J", teamA: "jo", teamB: "dz", scoreA: 1, scoreB: 2, time: "22:00", stadium: "Estadio Bahía de San Francisco", finished: true },
  { id: "m33", date: "23 Jun", dateFull: "Martes, 23 de junio 2026", group: "K", teamA: "pt", teamB: "uz", scoreA: 5, scoreB: 0, time: "15:00", stadium: "Estadio Houston", finished: true },
  { id: "m34", date: "23 Jun", dateFull: "Martes, 23 de junio 2026", group: "L", teamA: "gb_eng", teamB: "gh", scoreA: 0, scoreB: 0, time: "18:00", stadium: "Estadio Boston", finished: true },
  { id: "m35", date: "23 Jun", dateFull: "Martes, 23 de junio 2026", group: "L", teamA: "pa", teamB: "hr", scoreA: 0, scoreB: 1, time: "20:00", stadium: "Estadio Toronto", finished: true },
  { id: "m36", date: "23 Jun", dateFull: "Martes, 23 de junio 2026", group: "K", teamA: "co", teamB: "cd", scoreA: 1, scoreB: 0, time: "22:00", stadium: "Estadio Guadalajara", finished: true },
  
  // ── JORNADA 3 ──
  { id: "m37", date: "24 Jun", dateFull: "Miércoles, 24 de junio 2026", group: "B", teamA: "ch", teamB: "ca", scoreA: 1, scoreB: 1, time: "15:00", stadium: "Estadio BC Place Vancouver", finished: true },
  { id: "m38", date: "24 Jun", dateFull: "Miércoles, 24 de junio 2026", group: "B", teamA: "ba", teamB: "qa", scoreA: 1, scoreB: 1, time: "15:00", stadium: "Estadio Seattle", finished: true },
  { id: "m39", date: "24 Jun", dateFull: "Miércoles, 24 de junio 2026", group: "C", teamA: "gb_sct", teamB: "br", scoreA: null, scoreB: null, time: "18:00", stadium: "Estadio Miami", finished: false },
  { id: "m40", date: "24 Jun", dateFull: "Miércoles, 24 de junio 2026", group: "C", teamA: "ma", teamB: "ht", scoreA: null, scoreB: null, time: "18:00", stadium: "Estadio Atlanta", finished: false },
  { id: "m41", date: "24 Jun", dateFull: "Miércoles, 24 de junio 2026", group: "A", teamA: "cz", teamB: "mx", scoreA: 0, scoreB: 1, time: "21:00", stadium: "Estadio Ciudad de México", finished: true },
  { id: "m42", date: "24 Jun", dateFull: "Miércoles, 24 de junio 2026", group: "A", teamA: "za", teamB: "kr", scoreA: 0, scoreB: 2, time: "21:00", stadium: "Estadio Monterrey", finished: true },
  
  { id: "m43", date: "25 Jun", dateFull: "Jueves, 25 de junio 2026", group: "E", teamA: "cw", teamB: "ci", scoreA: null, scoreB: null, time: "16:00", stadium: "Estadio Filadelfia", finished: false },
  { id: "m44", date: "25 Jun", dateFull: "Jueves, 25 de junio 2026", group: "E", teamA: "ec", teamB: "de", scoreA: null, scoreB: null, time: "16:00", stadium: "Estadio Nueva York", finished: false },
  { id: "m45", date: "25 Jun", dateFull: "Jueves, 25 de junio 2026", group: "F", teamA: "jp", teamB: "se", scoreA: null, scoreB: null, time: "19:00", stadium: "Estadio Dallas", finished: false },
  { id: "m46", date: "25 Jun", dateFull: "Jueves, 25 de junio 2026", group: "F", teamA: "tn", teamB: "nl", scoreA: null, scoreB: null, time: "19:00", stadium: "Estadio Kansas City", finished: false },
  { id: "m47", date: "25 Jun", dateFull: "Jueves, 25 de junio 2026", group: "D", teamA: "tr", teamB: "us", scoreA: null, scoreB: null, time: "22:00", stadium: "Estadio Los Ángeles", finished: false },
  { id: "m48", date: "25 Jun", dateFull: "Jueves, 25 de junio 2026", group: "D", teamA: "py", teamB: "au", scoreA: null, scoreB: null, time: "22:00", stadium: "Estadio Bahía de San Francisco", finished: false },
  
  { id: "m49", date: "26 Jun", dateFull: "Viernes, 26 de junio 2026", group: "I", teamA: "no", teamB: "fr", scoreA: null, scoreB: null, time: "15:00", stadium: "Estadio Boston", finished: false },
  { id: "m50", date: "26 Jun", dateFull: "Viernes, 26 de junio 2026", group: "I", teamA: "sn", teamB: "iq", scoreA: null, scoreB: null, time: "15:00", stadium: "Estadio Toronto", finished: false },
  { id: "m51", date: "26 Jun", dateFull: "Viernes, 26 de junio 2026", group: "H", teamA: "cv", teamB: "sa", scoreA: null, scoreB: null, time: "20:00", stadium: "Estadio Houston", finished: false },
  { id: "m52", date: "26 Jun", dateFull: "Viernes, 26 de junio 2026", group: "H", teamA: "uy", teamB: "es", scoreA: null, scoreB: null, time: "20:00", stadium: "Estadio Guadalajara", finished: false },
  { id: "m53", date: "26 Jun", dateFull: "Viernes, 26 de junio 2026", group: "G", teamA: "eg", teamB: "ir", scoreA: null, scoreB: null, time: "23:00", stadium: "Estadio Seattle", finished: false },
  { id: "m54", date: "26 Jun", dateFull: "Viernes, 26 de junio 2026", group: "G", teamA: "nz", teamB: "be", scoreA: null, scoreB: null, time: "23:00", stadium: "Estadio BC Place Vancouver", finished: false },
  
  // ── JORNADA 3 (cont.) ──
  { id: "m55", date: "27 Jun", dateFull: "Sábado, 27 de junio 2026", group: "L", teamA: "pa", teamB: "gb_eng", scoreA: null, scoreB: null, time: "17:00", stadium: "Estadio Nueva York", finished: false },
  { id: "m56", date: "27 Jun", dateFull: "Sábado, 27 de junio 2026", group: "L", teamA: "hr", teamB: "gh", scoreA: null, scoreB: null, time: "17:00", stadium: "Estadio Filadelfia", finished: false },
  { id: "m57", date: "27 Jun", dateFull: "Sábado, 27 de junio 2026", group: "K", teamA: "co", teamB: "pt", scoreA: null, scoreB: null, time: "19:30", stadium: "Estadio Miami", finished: false },
  { id: "m58", date: "27 Jun", dateFull: "Sábado, 27 de junio 2026", group: "K", teamA: "cd", teamB: "uz", scoreA: null, scoreB: null, time: "19:30", stadium: "Estadio Atlanta", finished: false },
  { id: "m59", date: "27 Jun", dateFull: "Sábado, 27 de junio 2026", group: "J", teamA: "dz", teamB: "at", scoreA: null, scoreB: null, time: "22:00", stadium: "Estadio Kansas City", finished: false },
  { id: "m60", date: "27 Jun", dateFull: "Sábado, 27 de junio 2026", group: "J", teamA: "jo", teamB: "ar", scoreA: null, scoreB: null, time: "22:00", stadium: "Estadio Dallas", finished: false },
  
  { id: "m61", date: "28 Jun", dateFull: "Domingo, 28 de junio 2026", group: "B", teamA: "ch", teamB: "qa", scoreA: null, scoreB: null, time: "15:00", stadium: "Estadio Seattle", finished: false },
  { id: "m62", date: "28 Jun", dateFull: "Domingo, 28 de junio 2026", group: "B", teamA: "ba", teamB: "ca", scoreA: null, scoreB: null, time: "15:00", stadium: "Estadio BC Place Vancouver", finished: false },
  { id: "m63", date: "28 Jun", dateFull: "Domingo, 28 de junio 2026", group: "C", teamA: "gb_sct", teamB: "ht", scoreA: 1, scoreB: 0, time: "18:00", stadium: "Estadio Atlanta", finished: true },
  { id: "m64", date: "28 Jun", dateFull: "Domingo, 28 de junio 2026", group: "C", teamA: "ma", teamB: "br", scoreA: 1, scoreB: 1, time: "18:00", stadium: "Estadio Miami", finished: true },
  { id: "m65", date: "28 Jun", dateFull: "Domingo, 28 de junio 2026", group: "A", teamA: "cz", teamB: "kr", scoreA: null, scoreB: null, time: "21:00", stadium: "Estadio Monterrey", finished: false },
  { id: "m66", date: "28 Jun", dateFull: "Domingo, 28 de junio 2026", group: "A", teamA: "za", teamB: "mx", scoreA: null, scoreB: null, time: "21:00", stadium: "Estadio Ciudad de México", finished: false },
  
  { id: "m67", date: "29 Jun", dateFull: "Lunes, 29 de junio 2026", group: "E", teamA: "cw", teamB: "de", scoreA: 0, scoreB: 6, time: "16:00", stadium: "Estadio Filadelfia", finished: true },
  { id: "m68", date: "29 Jun", dateFull: "Lunes, 29 de junio 2026", group: "E", teamA: "ec", teamB: "ci", scoreA: 0, scoreB: 1, time: "16:00", stadium: "Estadio Nueva York", finished: true },
  { id: "m69", date: "29 Jun", dateFull: "Lunes, 29 de junio 2026", group: "F", teamA: "jp", teamB: "nl", scoreA: 1, scoreB: 1, time: "19:00", stadium: "Estadio Dallas", finished: true },
  { id: "m70", date: "29 Jun", dateFull: "Lunes, 29 de junio 2026", group: "F", teamA: "tn", teamB: "se", scoreA: 0, scoreB: 4, time: "19:00", stadium: "Estadio Kansas City", finished: true },
  { id: "m71", date: "29 Jun", dateFull: "Lunes, 29 de junio 2026", group: "D", teamA: "tr", teamB: "au", scoreA: 0, scoreB: 2, time: "22:00", stadium: "Estadio Los Ángeles", finished: true },
  { id: "m72", date: "29 Jun", dateFull: "Lunes, 29 de junio 2026", group: "D", teamA: "py", teamB: "us", scoreA: 1, scoreB: 4, time: "22:00", stadium: "Estadio Bahía de San Francisco", finished: true },
];
