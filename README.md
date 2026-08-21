# GolCast

Marcadores probables de fútbol para cualquier liga, cada uno con la probabilidad que lo
respalda y con el historial de aciertos a la vista.

**Web:** https://leoction1-design.github.io/PREDICTOR-MUNDIAL-FIIFA-2026/
(requiere activar GitHub Pages: Settings → Pages → rama `main`, carpeta `/docs`)

## Qué hay aquí

| | |
|---|---|
| `docs/` | El sitio publicado. `index.html` es autocontenido; `datos.json` son los mismos datos sueltos. |
| `web/plantilla.html` | La plantilla de la que sale `docs/index.html`. **Aquí se edita el diseño**, no en docs/. |
| `android/` | Envoltorio Capacitor. Empaqueta `docs/` tal cual. |

El generador vive fuera del repositorio, en `futbol/construir_web.py`: ensambla la plantilla
con los datos del día y escribe `docs/`.

## El modelo

**Dixon-Coles** ajustado liga por liga por máxima verosimilitud sobre resultados reales, con
tres correcciones que se midieron una por una contra datos que el modelo no había visto:

- **Calibración de goles por liga.** El ajuste dejaba un sesgo bajista de 0,20 goles por
  partido (t = −5,2 sobre 2247 partidos). Un factor global único empeoraba el marcador exacto;
  por liga mejora las dos cosas.
- **Calibración al mercado.** Cuando hay cuotas, se conserva el total de goles del modelo y se
  ajusta el reparto local/visitante al que implican los precios. Es el ingrediente decisivo:
  con cuotas el modelo bate el listón de «decir siempre 1-1»; sin ellas, no.
- **Encogimiento hacia la distribución empírica** (15%). El Dixon-Coles deja seca la cola de
  marcadores —3-2, 4-1 y compañía son más de un tercio de los partidos reales— y esto la
  repone. Log-loss 3,0728 → 3,0577, t = 3,45.

El marcador que se muestra es la celda más probable **dentro del resultado más probable**, no
la de toda la rejilla. La celda global suele ser un empate aunque el modelo crea que gana el
local, y la página acababa contradiciéndose a sí misma.

## Honestidad

La página enseña su propio expediente en la pestaña **Resultados**: cada predicción junto al
resultado real, y al lado el listón de «decir siempre 1-1». Un predictor que solo muestra lo
que va a pasar y esconde lo que pasó no es verificable.

El marcador más probable de un partido de fútbol sigue siendo improbable: ronda el 11%. Eso no
es un fallo del modelo, es cómo es el fútbol.

## La APK

```bash
npm install
npm run apk        # cap sync + gradlew assembleDebug
```

O desde Actions → Build Android APK → Run workflow, que deja la APK como artefacto.

**No hace falta recompilarla cuando cambian los datos.** La página empaquetada pide
`docs/datos.json` al abrirse y se pone al día sola; si no hay red, se queda con lo último que
vio. Recompilar solo hace falta si cambia el diseño o el motor.
