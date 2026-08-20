# Marcador Probable

Pronósticos de marcador para partidos de fútbol de cualquier liga, acompañados de la
probabilidad que los respalda.

## Qué hace

El modelo es un **Dixon-Coles** ajustado liga por liga sobre resultados reales: estima el
ataque y la defensa de cada equipo por máxima verosimilitud y produce una distribución de
probabilidad sobre todos los marcadores posibles, no un resultado seco.

Cuando el partido tiene cuotas de mercado disponibles, la predicción se **calibra al mercado**:
se conserva el total de goles del modelo y se ajusta el reparto local/visitante hasta
reproducir el 1X2 que implican las cuotas. El mercado tiene las mejores probabilidades de
resultado que existen pero no publica distribución de marcadores; Dixon-Coles aporta la forma.

Medido sobre 665 partidos fuera de muestra:

| | log-loss marcador | log-loss 1X2 | marcador exacto |
|---|---|---|---|
| Modelo solo | 3,1397 | 1,0643 | 11,73% |
| **Calibrado al mercado** | **3,0647** | **1,0069** | **12,48%** |
| Mercado (referencia) | — | 1,0017 | — |
| Decir siempre «1-1» | — | — | 10,68% |

Prueba pareada del calibrado contra el modelo solo, en log-loss de marcador: t = −4,62,
IC95 bootstrap [−0,108, −0,044], mejora en el 57,6% de los partidos individuales.

## Lo que conviene saber antes de usarlo

**El marcador más probable de un partido de fútbol ronda el 10-20% de probabilidad.** La app
lo muestra siempre junto al marcador por esa razón. Un pronóstico al 13% falla 87 veces de
cada 100, y eso no es un defecto del modelo: es cómo es el fútbol.

**El listón real es «decir siempre 1-1»**, que acierta un 10,2% sin modelo alguno. La ventaja
del modelo sobre esa estrategia trivial es de menos de dos puntos. Cualquier sistema que
prometa mucho más está midiendo mal o mirando solo sus aciertos.

## Estructura

```
src/
  dixonColes.ts        distribución de marcadores y calibración al mercado
  simulator.ts         motor de las vistas de torneo
  realData.json        fixtures y lambdas, generadas por el pipeline
  brand.ts             nombre e identidad, en un solo sitio
  components/
    RealMatchesView.tsx   partidos reales de cualquier liga
    MatchDetailModal.tsx  detalle con distribución y reporte táctico
server.js              endpoint /api/analyze, texto táctico con Gemini
```

Los datos de partidos se generan fuera del repo con el pipeline de Forebet y se vuelcan en
`src/realData.json`. Ese archivo es la única entrada de datos reales de la app.

## Ejecutar

```bash
npm install
npm run dev          # http://localhost:3000
```

Para el reporte táctico opcional hace falta una clave de Gemini en `.env.local`:

```
GEMINI_API_KEY="tu-clave"
```

Sin clave la app funciona igual; solo ese panel queda inactivo. **La clave no interviene en el
pronóstico** — Gemini escribe el comentario táctico, el marcador sale del modelo.

## Android

Ver [ANDROID_BUILD.md](ANDROID_BUILD.md).
